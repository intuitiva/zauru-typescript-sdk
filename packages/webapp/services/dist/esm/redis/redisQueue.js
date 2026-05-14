import { Redis } from "@upstash/redis";
import { config } from "@zauru-sdk/config";
const redis = new Redis({
    url: config.redisBaseURL,
    token: config.redisToken,
});
// Función para intentar adquirir el lock
export async function acquireLock(key, lockValue, expiration) {
    // Usamos SET con NX (solo si no existe) y PX para expirar el lock en milisegundos
    const result = await redis.set(key, lockValue, {
        nx: true,
        pxat: Date.now() + expiration,
    });
    return result === "OK";
}
// Función para liberar el lock de forma segura usando un script Lua
export async function releaseLock(key, lockValue) {
    const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;
    await redis.eval(script, [key], [lockValue]);
}
