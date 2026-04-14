export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const TOKEN_STORAGE_KEY = 'taskflow_token';

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string;
}

export const apiRequest = async <T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const { method = 'GET', body, token } = options;

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(typeof body !== 'undefined' ? { body: JSON.stringify(body) } : {}),
  });

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
        ? data.message
        : 'Request failed';
    throw new Error(errorMessage);
  }

  return data as T;
};
