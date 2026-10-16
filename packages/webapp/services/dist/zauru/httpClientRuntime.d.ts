import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { type HttpClientKind } from "@zauru-sdk/common";
export declare function applyHttpClientTimeout(request: InternalAxiosRequestConfig, client: HttpClientKind): InternalAxiosRequestConfig;
export declare function maybeRetryHttpRequest(error: unknown, instance: AxiosInstance, client: HttpClientKind): Promise<unknown | null>;
