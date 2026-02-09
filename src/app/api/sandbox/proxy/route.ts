import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const {
      endpoint,
      method = 'GET',
      headers = {},
      body: requestBody,
      queryParams = {}, // optionnel
    } = payload;

    // ✅ Base URL unique FineoPay
    const baseUrl = 'https://psp-api.fineopay.com/api/v1';

    // Construire l’URL avec query params
    const url = new URL(`${baseUrl}${endpoint}`);
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });

    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers, // Authorization / X-API-Key passent ici
      },
      body:
        ['POST', 'PUT', 'PATCH'].includes(method) && requestBody
          ? JSON.stringify(requestBody)
          : undefined,
    });

    // Gérer JSON ou texte brut
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      data,
      headers: Object.fromEntries(response.headers.entries()),
    });
  } catch (error: any) {
    console.error('Proxy error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Proxy request failed',
      },
      { status: 500 }
    );
  }
}
