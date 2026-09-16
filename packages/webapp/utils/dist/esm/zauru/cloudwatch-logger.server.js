import { CloudWatchLogsClient, CreateLogGroupCommand, CreateLogStreamCommand, DescribeLogStreamsCommand, PutLogEventsCommand, ResourceAlreadyExistsException, InvalidSequenceTokenException, DataAlreadyAcceptedException, } from "@aws-sdk/client-cloudwatch-logs";
/**
 * Server logger for AWS CloudWatch Logs, with `console.*` as a fallback so
 * events still appear in the host (Netlify) logs.
 *
 * Enable by setting `CLOUDWATCH_LOG_GROUP` plus any complete AWS credential
 * prefix (first match wins):
 * - `CLOUDWATCH_AWS_REGION` / `CLOUDWATCH_AWS_ACCESS_KEY_ID` / `CLOUDWATCH_AWS_SECRET_ACCESS_KEY`
 * - `APPOCUS_AWS_*`
 * - `C4PINOS_AWS_*`
 * - `AWS_*`
 *
 * Missing env → no-op for CloudWatch (still logs to console). Never throws.
 *
 * Naming:
 * - Log group = `CLOUDWATCH_LOG_GROUP`
 * - Group tags: `Project=<logGroup>`, `Env=<APP_ENV>`
 * - Streams: `<APP_ENV>/client`, `<APP_ENV>/server`, `<APP_ENV>/background-functions`
 */
const MAX_EVENT_CHARS = 240_000;
const MAX_BATCH_EVENTS = 50;
const AWS_CANDIDATES = [
    {
        region: "CLOUDWATCH_AWS_REGION",
        key: "CLOUDWATCH_AWS_ACCESS_KEY_ID",
        secret: "CLOUDWATCH_AWS_SECRET_ACCESS_KEY",
        label: "CLOUDWATCH_AWS_*",
    },
    {
        region: "APPOCUS_AWS_REGION",
        key: "APPOCUS_AWS_ACCESS_KEY_ID",
        secret: "APPOCUS_AWS_SECRET_ACCESS_KEY",
        label: "APPOCUS_AWS_*",
    },
    {
        region: "C4PINOS_AWS_REGION",
        key: "C4PINOS_AWS_ACCESS_KEY_ID",
        secret: "C4PINOS_AWS_SECRET_ACCESS_KEY",
        label: "C4PINOS_AWS_*",
    },
    {
        region: "AWS_REGION",
        key: "AWS_ACCESS_KEY_ID",
        secret: "AWS_SECRET_ACCESS_KEY",
        label: "AWS_*",
    },
];
let client = null;
let clientKey = null;
/** Sequence token per stream. Survives while the lambda instance is warm. */
const sequenceTokens = {};
/** Serializes PutLogEvents so sequence tokens are not overwritten. */
let putChain = Promise.resolve();
function envTrim(name) {
    const v = process.env[name];
    if (!v || v.trim() === "")
        return undefined;
    return v.trim();
}
function resolveAwsCreds() {
    for (const c of AWS_CANDIDATES) {
        const region = envTrim(c.region);
        const accessKeyId = envTrim(c.key);
        const secretAccessKey = envTrim(c.secret);
        if (region && accessKeyId && secretAccessKey) {
            return { region, accessKeyId, secretAccessKey, prefixLabel: c.label };
        }
    }
    return null;
}
function getLogGroup() {
    return envTrim("CLOUDWATCH_LOG_GROUP");
}
function getEnvName() {
    return envTrim("APP_ENV") ?? "development";
}
function getDefaultAppVersion() {
    return envTrim("APP_VERSION") ?? envTrim("npm_package_version") ?? "unknown";
}
/**
 * Introspection for smoke tests / diagnostics. Never returns secrets.
 */
export function resolveCloudWatchConfig() {
    const logGroup = getLogGroup();
    const creds = resolveAwsCreds();
    const appEnv = getEnvName();
    const appVersion = getDefaultAppVersion();
    if (!logGroup && !creds) {
        return {
            enabled: false,
            appEnv,
            appVersion,
            skipReason: "faltan CLOUDWATCH_LOG_GROUP y credenciales AWS (CLOUDWATCH_AWS_*, APPOCUS_AWS_*, C4PINOS_AWS_* o AWS_*)",
        };
    }
    if (!logGroup) {
        return {
            enabled: false,
            region: creds?.region,
            prefixLabel: creds?.prefixLabel,
            appEnv,
            appVersion,
            skipReason: "falta CLOUDWATCH_LOG_GROUP",
        };
    }
    if (!creds) {
        return {
            enabled: false,
            logGroup,
            appEnv,
            appVersion,
            skipReason: "faltan credenciales AWS (CLOUDWATCH_AWS_*, APPOCUS_AWS_*, C4PINOS_AWS_* o AWS_*)",
        };
    }
    return {
        enabled: true,
        logGroup,
        region: creds.region,
        prefixLabel: creds.prefixLabel,
        appEnv,
        appVersion,
    };
}
export function isCloudWatchEnabled() {
    return resolveCloudWatchConfig().enabled;
}
function getClient() {
    const creds = resolveAwsCreds();
    if (!creds) {
        throw new Error("CloudWatch deshabilitado: faltan credenciales AWS");
    }
    const key = `${creds.prefixLabel}:${creds.region}:${creds.accessKeyId}`;
    if (!client || clientKey !== key) {
        client = new CloudWatchLogsClient({
            region: creds.region,
            credentials: {
                accessKeyId: creds.accessKeyId,
                secretAccessKey: creds.secretAccessKey,
            },
        });
        clientKey = key;
    }
    return client;
}
function streamName(origin) {
    const env = getEnvName();
    switch (origin) {
        case "client":
            return `${env}/client`;
        case "server":
            return `${env}/server`;
        case "background":
            return `${env}/background-functions`;
        default: {
            const _never = origin;
            throw new Error(`Origen de log no soportado: ${String(_never)}`);
        }
    }
}
async function ensureStreamExists(cw, logGroup, stream) {
    try {
        await cw.send(new CreateLogGroupCommand({
            logGroupName: logGroup,
            tags: {
                Project: logGroup,
                Env: getEnvName(),
            },
        }));
    }
    catch (err) {
        if (!(err instanceof ResourceAlreadyExistsException)) {
            // IAM without logs:TagResource → CreateLogGroup with tags fails.
            // Retry without tags (CreateLogGroup only).
            try {
                await cw.send(new CreateLogGroupCommand({
                    logGroupName: logGroup,
                }));
            }
            catch (retryErr) {
                if (!(retryErr instanceof ResourceAlreadyExistsException)) {
                    console.error("[observability] No se pudo crear el log group CloudWatch:", retryErr instanceof Error ? retryErr.message : retryErr);
                }
            }
        }
    }
    try {
        await cw.send(new CreateLogStreamCommand({
            logGroupName: logGroup,
            logStreamName: stream,
        }));
    }
    catch (err) {
        if (!(err instanceof ResourceAlreadyExistsException)) {
            console.error("[observability] No se pudo crear el log stream CloudWatch:", err instanceof Error ? err.message : err);
        }
    }
}
/** Current sequence token of the stream (for cold starts). */
async function fetchSequenceToken(cw, logGroup, stream) {
    try {
        const res = await cw.send(new DescribeLogStreamsCommand({
            logGroupName: logGroup,
            logStreamNamePrefix: stream,
            limit: 1,
        }));
        return res.logStreams?.[0]?.uploadSequenceToken;
    }
    catch {
        return undefined;
    }
}
const RESERVED_KEYS = new Set([
    "message",
    "stack",
    "url",
    "method",
    "userAgent",
    "userId",
    "appVersion",
    "timestamp",
    "source",
    "level",
]);
function levelPrefix(origin, level) {
    if (origin !== "background") {
        return "[ERROR]";
    }
    switch (level) {
        case "error":
            return "[ERROR]";
        case "warn":
            return "[WARN]";
        case "info":
            return "[INFO]";
        case undefined:
            return "[INFO]";
        default: {
            const _never = level;
            return String(_never);
        }
    }
}
function buildLogLine(origin, payload) {
    const ts = new Date(payload.timestamp ?? Date.now()).toISOString();
    const source = payload.source ?? "unknown";
    const parts = [
        levelPrefix(origin, payload.level),
        `[${origin}]`,
        `[${source}]`,
        ts,
        payload.message,
    ];
    if (payload.url)
        parts.push(`url=${payload.url}`);
    if (payload.method)
        parts.push(`method=${payload.method}`);
    if (payload.userId != null)
        parts.push(`user=${payload.userId}`);
    if (payload.appVersion)
        parts.push(`v=${payload.appVersion}`);
    for (const [k, v] of Object.entries(payload)) {
        if (RESERVED_KEYS.has(k))
            continue;
        try {
            parts.push(`${k}=${typeof v === "string" ? v : JSON.stringify(v)}`);
        }
        catch {
            parts.push(`${k}=[unserializable]`);
        }
    }
    if (payload.stack)
        parts.push(`\n${payload.stack}`);
    return parts.join(" ");
}
function truncateEvent(message) {
    if (message.length <= MAX_EVENT_CHARS)
        return message;
    return `${message.slice(0, MAX_EVENT_CHARS)}…[truncated]`;
}
async function putEvents(cw, logGroup, stream, messages) {
    let sequenceToken = sequenceTokens[stream];
    if (!sequenceToken) {
        sequenceToken = await fetchSequenceToken(cw, logGroup, stream);
    }
    const startedAt = Date.now();
    const input = {
        logGroupName: logGroup,
        logStreamName: stream,
        logEvents: messages.map((m, index) => ({
            message: truncateEvent(m),
            timestamp: startedAt + index,
        })),
        sequenceToken,
    };
    try {
        const res = await cw.send(new PutLogEventsCommand(input));
        sequenceTokens[stream] = res.nextSequenceToken;
    }
    catch (err) {
        if (err instanceof InvalidSequenceTokenException) {
            const expected = err.expectedSequenceToken;
            if (!expected)
                throw err;
            const res = await cw.send(new PutLogEventsCommand({ ...input, sequenceToken: expected }));
            sequenceTokens[stream] = res.nextSequenceToken;
        }
        else if (err instanceof DataAlreadyAcceptedException) {
            sequenceTokens[stream] = err.expectedSequenceToken;
        }
        else {
            throw err;
        }
    }
}
function serializePut(fn) {
    const next = putChain.then(fn, fn);
    putChain = next.then(() => undefined, () => undefined);
    return next;
}
async function emitToCloudWatch(origin, lines) {
    if (lines.length === 0) {
        return { status: "skipped", reason: "sin eventos" };
    }
    const cfg = resolveCloudWatchConfig();
    if (!cfg.enabled || !cfg.logGroup) {
        return {
            status: "skipped",
            reason: cfg.skipReason ?? "CloudWatch deshabilitado",
        };
    }
    try {
        const cw = getClient();
        const logGroup = cfg.logGroup;
        const stream = streamName(origin);
        await ensureStreamExists(cw, logGroup, stream);
        for (let i = 0; i < lines.length; i += MAX_BATCH_EVENTS) {
            const chunk = lines.slice(i, i + MAX_BATCH_EVENTS);
            await serializePut(() => putEvents(cw, logGroup, stream, chunk));
        }
        return { status: "sent", logGroup, stream };
    }
    catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        console.error("[observability] Falló envío a CloudWatch:", err);
        return { status: "failed", error };
    }
}
/**
 * Sends an event to CloudWatch. Never throws.
 * For client/server also prints with `console.error` (Netlify fallback).
 */
export async function logEvent(origin, payload) {
    const line = buildLogLine(origin, {
        ...payload,
        appVersion: payload.appVersion ?? getDefaultAppVersion(),
    });
    if (origin !== "background") {
        console.error(`[observability] ${line}`);
    }
    else {
        console.log(`[observability] ${line}`);
    }
    return emitToCloudWatch(origin, [line]);
}
/**
 * Sends an error event to CloudWatch (and console.error as fallback).
 * Never throws: if CloudWatch fails, the error still lands in host logs.
 */
export async function logError(origin, payload) {
    return logEvent(origin, { ...payload, level: "error" });
}
function formatConsoleArgs(args) {
    return args
        .map((arg) => {
        if (typeof arg === "string")
            return arg;
        if (arg instanceof Error)
            return arg.stack ?? arg.message;
        try {
            return JSON.stringify(arg);
        }
        catch {
            return String(arg);
        }
    })
        .join(" ");
}
/**
 * Wraps a Netlify background handler: intercepts console.log/error/warn
 * during the invocation, prefixes `[functionName]:`, and flushes to the
 * `<APP_ENV>/background-functions` stream before returning (so logs are not
 * lost when Netlify freezes the isolate).
 */
export function withBackgroundLogs(functionName, handler) {
    return async (event, context) => {
        const prefix = `[${functionName}]:`;
        const origLog = console.log;
        const origError = console.error;
        const origWarn = console.warn;
        const buffer = [];
        const enqueue = (args) => {
            buffer.push(`${prefix} ${formatConsoleArgs(args)}`);
        };
        console.log = (...args) => {
            origLog(prefix, ...args);
            enqueue(args);
        };
        console.error = (...args) => {
            origError(prefix, ...args);
            enqueue(args);
        };
        console.warn = (...args) => {
            origWarn(prefix, ...args);
            enqueue(args);
        };
        try {
            return await handler(event, context);
        }
        finally {
            console.log = origLog;
            console.error = origError;
            console.warn = origWarn;
            await emitToCloudWatch("background", buffer);
        }
    };
}
