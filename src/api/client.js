const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;
  if (options.body !== undefined && !isFormData) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Accept", "application/json");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
  if (response.status === 401 && typeof window !== "undefined") {
    window.dispatchEvent(new Event("lecture-buddy:unauthorized"));
  }
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();
  if (!response.ok) {
    const detail = typeof payload === "object" ? payload?.detail : payload;
    const message = Array.isArray(detail)
      ? detail.map((item) => item.msg || String(item)).join("; ")
      : detail;
    throw new ApiError(message || `Request failed (${response.status})`, response.status);
  }
  return payload;
}

export const apiGet = (path) => apiRequest(path);
export const apiPost = (path, body) =>
  apiRequest(path, {
    method: "POST",
    ...(body === undefined
      ? {}
      : { body: body instanceof FormData ? body : JSON.stringify(body) }),
  });
export const apiPatch = (path, body) =>
  apiRequest(path, { method: "PATCH", body: JSON.stringify(body) });
export const apiDelete = (path) => apiRequest(path, { method: "DELETE" });
export const sourceDownloadUrl = (sourceId) =>
  `${API_BASE_URL}/sources/${encodeURIComponent(sourceId)}/download`;
