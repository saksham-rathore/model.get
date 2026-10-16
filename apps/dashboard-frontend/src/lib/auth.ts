export const API_BASE_URL = "http://localhost:4000";

export interface AuthResponse {
  message?: string;
  id?: string;
}

export interface BackendApiKey {
  id: string;
  apiKey: string;
  name: string;
  credisConsumed: number;
  lastUsed: string | null;
  disabled: boolean;
}

export async function signUpApi(params: {
  email: string;
  password: string;
}): Promise<{ id: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email: params.email,
      password: params.password,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Error while signing up");
  }

  return data;
}

export async function signInApi(params: {
  email: string;
  password: string;
}): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email: params.email,
      password: params.password,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Incorrect credentials");
  }

  return data;
}

export async function createApiKeyApi(params: {
  name: string;
}): Promise<{ id: string; apiKey: string }> {
  const response = await fetch(`${API_BASE_URL}/api-keys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name: params.name,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to create API key");
  }

  return data;
}

export async function getApiKeysApi(): Promise<{ apiKeys: BackendApiKey[] }> {
  const response = await fetch(`${API_BASE_URL}/api-keys`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch API keys");
  }

  return data;
}

export async function updateApiKeyApi(params: {
  id: string;
  disabled: boolean;
}): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/api-keys`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      id: params.id,
      disabled: params.disabled,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update API key");
  }

  return data;
}

export async function deleteApiKeyApi(
  id: string,
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/api-keys/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to delete API key");
  }

  return data;
}
