'use client';

import { useState } from 'react';
import { Endpoint } from '@/types/openapi';
import RequestBuilder from './RequestBuilder';
import ResponseViewer from './ResponseViewer';
import { Play, Save, Copy, RotateCcw, AlertCircle } from 'lucide-react';

interface ApiTesterProps {
  endpoint: Endpoint;
  environment: 'sandbox' | 'live';
  accessToken: string;
  apiKey: string;
}

export default function ApiTester({
  endpoint,
  environment,
  accessToken,
  apiKey,
}: ApiTesterProps) {
  const [requestBody, setRequestBody] = useState<string>('');
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [requestHistory, setRequestHistory] = useState<any[]>([]);

  // ✅ IMPORTANT: on passe par le proxy Next.js
  const proxyUrl = '/api/proxy';

  // Fonction pour déterminer le type d'authentification requis
  const getAuthType = (endpoint: Endpoint): 'jwt' | 'apiKey' | 'none' => {
    const path = endpoint.path.toLowerCase();

    if (path.includes('/api-key')) {
      return 'apiKey';
    }

    if (path.startsWith('/auth/') && path !== '/auth/login') {
      return 'jwt';
    }

    if (endpoint.security && endpoint.security.length > 0) {
      const security = endpoint.security[0];
      if (security && typeof security === 'object') {
        if ('bearerAuth' in security) return 'jwt';
        if ('apiKeyAuth' in security) return 'apiKey';
      }
    }

    const publicEndpoints = [
      '/health',
      '/auth/login',
      '/auth/refresh',
      '/auth/verify-email',
      '/auth/verify-email/code',
      '/onboarding/register',
      '/countries',
      '/channels',
      '/currencies',
      '/business-types',
      '/partners',
      '/currency-exchange-rates'
    ];

    if (!publicEndpoints.some(publicPath => path === publicPath)) return 'jwt';
    return 'none';
  };

  const endpointNeedsApiKey = getAuthType(endpoint) === 'apiKey';

  const handleSendRequest = async () => {
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const authType = getAuthType(endpoint);

      const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Appliquer auth
      switch (authType) {
        case 'jwt':
          if (!accessToken) {
            throw new Error("Ce endpoint nécessite un token JWT. Connectez-vous d'abord.");
          }
          defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
          break;

        case 'apiKey':
          if (!apiKey) {
            throw new Error("Ce endpoint nécessite une API Key. Créez-en une d'abord.");
          }
          // ⚠️ Si tu utilises PSP_API_KEY côté serveur, tu peux supprimer cette ligne
          defaultHeaders['X-API-Key'] = apiKey;
          break;

        case 'none':
          break;
      }

      // Headers custom saisis par l'utilisateur
      const finalHeaders = { ...defaultHeaders, ...headers };

      // Body JSON si nécessaire
      let parsedBody: any = undefined;
      if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && requestBody) {
        try {
          parsedBody = JSON.parse(requestBody);
        } catch {
          throw new Error('Le corps de la requête doit être un JSON valide');
        }
      }

      const startTime = Date.now();

      // ✅ Appel du proxy (pas de CORS)
      const proxyResponse = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-cache',
        body: JSON.stringify({
          endpoint: endpoint.path,
          method: endpoint.method,
          headers: finalHeaders,
          body: parsedBody,
          queryParams,
        }),
      });

      const endTime = Date.now();
      const proxyJson = await proxyResponse.json();

      const responseInfo = {
        status: proxyJson.status ?? proxyResponse.status,
        statusText: proxyJson.success ? 'OK' : 'ERROR',
        headers: proxyJson.headers ?? {},
        data: proxyJson.data,
        time: endTime - startTime,
        size: JSON.stringify(proxyJson.data ?? {}).length,
        url: proxyJson.finalUrl ?? endpoint.path,
      };

      setResponse(responseInfo);

      // Historique
      const historyItem = {
        id: Date.now(),
        timestamp: new Date(),
        request: {
          endpoint: endpoint.path,
          method: endpoint.method,
          body: requestBody,
          queryParams,
          headers: finalHeaders,
          url: responseInfo.url,
        },
        response: responseInfo,
      };
      setRequestHistory(prev => [historyItem, ...prev.slice(0, 9)]);

      if (!proxyJson.success) {
        setError(`Erreur ${responseInfo.status}`);
      }

    } catch (err: any) {
      console.error('❌ Erreur lors de la requête:', err);
      setError(err.message || "Une erreur est survenue lors de l'envoi de la requête");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRequestBody('');
    setQueryParams({});
    setHeaders({});
    setResponse(null);
    setError('');
  };

  const handleSaveRequest = () => {
    const requestData = {
      endpoint: endpoint.path,
      method: endpoint.method,
      body: requestBody,
      queryParams,
      headers,
      environment,
      timestamp: new Date().toISOString(),
    };

    const savedRequests = JSON.parse(localStorage.getItem('adec_saved_requests') || '[]');
    savedRequests.push(requestData);
    localStorage.setItem('adec_saved_requests', JSON.stringify(savedRequests));

    alert('Requête sauvegardée !');
  };

  const generateExample = () => {
    let example: any = {};

    if (endpoint.path === '/auth/login') {
      example = { email: 'owner@mycompany.com', password: 'SecurePassword123!' };
    } else if (endpoint.path === '/auth/refresh') {
      example = { refresh_token: 'your-refresh-token-here' };
    } else if (endpoint.path === '/onboarding/register') {
      example = {
        owner: {
          email: 'owner@mycompany.com',
          password: 'SecurePassword123!',
          first_name: 'John',
          last_name: 'Doe',
          phone_number: '+2250700000000',
        },
        company: {
          company_name: 'My Business SARL',
          country_id: 'country-uuid',
          business_type_id: 'business-type-uuid',
          business_email: 'contact@mybusiness.com',
          phone: '+2250700000001',
          registration_number: 'RC-12345',
          address: '123 Rue du Commerce',
          city: 'Abidjan',
          postal_code: '00225',
        },
      };
    } else if (endpoint.path === '/payments' || endpoint.path === '/payments/initiate') {
      example = {
        transaction_id: `TX-${Date.now()}`,
        amount: 1000,
        currency: 'XOF',
        country: 'CI',
        channel: 'orange_money',
        customer: {
          phone_number: '2250700000000',
          email: 'customer@example.com',
          name: 'John Doe',
        },
        description: 'Payment for order #12345',
        metadata: { order_id: '12345', product: 'Premium Subscription' },
      };
    } else if (endpoint.path === '/transfers' || endpoint.path === '/transfers/initiate') {
      example = {
        transfer_id: `TR-${Date.now()}`,
        amount: 2500,
        currency: 'XOF',
        country: 'BJ',
        channel: 'mtn_momo',
        recipient: { phone_number: '22960000000', name: 'Alice Johnson' },
        description: 'Payout for service rendered',
        metadata: { payout_reason: 'freelance_payment', contract_id: 'CON-789' },
      };
    } else if (endpoint.path === '/api-keys') {
      example = { name: 'Production API Key', environment: 'live', permissions: ['transaction:create', 'transaction:read'] };
    } else {
      example = {};
    }

    setRequestBody(JSON.stringify(example, null, 2));
  };

  const generateCurlCommand = (): string => {
    // Ici on génère le cURL vers l'API upstream (utile pour doc)
    const upstreamBase = 'https://psp-api.fineopay.com/api/v1';
    const url = new URL(`${upstreamBase}${endpoint.path}`);
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value.trim()) url.searchParams.append(key, value);
    });

    let curl = `curl -X ${endpoint.method} "${url.toString()}" \\\n`;

    const allHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    const authType = getAuthType(endpoint);
    if (authType === 'jwt' && accessToken) allHeaders['Authorization'] = `Bearer ${accessToken}`;
    else if (authType === 'apiKey' && apiKey) allHeaders['X-API-Key'] = apiKey;

    Object.entries(allHeaders).forEach(([key, value]) => {
      curl += `  -H "${key}: ${value}" \\\n`;
    });

    if (requestBody && ['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
      curl += `  -d '${requestBody}'`;
    }

    return curl;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${endpoint.method === 'GET'
                  ? 'bg-blue-100 text-blue-800'
                  : endpoint.method === 'POST'
                    ? 'bg-green-100 text-green-800'
                    : endpoint.method === 'PUT'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
              >
                {endpoint.method}
              </span>
              <code className="text-lg font-mono bg-gray-50 px-3 py-1 rounded">
                {endpoint.path}
              </code>
            </div>
            <h2 className="text-xl font-semibold">{endpoint.summary}</h2>
            <p className="text-gray-600 mt-1">{endpoint.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={generateExample}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Exemple
            </button>
            <button
              onClick={handleSaveRequest}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              Sauvegarder
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="font-medium">Proxy:</span>
            <code className="bg-gray-50 px-2 py-1 rounded">{proxyUrl}</code>
          </div>
          {accessToken && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Auth:</span>
              <span className="text-green-600">✓ JWT</span>
            </div>
          )}
          {endpointNeedsApiKey && apiKey && (
            <div className="flex items-center gap-1">
              <span className="font-medium">API Key:</span>
              <span className="text-green-600">✓ X-API-Key</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <span className="font-medium">Auth type:</span>
            <span className="font-mono text-xs px-2 py-1 bg-gray-100 rounded">
              {getAuthType(endpoint)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <RequestBuilder
            endpoint={endpoint}
            requestBody={requestBody}
            setRequestBody={setRequestBody}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
            headers={headers}
            setHeaders={setHeaders}
            environment={environment}
            accessToken={accessToken}
            apiKey={apiKey}
          />

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSendRequest}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              {loading ? 'Envoi en cours...' : 'Envoyer la requête'}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" />
              Réinitialiser
            </button>

            <button
              onClick={() => {
                const curlCommand = generateCurlCommand();
                navigator.clipboard.writeText(curlCommand);
                alert('Commande cURL copiée !');
              }}
              className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
            >
              <Copy className="h-4 w-4" />
              Copier cURL
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Erreur</h4>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <ResponseViewer response={response} loading={loading} />

          {requestHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Historique des requêtes</h3>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {requestHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setRequestBody(item.request.body || '');
                        setQueryParams(item.request.queryParams || {});
                        setHeaders(item.request.headers || {});
                        setResponse(item.response);
                      }}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-medium px-1.5 py-0.5 rounded ${item.response.status >= 200 && item.response.status < 300
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {item.response.status}
                          </span>
                          <span className="font-mono text-sm">
                            {item.request.method}
                          </span>
                          <span className="text-sm truncate">
                            {item.request.endpoint}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(item.timestamp).toLocaleTimeString()} •{' '}
                          {item.response.time}ms
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
