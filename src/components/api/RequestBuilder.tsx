'use client';

import { useState, type Dispatch, type SetStateAction, useEffect } from 'react';
import { Endpoint } from '@/types/openapi';
import { ChevronDown, ChevronUp, Plus, Trash2, Key, FileText } from 'lucide-react';

interface RequestBuilderProps {
  endpoint: Endpoint;
  requestBody: string;
  setRequestBody: Dispatch<SetStateAction<string>>;
  queryParams: Record<string, string>;
  setQueryParams: Dispatch<SetStateAction<Record<string, string>>>;
  headers: Record<string, string>;
  setHeaders: Dispatch<SetStateAction<Record<string, string>>>;
  environment: 'sandbox' | 'live';
  accessToken?: string;
  apiKey?: string;
}

export default function RequestBuilder({
  endpoint,
  requestBody,
  setRequestBody,
  queryParams,
  setQueryParams,
  headers,
  setHeaders,
  environment,
  accessToken,
  apiKey,
}: RequestBuilderProps) {
  const [activeTab, setActiveTab] = useState<'body' | 'params' | 'headers'>('body');
  const [expandedSections, setExpandedSections] = useState({
    params: true,
    headers: true,
    body: true,
  });

  // Sauvegarder l'état d'expansion
  useEffect(() => {
    const savedSections = localStorage.getItem('requestBuilder_expandedSections');
    if (savedSections) {
      try {
        setExpandedSections(JSON.parse(savedSections));
      } catch (e) {
        console.error('Error parsing saved sections', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('requestBuilder_expandedSections', JSON.stringify(expandedSections));
  }, [expandedSections]);

  const toggleSection = (section: 'params' | 'headers' | 'body') => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const endpointParams = endpoint.parameters || [];

  // Fineo PSP: API Key sur tout sauf /health
  const endpointNeedsApiKey = (endpoint.path || '').toLowerCase() !== '/health';

  const hasBody = ['POST', 'PUT', 'PATCH'].includes(endpoint.method);

  // ✅ Headers par défaut avec x-environment basé sur la prop environment
  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
    'x-environment': environment, // Header requis par l'API, automatiquement ajouté
    ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
    ...(endpointNeedsApiKey && apiKey ? { 'X-API-Key': apiKey } : {}),
  };

  // ✅ Fonction pour vérifier les headers verrouillés (non modifiables par l'utilisateur)
  const isLockedHeader = (key: string) => {
    const k = key.trim().toLowerCase();
    return k === 'content-type' ||
      k === 'authorization' ||
      k === 'x-api-key' ||
      k === 'accept' ||
      k === 'x-environment'; // x-environment est verrouillé car basé sur la sélection
  };

  // ✅ Nettoyer les headers personnalisés (enlever ceux qui sont verrouillés)
  const sanitizedHeaders: Record<string, string> = {};
  Object.entries(headers).forEach(([k, v]) => {
    const key = k.trim();
    if (!key) return;
    const lk = key.toLowerCase();
    if (isLockedHeader(lk)) return;
    sanitizedHeaders[key] = v;
  });

  // ✅ Tous les headers (default + sanitized custom)
  const allHeaders = { ...defaultHeaders, ...sanitizedHeaders };

  const handleQueryParamChange = (key: string, value: string) => {
    setQueryParams((prev) => ({ ...prev, [key]: value }));
  };

  const addQueryParam = () => {
    const newKey = `param${Date.now()}`;
    setQueryParams((prev) => ({ ...prev, [newKey]: '' }));
  };

  const removeQueryParam = (key: string) => {
    setQueryParams((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleHeaderChange = (key: string, value: string) => {
    if (isLockedHeader(key)) return;
    setHeaders((prev) => ({ ...prev, [key]: value }));
  };

  const addHeader = () => {
    const newKey = `header${Date.now()}`;
    setHeaders((prev) => ({ ...prev, [newKey]: '' }));
  };

  const removeHeader = (key: string) => {
    if (isLockedHeader(key)) return;
    setHeaders((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(requestBody);
      setRequestBody(JSON.stringify(parsed, null, 2));
    } catch {
      // Ignorer
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(requestBody);
      return { valid: true, error: null as string | null };
    } catch (error: unknown) {
      return { valid: false, error: error instanceof Error ? error.message : 'JSON invalide' };
    }
  };

  const jsonValidation = validateJson();

  const handleParamKeyChange = (oldKey: string, newKey: string, currentValue: string) => {
    const trimmed = newKey.trim();
    if (!trimmed || oldKey === trimmed) return;

    setQueryParams((prev) => {
      const copy = { ...prev };
      if (Object.prototype.hasOwnProperty.call(copy, trimmed)) return prev;
      delete copy[oldKey];
      copy[trimmed] = currentValue;
      return copy;
    });
  };

  const handleHeaderKeyChange = (oldKey: string, newKey: string, currentValue: string) => {
    if (isLockedHeader(oldKey)) return;
    const trimmed = newKey.trim();
    if (!trimmed || oldKey === trimmed || isLockedHeader(trimmed)) return;

    setHeaders((prev) => {
      const copy = { ...prev };
      if (Object.prototype.hasOwnProperty.call(copy, trimmed)) return prev;
      delete copy[oldKey];
      copy[trimmed] = currentValue;
      return copy;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab('body')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'body'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            type="button"
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Body
          </button>

          <button
            onClick={() => setActiveTab('params')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'params'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            type="button"
          >
            <Key className="h-4 w-4 inline mr-2" />
            Query Parameters
            {Object.keys(queryParams).length > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded">
                {Object.keys(queryParams).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('headers')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'headers'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            type="button"
          >
            <Key className="h-4 w-4 inline mr-2" />
            Headers
            <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded">
              {Object.keys(allHeaders).length}
            </span>
          </button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'body' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSection('body')}
                  className="text-gray-500 hover:text-gray-700"
                  type="button"
                >
                  {expandedSections.body ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                <h4 className="font-medium">Request Body</h4>
              </div>
              <button onClick={formatJson} className="text-sm text-blue-600 hover:text-blue-800" type="button">
                Formatter JSON
              </button>
            </div>

            {expandedSections.body && (
              <>
                {hasBody ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <textarea
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        className="w-full h-64 font-mono text-sm p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder='{"key": "value"}'
                        spellCheck={false}
                      />
                      {requestBody && (
                        <div className="absolute top-2 right-2">
                          <span
                            className={`text-xs px-2 py-1 rounded ${jsonValidation.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {jsonValidation.valid ? 'JSON Valide' : 'JSON Invalide'}
                          </span>
                        </div>
                      )}
                    </div>

                    {jsonValidation.error && (
                      <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        Erreur JSON: {jsonValidation.error}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Aucun body requis pour les requêtes {endpoint.method}</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'params' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSection('params')}
                  className="text-gray-500 hover:text-gray-700"
                  type="button"
                >
                  {expandedSections.params ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                <h4 className="font-medium">Query Parameters</h4>
              </div>
              <button
                onClick={addQueryParam}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                type="button"
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </button>
            </div>

            {expandedSections.params && (
              <div className="space-y-3">
                {/* Paramètres définis dans l'API */}
                {endpointParams
                  .filter((param: any) => param.in === 'query')
                  .map((param: any, index: number) => (
                    <div key={`api-param-${param.name}-${index}`} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-sm">{param.name}</span>
                          {param.required && <span className="ml-2 text-xs text-red-600">* requis</span>}
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {param.schema?.type || 'string'}
                        </span>
                      </div>

                      <input
                        type="text"
                        value={queryParams[param.name] || ''}
                        onChange={(e) => handleQueryParamChange(param.name, e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={param.description || `Valeur pour ${param.name}`}
                      />

                      {param.description && <p className="text-xs text-gray-500">{param.description}</p>}
                    </div>
                  ))}

                {/* Paramètres personnalisés */}
                {Object.entries(queryParams)
                  .filter(([key]) => !endpointParams.some((p: any) => p.in === 'query' && p.name === key))
                  .map(([key, value], index) => (
                    <div key={`custom-param-${key}-${index}`} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={key}
                        onChange={(e) => handleParamKeyChange(key, e.target.value, value)}
                        className="flex-1 px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Clé"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleQueryParamChange(key, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Valeur"
                      />
                      <button
                        onClick={() => removeQueryParam(key)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        type="button"
                        title="Supprimer ce paramètre"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                {Object.keys(queryParams).filter((k) => !endpointParams.some((p: any) => p.in === 'query' && p.name === k))
                  .length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">Aucun paramètre personnalisé. Cliquez sur "Ajouter" pour en créer un.</p>
                    </div>
                  )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSection('headers')}
                  className="text-gray-500 hover:text-gray-700"
                  type="button"
                >
                  {expandedSections.headers ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                <h4 className="font-medium">Headers</h4>
              </div>
              <button
                onClick={addHeader}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                type="button"
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </button>
            </div>

            {expandedSections.headers && (
              <div className="space-y-3">
                {/* Headers par défaut (non modifiables) */}
                {Object.entries(defaultHeaders).map(([key, value]) => (
                  <div key={`default-header-${key}`} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{key}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">par défaut</span>
                        {isLockedHeader(key) && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">verrouillé</span>
                        )}
                      </div>
                    </div>
                    <input
                      type="text"
                      value={value}
                      readOnly
                      className="w-full px-3 py-2 border rounded-md text-sm bg-gray-50 font-mono"
                    />
                  </div>
                ))}

                {/* Headers personnalisés */}
                {Object.entries(headers).map(([key, value], index) => {
                  // Ne pas afficher les headers qui sont déjà dans defaultHeaders
                  if (defaultHeaders[key]) return null;

                  return (
                    <div key={`custom-header-${key}-${index}`} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={key}
                        onChange={(e) => handleHeaderKeyChange(key, e.target.value, value)}
                        disabled={isLockedHeader(key)}
                        className={`flex-1 px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isLockedHeader(key) ? 'bg-gray-50' : ''
                          }`}
                        placeholder="Clé"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleHeaderChange(key, e.target.value)}
                        disabled={isLockedHeader(key)}
                        className={`flex-1 px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isLockedHeader(key) ? 'bg-gray-50' : ''
                          }`}
                        placeholder="Valeur"
                      />
                      <button
                        onClick={() => removeHeader(key)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        type="button"
                        title="Supprimer ce header"
                        disabled={isLockedHeader(key)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}

                {Object.keys(headers).filter(key => !defaultHeaders[key]).length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">Aucun header personnalisé. Cliquez sur "Ajouter" pour en créer un.</p>
                  </div>
                )}

                {endpointNeedsApiKey && !apiKey && (
                  <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded">
                    Cet endpoint nécessite une <b>X-API-Key</b>, mais aucune API key n&apos;est fournie.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}