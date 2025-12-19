import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, method, headers, body: requestBody, environment } = body;

    const baseUrl = environment === 'production'
      ? 'https://api.adecsa.com/v1'
      : 'https://api.sandbox.adecsa.com/v1';

    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: requestBody ? JSON.stringify(requestBody) : undefined,
    });

    const data = await response.json();

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      data,
      headers: Object.fromEntries(response.headers.entries()),
    });
  } catch (error: any) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Proxy request failed' },
      { status: 500 }
    );
  }
}