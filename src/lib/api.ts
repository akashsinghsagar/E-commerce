const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) {
    throw new ApiError(0, 'Backend API is not configured. Using local demo data.');
  }
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(response.status, body.detail || 'The backend request failed.');
  }
  return response.status === 204 ? (undefined as T) : response.json();
}

export const api = {
  health: () => request<{ status: string }>('/health'),
  products: (search?: string) => request('/products' + (search ? `?search=${encodeURIComponent(search)}` : '')),
  register: (payload: { email: string; full_name: string; phone?: string; password: string }) =>
    request<{ access_token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload: { email: string; password: string }) =>
    request<{ access_token: string }>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
};
