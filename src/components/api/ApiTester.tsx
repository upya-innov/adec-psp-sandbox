'use client';

import { useEffect, useMemo, useState } from 'react';
import { Endpoint } from '@/types/openapi';
import RequestBuilder from './RequestBuilder';
import ResponseViewer from './ResponseViewer';
import { Play, Save, Copy, RotateCcw, AlertCircle, ToggleLeft, ToggleRight, Info } from 'lucide-react';

type Env = 'sandbox' | 'live';

// URLs de l'API
const API_BASE: Record<Env, string> = {
  sandbox: 'https://psp-api.fineopay.com/api/v1',
  live: 'https://psp-api.fineopay.com/api/v1',
};

type PaymentWorkflow = 'otp' | 'in_app' | undefined;

interface ApiTesterProps {
  endpoint: Endpoint;
  environment: Env;
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

  // Workflow selector pour /payments/initiate
  const isPaymentInitiate = endpoint.path === '/payments/initiate' && endpoint.method === 'POST';
  const [paymentWorkflow, setPaymentWorkflow] = useState<PaymentWorkflow>('otp');

  const baseUrl = API_BASE[environment];

  // Fineo PSP: tout est API Key sauf /health
  const getAuthType = (ep: Endpoint): 'apiKey' | 'none' => {
    const path = (ep.path || '').toLowerCase();
    if (path === '/health') return 'none';
    return 'apiKey';
  };

  const endpointNeedsApiKey = getAuthType(endpoint) === 'apiKey';

  const buildPaymentExample = (workflow?: PaymentWorkflow) => {
    const common = {
      merchantReference: `order-${Date.now()}`,
      amount: 5000,
      currency: 'XOF',
      channel: 'mtn_momo',
      country: 'CI',
      customer: {
        phoneNumber: '+2250700000000',
        email: 'customer@example.com',
        name: 'John Doe',
      },
      description: 'Payment for order #123',
      metadata: { orderId: '123' },
    };

    if (workflow === 'otp') {
      return {
        ...common,
        workflow: 'otp',
        otp: '',
      };
    }

    if (workflow === 'in_app') {
      return {
        ...common,
        workflow: 'in_app',
        successRedirectUrl: 'https://myapp.com/payment/success',
        failedRedirectUrl: 'https://myapp.com/payment/failed',
      };
    }

    // Pas de workflow (legacy)
    return common;
  };

  const buildTransferExample = () => ({
    merchantReference: `transfer-${Date.now()}`,
    amount: 5000,
    currency: 'XOF',
    channel: 'mtn_momo',
    country: 'CI',
    recipient: {
      phoneNumber: '+2250700000000',
      name: 'Jane Doe',
    },
    description: 'Payout to supplier',
    metadata: {},
  });

  const buildWebhookExample = () => ({
    name: 'Payment Notifications',
    webhookUrl: 'https://myapp.com/webhooks/payments',
    eventTypes: ['payment.completed', 'payment.failed'],
    transactionTypes: ['payment', 'transfer'],
    isActive: true,
    maxRetries: 6,
    timeoutSeconds: 30,
  });

  // Auto: quand on sélectionne un endpoint, on met un exemple par défaut
  useEffect(() => {
    setError('');
    setResponse(null);

    if (isPaymentInitiate) {
      const example = buildPaymentExample(paymentWorkflow);
      setRequestBody(JSON.stringify(example, null, 2));
      return;
    }

    if (endpoint.path === '/transfers/initiate' && endpoint.method === 'POST') {
      setRequestBody(JSON.stringify(buildTransferExample(), null, 2));
      return;
    }

    if (endpoint.path === '/webhooks' && endpoint.method === 'POST') {
      setRequestBody(JSON.stringify(buildWebhookExample(), null, 2));
      return;
    }

    // Pour les endpoints GET, on peut laisser vide
    if (endpoint.method === 'GET') {
      setRequestBody('');
    }
  }, [endpoint.path, endpoint.method, paymentWorkflow]);

  // Quand le workflow change, on regenère le body
  useEffect(() => {
    if (!isPaymentInitiate) return;
    const example = buildPaymentExample(paymentWorkflow);
    setRequestBody(JSON.stringify(example, null, 2));
  }, [paymentWorkflow]);

  const handleSendRequest = async () => {
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const url = new URL(`${baseUrl}${endpoint.path}`);

      Object.entries(queryParams).forEach(([key, value]) => {
        if (typeof value === 'string' && value.trim()) {
          url.searchParams.append(key, value.trim());
        }
      });

      const authType = getAuthType(endpoint);

      // ✅ Headers par défaut avec x-environment basé sur la sélection
      const defaultHeaders: Record<string, string> = {
        Accept: 'application/json',
        'x-environment': environment, // Header requis par l'API
      };

      const hasBody = ['POST', 'PUT', 'PATCH'].includes(endpoint.method);
      if (hasBody) defaultHeaders['Content-Type'] = 'application/json';

      if (authType === 'apiKey') {
        if (!apiKey) throw new Error("Ce endpoint nécessite une API Key.");
        defaultHeaders['X-API-Key'] = apiKey;
      }

      // ✅ Évite que l'utilisateur écrase les headers critiques
      const sanitizedCustomHeaders: Record<string, string> = {};
      Object.entries(headers).forEach(([k, v]) => {
        const key = k.trim();
        if (!key) return;
        const lk = key.toLowerCase();
        // Ne pas autoriser l'écrasement des headers critiques
        if (lk === 'x-api-key' || lk === 'content-type' || lk === 'accept' || lk === 'x-environment') return;
        sanitizedCustomHeaders[key] = v;
      });

      const finalHeaders = { ...defaultHeaders, ...sanitizedCustomHeaders };

      const options: RequestInit = {
        method: endpoint.method,
        headers: finalHeaders,
        cache: 'no-cache',
      };

      if (hasBody && requestBody) {
        let bodyObj: any;
        try {
          bodyObj = JSON.parse(requestBody);
        } catch {
          throw new Error('Le corps de la requête doit être un JSON valide');
        }

        // Guard rails pour payments/initiate
        if (isPaymentInitiate) {
          const wf = bodyObj.workflow;

          if (wf === 'in_app') {
            if (!bodyObj.successRedirectUrl || !bodyObj.failedRedirectUrl) {
              throw new Error(
                'workflow=in_app nécessite successRedirectUrl et failedRedirectUrl.'
              );
            }
            if ('otp' in bodyObj) delete bodyObj.otp;
          }

          if (wf === 'otp') {
            if (!('otp' in bodyObj)) bodyObj.otp = '';
            if ('successRedirectUrl' in bodyObj) delete bodyObj.successRedirectUrl;
            if ('failedRedirectUrl' in bodyObj) delete bodyObj.failedRedirectUrl;
          }
        }

        options.body = JSON.stringify(bodyObj);
      }

      const startTime = Date.now();
      const apiResponse = await fetch(url.toString(), options);
      const endTime = Date.now();

      let responseData: any;
      let responseText = '';

      try {
        responseText = await apiResponse.text();
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch {
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

      setResponse(responseInfo);

      const historyItem = {
        id: Date.now(),
        timestamp: new Date(),
        request: {
          endpoint: endpoint.path,
          method: endpoint.method,
          body: hasBody ? requestBody : '',
          queryParams,
          headers: finalHeaders,
          url: url.toString(),
          environment,
        },
        response: responseInfo,
      };

      setRequestHistory((prev) => [historyItem, ...prev.slice(0, 9)]);

      if (!apiResponse.ok) {
        setError(`Erreur ${apiResponse.status}: ${apiResponse.statusText}`);
      }
    } catch (err: any) {
      setError(err?.message || "Une erreur est survenue lors de l'envoi de la requête");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQueryParams({});
    setHeaders({});
    setResponse(null);
    setError('');

    if (isPaymentInitiate) {
      setRequestBody(JSON.stringify(buildPaymentExample(paymentWorkflow), null, 2));
      return;
    }

    if (endpoint.path === '/transfers/initiate' && endpoint.method === 'POST') {
      setRequestBody(JSON.stringify(buildTransferExample(), null, 2));
      return;
    }

    if (endpoint.path === '/webhooks' && endpoint.method === 'POST') {
      setRequestBody(JSON.stringify(buildWebhookExample(), null, 2));
      return;
    }

    setRequestBody('');
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

    const savedRequests = JSON.parse(localStorage.getItem('psp_saved_requests') || '[]');
    savedRequests.push(requestData);
    localStorage.setItem('psp_saved_requests', JSON.stringify(savedRequests));

    alert('Requête sauvegardée !');
  };

  const generateExample = () => {
    if (isPaymentInitiate) {
      setRequestBody(JSON.stringify(buildPaymentExample(paymentWorkflow), null, 2));
      return;
    }

    if (endpoint.path === '/transfers/initiate' && endpoint.method === 'POST') {
      setRequestBody(JSON.stringify(buildTransferExample(), null, 2));
      return;
    }

    if (endpoint.path === '/webhooks' && endpoint.method === 'POST') {
      setRequestBody(JSON.stringify(buildWebhookExample(), null, 2));
      return;
    }

    setRequestBody('{}');
  };

  const generateCurlCommand = (): string => {
    const url = new URL(`${baseUrl}${endpoint.path}`);
    Object.entries(queryParams).forEach(([key, value]) => {
      if (typeof value === 'string' && value.trim()) url.searchParams.append(key, value.trim());
    });

    let curl = `curl -X ${endpoint.method} "${url.toString()}" \\\n`;

    const authType = getAuthType(endpoint);

    const allHeaders: Record<string, string> = {
      Accept: 'application/json',
      'x-environment': environment,
      ...headers,
    };

    const hasBody = ['POST', 'PUT', 'PATCH'].includes(endpoint.method);
    if (hasBody) allHeaders['Content-Type'] = 'application/json';

    if (authType === 'apiKey' && apiKey) allHeaders['X-API-Key'] = apiKey;

    Object.entries(allHeaders).forEach(([key, value]) => {
      if (!key) return;
      curl += `  -H "${key}: ${String(value)}" \\\n`;
    });

    if (hasBody && requestBody) {
      curl += `  -d '${requestBody}'`;
    }

    return curl;
  };

  const methodBadgeClass = useMemo(() => {
    switch (endpoint.method) {
      case 'GET':
        return 'bg-blue-100 text-blue-800';
      case 'POST':
        return 'bg-green-100 text-green-800';
      case 'PUT':
      case 'PATCH':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, [endpoint.method]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${methodBadgeClass}`}>
                {endpoint.method}
              </span>
              <code className="text-lg font-mono bg-gray-50 px-3 py-1 rounded">{endpoint.path}</code>
            </div>
            <h2 className="text-xl font-semibold">{endpoint.summary}</h2>
            <p className="text-gray-600 mt-1">{endpoint.description}</p>

            {/* Info callback_url */}
            {isPaymentInitiate && (
              <div className="mt-3 flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-md p-3">
                <Info className="h-4 w-4 text-blue-700 mt-0.5" />
                <div className="text-xs text-blue-800">
                  <div className="font-medium mb-1">Webhook / callback_url</div>
                  <div>
                    Le <code className="bg-white/70 px-1 py-0.5 rounded">callback_url</code> ne se met pas dans la requête.
                    Il se configure dans l&apos;espace marchand, dans la section <strong>Webhooks</strong>.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={generateExample}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              type="button"
            >
              Exemple
            </button>
            <button
              onClick={handleSaveRequest}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1"
              type="button"
            >
              <Save className="h-4 w-4" />
              Sauvegarder
            </button>
          </div>
        </div>

        {/* Workflow selector pour /payments/initiate */}
        {isPaymentInitiate && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border rounded-md p-3 bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-800">Workflow de paiement :</span>

              <div className="inline-flex rounded-md border bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setPaymentWorkflow('otp')}
                  className={`px-3 py-2 text-sm flex items-center gap-2 ${paymentWorkflow === 'otp' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {paymentWorkflow === 'otp' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                  OTP
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentWorkflow('in_app')}
                  className={`px-3 py-2 text-sm flex items-center gap-2 ${paymentWorkflow === 'in_app' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {paymentWorkflow === 'in_app' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                  IN_APP
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentWorkflow(undefined)}
                  className={`px-3 py-2 text-sm flex items-center gap-2 ${paymentWorkflow === undefined ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  Sans workflow
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-600">
              {paymentWorkflow === 'otp' && <span>En OTP : tu envoies <code className="bg-white px-1 rounded">workflow="otp"</code> (+ <code className="bg-white px-1 rounded">otp</code>).</span>}
              {paymentWorkflow === 'in_app' && <span>En IN_APP : tu envoies <code className="bg-white px-1 rounded">workflow="in_app"</code> + URLs de redirection.</span>}
              {paymentWorkflow === undefined && <span>Sans workflow : requête legacy sans champ workflow.</span>}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="font-medium">Base URL:</span>
            <code className="bg-gray-50 px-2 py-1 rounded">{baseUrl}</code>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-medium">Environnement:</span>
            <code className="bg-gray-50 px-2 py-1 rounded">{environment}</code>
          </div>

          {endpointNeedsApiKey && apiKey && (
            <div className="flex items-center gap-1">
              <span className="font-medium">API Key:</span>
              <span className="text-green-600">✓ X-API-Key</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <span className="font-medium">Auth type:</span>
            <span className="font-mono text-xs px-2 py-1 bg-gray-100 rounded">{getAuthType(endpoint)}</span>
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
              type="button"
            >
              <Play className="h-4 w-4" />
              {loading ? 'Envoi en cours...' : 'Envoyer la requête'}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
              type="button"
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
              type="button"
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
}