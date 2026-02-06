'use client';

import { useState } from 'react';
import { Endpoint } from '@/types/openapi';
import RequestBuilder from './RequestBuilder';
import ResponseViewer from './ResponseViewer';
import { Play, Save, Copy, RotateCcw, AlertCircle } from 'lucide-react';

interface ApiTesterProps {
  endpoint: Endpoint;
  environment: 'sandbox' | 'production';
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

  const baseUrl = 'https://psp-api.fineopay.com/api/v1';

  // Fonction pour déterminer le type d'authentification requis
  const getAuthType = (endpoint: Endpoint): 'jwt' | 'apiKey' | 'none' => {
    const path = endpoint.path.toLowerCase();

    // Endpoints qui utilisent l'API Key (X-API-Key header)
    if (path.includes('/api-key')) {
      return 'apiKey';
    }

    // Endpoints qui utilisent JWT (Authorization: Bearer)
    if (path.startsWith('/auth/') && path !== '/auth/login') {
      return 'jwt';
    }

    // Vérifier si le endpoint a des requirements de sécurité
    if (endpoint.security && endpoint.security.length > 0) {
      const security = endpoint.security[0];
      if (security && typeof security === 'object') {
        if ('bearerAuth' in security) {
          return 'jwt';
        }
        if ('apiKeyAuth' in security) {
          return 'apiKey';
        }
      }
    }

    // Par défaut, si c'est un endpoint protégé (pas dans les public endpoints)
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

    if (!publicEndpoints.some(publicPath => path === publicPath)) {
      return 'jwt';
    }

    return 'none';
  };

  const endpointNeedsApiKey = getAuthType(endpoint) === 'apiKey';

  const handleSendRequest = async () => {
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      // Construire l'URL avec les query params
      const url = new URL(`${baseUrl}${endpoint.path}`);

      Object.entries(queryParams).forEach(([key, value]) => {
        if (value.trim()) url.searchParams.append(key, value);
      });

      // Déterminer le type d'authentification
      const authType = getAuthType(endpoint);
      const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Appliquer l'authentification appropriée
      switch (authType) {
        case 'jwt':
          if (accessToken) {
            defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
          } else {
            throw new Error('Ce endpoint nécessite un token JWT. Connectez-vous d\'abord.');
          }
          break;

        case 'apiKey':
          if (apiKey) {
            defaultHeaders['X-API-Key'] = apiKey;
          } else {
            throw new Error('Ce endpoint nécessite une API Key. Créez-en une d\'abord.');
          }
          break;

        case 'none':
          // Pas d'authentification nécessaire
          break;
      }

      // Ajouter les headers personnalisés
      const finalHeaders = { ...defaultHeaders, ...headers };

      const options: RequestInit = {
        method: endpoint.method,
        headers: finalHeaders,
        cache: 'no-cache',
      };

      if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && requestBody) {
        try {
          // Valider que le JSON est valide
          JSON.parse(requestBody);
          options.body = requestBody;
        } catch (e) {
          throw new Error('Le corps de la requête doit être un JSON valide');
        }
      }

      console.log('📤 Envoi de la requête:', {
        url: url.toString(),
        method: endpoint.method,
        headers: finalHeaders,
        body: requestBody || 'none',
      });

      // Effectuer la requête
      const startTime = Date.now();
      const apiResponse = await fetch(url.toString(), options);
      const endTime = Date.now();

      // Lire la réponse
      let responseData: any;
      let responseText = '';

      try {
        responseText = await apiResponse.text();
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.warn('Impossible de parser la réponse JSON:', parseError);
        responseData = { raw: responseText };
      }

      const responseInfo = {
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        headers: Object.fromEntries(apiResponse.headers.entries()),
        data: responseData,
        time: endTime - startTime,
        size: responseText.length,
        url: url.toString(),
      };

      console.log('📥 Réponse reçue:', responseInfo);
      setResponse(responseInfo);

      // Ajouter à l'historique
      const historyItem = {
        id: Date.now(),
        timestamp: new Date(),
        request: {
          endpoint: endpoint.path,
          method: endpoint.method,
          body: requestBody,
          queryParams,
          headers: finalHeaders,
          url: url.toString(),
        },
        response: responseInfo,
      };

      setRequestHistory(prev => [historyItem, ...prev.slice(0, 9)]);

      // Afficher une erreur si le status n'est pas 2xx
      if (!apiResponse.ok) {
        setError(`Erreur ${apiResponse.status}: ${apiResponse.statusText}`);
      }

    } catch (err: any) {
      console.error('❌ Erreur lors de la requête:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'envoi de la requête');
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

    // Exemples basés sur le endpoint
    if (endpoint.path === '/auth/login') {
      example = {
        email: 'owner@mycompany.com',
        password: 'SecurePassword123!',
      };
    } else if (endpoint.path === '/auth/refresh') {
      example = {
        refresh_token: 'your-refresh-token-here',
      };
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
        metadata: {
          order_id: '12345',
          product: 'Premium Subscription',
        },
      };
    } else if (endpoint.path === '/transfers' || endpoint.path === '/transfers/initiate') {
      example = {
        transfer_id: `TR-${Date.now()}`,
        amount: 2500,
        currency: 'XOF',
        country: 'BJ',
        channel: 'mtn_momo',
        recipient: {
          phone_number: '22960000000',
          name: 'Alice Johnson',
        },
        description: 'Payout for service rendered',
        metadata: {
          payout_reason: 'freelance_payment',
          contract_id: 'CON-789',
        },
      };
    } else if (endpoint.path === '/api-keys') {
      example = {
        name: 'Production API Key',
        environment: 'live',
        permissions: ['transaction:create', 'transaction:read']
      };
    } else if (endpoint.path === '/kyc/submissions') {
      example = {
        kyc_level: 'basic',
        metadata: {
          submission_reason: 'Initial KYC submission',
        },
      };
    } else if (endpoint.path === '/tenant-channel-config') {
      example = {
        channel_id: 'channel-id',
        is_enabled: true,
        markup_type: 'percentage',
        markup_percentage: 2.5,
        min_amount: 100,
        max_amount: 1000000,
        daily_limit: 5000000,
      };
    } else if (endpoint.path === '/roles') {
      example = {
        name: 'Finance Manager',
        description: 'Manages financial operations',
        permission_ids: ['permission-id-1', 'permission-id-2'],
      };
    } else if (endpoint.path === '/users/me') {
      example = {
        first_name: 'Jane Updated',
        last_name: 'Smith Updated',
      };
    }

    if (Object.keys(example).length > 0) {
      setRequestBody(JSON.stringify(example, null, 2));
    } else {
      setRequestBody('{}');
    }
  };

  const generateCurlCommand = (): string => {
    const url = new URL(`${baseUrl}${endpoint.path}`);

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value.trim()) url.searchParams.append(key, value);
    });

    let curl = `curl -X ${endpoint.method} "${url.toString()}" \\\n`;

    const allHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    const authType = getAuthType(endpoint);
    if (authType === 'jwt' && accessToken) {
      allHeaders['Authorization'] = `Bearer ${accessToken}`;
    } else if (authType === 'apiKey' && apiKey) {
      allHeaders['X-API-Key'] = apiKey;
    }

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
            <span className="font-medium">Base URL:</span>
            <code className="bg-gray-50 px-2 py-1 rounded">{baseUrl}</code>
          </div>
          {accessToken && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Auth:</span>
              <span className="text-green-600">✓ Authentifié</span>
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