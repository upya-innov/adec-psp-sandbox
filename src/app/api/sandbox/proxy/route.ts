import { NextRequest, NextResponse } from 'next/server';

type ProxyPayload = {
  endpoint: string;                 // ex: "/payments/initiate"
  method?: string;                  // GET/POST/...
  headers?: Record<string, string>; // Authorization / X-API-Key etc.
  body?: any;                       // JSON body
  queryParams?: Record<string, any>;
};

const BASE_URL = 'https://psp-api.fineopay.com/api/v1';

// Headers que tu ne veux jamais forwarder (sécurité)
const BLOCKED_HEADERS = new Set([
  'host',
  'connection',
  'content-length',
  'accept-encoding',
  'x-forwarded-for',
  'x-forwarded-proto',
]);

function normalizeHeaderKey(k: string) {
  return k.toLowerCase().trim();
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as ProxyPayload;

    const {
      endpoint,
      method = 'GET',
      headers = {},
      body: requestBody,
      queryParams = {},
    } = payload;

    if (!endpoint || typeof endpoint !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid endpoint' },
        { status: 400 }
      );
    }

    // Construire l’URL (endpoint doit commencer par /)
    const safeEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${BASE_URL}${safeEndpoint}`);

    // Query params
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });

    // Construire headers vers l'upstream
    const upstreamHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Forward headers client (sauf bloqués)
    for (const [k, v] of Object.entries(headers)) {
      if (!v) continue;
      const lk = normalizeHeaderKey(k);
      if (BLOCKED_HEADERS.has(lk)) continue;
      upstreamHeaders[k] = v;
    }

    // 🔐 Option sécurisée: injecter la clé API côté serveur
    // Mets PSP_API_KEY dans .env.production du serveur Next
    const serverApiKey = process.env.PSP_API_KEY;
    if (serverApiKey) {
      upstreamHeaders['x-api-key'] = serverApiKey;
      upstreamHeaders['X-API-Key'] = serverApiKey;
    } else {
      // Si tu veux autoriser le client à envoyer la clé (moins sécurisé),
      // garde cette partie (sinon tu peux la supprimer)
      if (upstreamHeaders['X-API-Key'] && !upstreamHeaders['x-api-key']) {
        upstreamHeaders['x-api-key'] = upstreamHeaders['X-API-Key'];
      }
      if (upstreamHeaders['x-api-key'] && !upstreamHeaders['X-API-Key']) {
        upstreamHeaders['X-API-Key'] = upstreamHeaders['x-api-key'];
      }
    }

    const upperMethod = method.toUpperCase();

    const upstreamResponse = await fetch(url.toString(), {
      method: upperMethod,
      headers: upstreamHeaders,
      body:
        ['POST', 'PUT', 'PATCH', 'DELETE'].includes(upperMethod) && requestBody !== undefined
          ? JSON.stringify(requestBody)
          : undefined,
      cache: 'no-store',
    });

    const contentType = upstreamResponse.headers.get('content-type') || '';
    const rawText = await upstreamResponse.text();

    let data: any = rawText;
    if (contentType.includes('application/json')) {
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        data = { raw: rawText };
      }
    }

    // Renvoyer infos utiles au front
    return NextResponse.json({
      success: upstreamResponse.ok,
      status: upstreamResponse.status,
      data,
      headers: Object.fromEntries(upstreamResponse.headers.entries()),
      finalUrl: url.toString(),
    });
  } catch (error: any) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Proxy request failed' },
      { status: 500 }
    );
  }
}
