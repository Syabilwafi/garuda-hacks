import { env } from "@/config/env";
import { API_CONFIG, ERROR_MESSAGES } from "@/constants";

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface FetchOptions extends RequestInit {
  timeout?: number;
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    timeout = API_CONFIG.TIMEOUT_MS,
    ...fetchOptions
  } = options;

  const url = `${env.BACKEND_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof TypeError) {
      throw new ApiError(0, ERROR_MESSAGES.NETWORK_ERROR, error as Error);
    }
    throw new ApiError(500, ERROR_MESSAGES.SERVER_ERROR, error as Error);
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function apiClientMultipart<T>(
  endpoint: string,
  formData: FormData,
  options: Omit<FetchOptions, "body"> = {}
): Promise<T> {
  const {
    timeout = API_CONFIG.VIDEO_PROCESS_TIMEOUT_MS,
    ...fetchOptions
  } = options;

  const url = `${env.BACKEND_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: "POST",
      ...fetchOptions,
      signal: controller.signal,
      body: formData,
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof TypeError) {
      throw new ApiError(0, ERROR_MESSAGES.NETWORK_ERROR, error as Error);
    }
    throw new ApiError(500, ERROR_MESSAGES.SERVER_ERROR, error as Error);
  } finally {
    clearTimeout(timeoutId);
  }
}
