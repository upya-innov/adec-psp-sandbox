export async function apiFetch(params: {
  endpoint: string;
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  queryParams?: Record<string, any>;
  environment?: 'sandbox' | 'live';
}) {
  const res = await fetch('/api/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-cache',
    body: JSON.stringify({
      endpoint: params.endpoint,
      method: (params.method || 'GET').toUpperCase(),
      headers: params.headers || {},
      body: params.body,
      queryParams: params.queryParams || {},
      environment: params.environment || 'sandbox',
    }),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json?.data?.message || json?.error || `HTTP ${json.status}`);
  }
  return json;
}
