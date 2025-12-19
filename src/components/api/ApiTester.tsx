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
  apiSecret: string;
}

export default function ApiTester({
  endpoint,
  environment,
  accessToken,
  apiKey,
  apiSecret
}: ApiTesterProps) {
  const [requestBody, setRequestBody] = useState<string>('');
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [requestHistory, setRequestHistory] = useState<any[]>([]);

  const baseUrl = environment === 'sandbox'
    ? 'https://api.sandbox.adecsa.com/v1'
    : 'https://api.adecsa.com/v1';

  const handleSendRequest = async () => {
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      // Construire l'URL avec les query params
      const url = new URL(`${baseUrl}${endpoint.path}`);

      Object.entries(queryParams).forEach(([key, value]) => {
        if (value.trim()) {
          url.searchParams.append(key, value);
        }
      });

      // Headers par défaut
      const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Ajouter l'authentification si disponible
      if (accessToken) {
        defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
      }

      // Fusionner avec les headers personnalisés
      const finalHeaders = { ...defaultHeaders, ...headers };

      // Options de la requête
      const options: RequestInit = {
        method: endpoint.method,
        headers: finalHeaders,
      };

      // Ajouter le body si nécessaire
      if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && requestBody) {
        options.body = requestBody;
      }

      const startTime = Date.now();
      const apiResponse = await fetch(url.toString(), options);
      const endTime = Date.now();

      const responseData = await apiResponse.json();

      const responseInfo = {
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        headers: Object.fromEntries(apiResponse.headers.entries()),
        data: responseData,
        time: endTime - startTime,
        size: JSON.stringify(responseData).length,
      };

      setResponse(responseInfo);

      // Sauvegarder dans l'historique
      const historyItem = {
        id: Date.now(),
        timestamp: new Date(),
        request: {
          endpoint: endpoint.path,
          method: endpoint.method,
          body: requestBody,
          queryParams,
          headers: finalHeaders,
        },
        response: responseInfo,
      };

      setRequestHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Garder les 10 derniers

    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      console.error('API request failed:', err);
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

    // Sauvegarder dans localStorage
    const savedRequests = JSON.parse(localStorage.getItem('adec_saved_requests') || '[]');
    savedRequests.push(requestData);
    localStorage.setItem('adec_saved_requests', JSON.stringify(savedRequests));

    alert('Requête sauvegardée !');
  };

  const generateExample = () => {
    // Générer un exemple basé sur le schéma OpenAPI
    let example = {};

    if (endpoint.path === '/auth/token') {
      example = {
        api_key: apiKey || "votre_api_key",
        api_secret: apiSecret || "votre_api_secret"
      };
    } else if (endpoint.path === '/payments/direct') {
      example = {
        transaction_id: `TX-${Date.now()}`,
        amount: 1000,
        currency: "XOF",
        country: "CI",
        channel: "orange-money",
        customer: {
          phone_number: "+2250700000000"
        },
        description: "Payment for order #12345"
      };
    } else if (endpoint.path === '/transfers') {
      example = {
        transfer_id: `TR-${Date.now()}`,
        amount: 2500,
        currency: "XOF",
        country: "CI",
        channel: "orange-money",
        recipient: {
          phone_number: "+2250700000000",
          name: "John Doe"
        },
        description: "Transfer to merchant"
      };
    }

    setRequestBody(JSON.stringify(example, null, 2));
  };

  return (
    <div className="space-y-6">
      {/* En-tête de l'endpoint */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                  endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                    endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                }`}>
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panneau de gauche : Construction de la requête */}
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
          />

          {/* Boutons d'action */}
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

        {/* Panneau de droite : Réponse */}
        <div className="space-y-6">
          <ResponseViewer response={response} loading={loading} />

          {/* Historique des requêtes */}
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
                          <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${item.response.status >= 200 && item.response.status < 300
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                            }`}>
                            {item.response.status}
                          </span>
                          <span className="font-mono text-sm">{item.request.method}</span>
                          <span className="text-sm truncate">{item.request.endpoint}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(item.timestamp).toLocaleTimeString()} • {item.response.time}ms
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

  function generateCurlCommand(): string {
    const url = new URL(`${baseUrl}${endpoint.path}`);

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value.trim()) {
        url.searchParams.append(key, value);
      }
    });

    let curl = `curl -X ${endpoint.method} "${url.toString()}" \\\n`;

    // Headers
    const allHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (accessToken) {
      allHeaders['Authorization'] = `Bearer ${accessToken}`;
    }

    Object.entries(allHeaders).forEach(([key, value]) => {
      curl += `  -H "${key}: ${value}" \\\n`;
    });

    // Body
    if (requestBody && ['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
      curl += `  -d '${requestBody}'`;
    }

    return curl;
  }
}