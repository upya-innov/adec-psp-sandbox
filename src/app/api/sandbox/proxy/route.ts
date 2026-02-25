import { NextRequest, NextResponse } from 'next/server';

type Env = 'sandbox' | 'live';

const API_BASE: Record<Env, string> = {
  sandbox: 'https://psp-api.fineopay.com/api/v1',
  live: 'https://psp-api.fineopay.com/api/v1',
};

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const {
      endpoint,
      method = 'GET',
      headers = {},
      body: requestBody,
      queryParams = {},
      environment = 'sandbox',
    } = payload as {
      endpoint: string;
      method?: string;
      headers?: Record<string, string>;
      body?: any;
      queryParams?: Record<string, any>;
      environment?: Env;
    };

    const baseUrl = API_BASE[environment];

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
        ...headers,
      },
      body:
        ['POST', 'PUT', 'PATCH'].includes(method) && requestBody
          ? JSON.stringify(requestBody)
          : undefined,
    });

    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      data,
      headers: Object.fromEntries(response.headers.entries()),
    });
  } catch (error: any) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Proxy request failed' },
      { status: 500 }
    );
  }
}
