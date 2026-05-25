import { env } from '@/lib/env/server';

type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    public title: string,
    public detail: string,
  ) {
    super(detail);
    this.name = 'ApiError';
  }
}

interface ProblemDetails {
  title?: string;
  detail?: string;
  status?: number;
  [key: string]: unknown;
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...init } = options;

  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`${env.API_URL}/api${path}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  if (!response.ok) {
    let errorData: ProblemDetails = {};

    try {
      errorData = await response.json();
    } catch {
      // If parsing fails, use default values
    }

    const title = errorData.title || response.statusText;
    const detail = errorData.detail || 'Ocurrió un error inesperado';

    throw new ApiError(response.status, title, detail);
  }

  if (response.status === 204 || response.status === 201) {
    return {} as T;
  }

  try {
    return await response.json();
  } catch (_) {
    throw new ApiError(
      response.status,
      'Error de Comunicación',
      'Recibimos una respuesta inválida del servidor. Por favor intenta nuevamente.',
    );
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: FetchOptions) => request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined && body !== null ? JSON.stringify(body) : JSON.stringify({}),
    }),

  put: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined && body !== null ? JSON.stringify(body) : JSON.stringify({}),
    }),

  patch: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body !== undefined && body !== null ? JSON.stringify(body) : JSON.stringify({}),
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) => request<T>(endpoint, { ...options, method: 'DELETE' }),
};
