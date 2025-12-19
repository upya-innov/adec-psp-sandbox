'use client'

import { useState, type Dispatch, type SetStateAction } from 'react'
import { Endpoint } from '@/types/openapi'
import { ChevronDown, ChevronUp, Plus, Trash2, Key, FileText } from 'lucide-react'

interface RequestBuilderProps {
  endpoint: Endpoint
  requestBody: string
  setRequestBody: Dispatch<SetStateAction<string>>
  queryParams: Record<string, string>
  setQueryParams: Dispatch<SetStateAction<Record<string, string>>>
  headers: Record<string, string>
  setHeaders: Dispatch<SetStateAction<Record<string, string>>>
  environment: 'sandbox' | 'production'
  accessToken?: string
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
}: RequestBuilderProps) {
  const [activeTab, setActiveTab] = useState<'body' | 'params' | 'headers'>('body')
  const [expandedSections, setExpandedSections] = useState({
    params: true,
    headers: true,
    body: true,
  })

  const toggleSection = (section: 'params' | 'headers' | 'body') => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Extraire les paramètres de l'endpoint
  const endpointParams = endpoint.parameters || []

  // Headers par défaut
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (accessToken) {
    defaultHeaders['Authorization'] = `Bearer ${accessToken}`
  }

  // Fusionner avec les headers personnalisés pour l'affichage
  const allHeaders = { ...defaultHeaders, ...headers }

  const handleQueryParamChange = (key: string, value: string) => {
    setQueryParams((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const addQueryParam = () => {
    const newKey = `param${Object.keys(queryParams).length + 1}`
    setQueryParams((prev) => ({
      ...prev,
      [newKey]: '',
    }))
  }

  const removeQueryParam = (key: string) => {
    const newParams = { ...queryParams }
    delete newParams[key]
    setQueryParams(newParams)
  }

  const handleHeaderChange = (key: string, value: string) => {
    // Ne pas permettre de modifier les headers par défaut
    if (key === 'Content-Type' || key === 'Authorization') return

    setHeaders((prev) => {
      const newHeaders = { ...prev }
      newHeaders[key] = value
      return newHeaders
    })
  }

  const addHeader = () => {
    const newKey = `header${Object.keys(headers).length + 1}`
    setHeaders((prev) => {
      const newHeaders = { ...prev }
      newHeaders[newKey] = ''
      return newHeaders
    })
  }

  const removeHeader = (key: string) => {
    // Ne pas permettre de supprimer les headers par défaut
    if (key === 'Content-Type' || key === 'Authorization') return

    setHeaders((prev) => {
      const newHeaders = { ...prev }
      delete newHeaders[key]
      return newHeaders
    })
  }

  const formatJson = () => {
    try {
      const parsed = JSON.parse(requestBody)
      setRequestBody(JSON.stringify(parsed, null, 2))
    } catch {
      // Si le JSON est invalide, ne rien faire
    }
  }

  const validateJson = () => {
    try {
      JSON.parse(requestBody)
      return { valid: true, error: null as string | null }
    } catch (error: unknown) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'JSON invalide',
      }
    }
  }

  const jsonValidation = validateJson()

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tabs */}
      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab('body')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'body'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
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
        {/* Body Tab */}
        {activeTab === 'body' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => toggleSection('body')} className="text-gray-500 hover:text-gray-700">
                  {expandedSections.body ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
                <h4 className="font-medium">Request Body</h4>
              </div>
              <button onClick={formatJson} className="text-sm text-blue-600 hover:text-blue-800">
                Formatter JSON
              </button>
            </div>

            {expandedSections.body && (
              <>
                {['POST', 'PUT', 'PATCH'].includes(endpoint.method) ? (
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

                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Format: JSON</p>
                      {endpoint.requestBody?.required && <p className="text-red-600">⚠ Ce body est requis</p>}
                    </div>
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

        {/* Query Parameters Tab */}
        {activeTab === 'params' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => toggleSection('params')} className="text-gray-500 hover:text-gray-700">
                  {expandedSections.params ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
                <h4 className="font-medium">Query Parameters</h4>
              </div>
              <button onClick={addQueryParam} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                <Plus className="h-4 w-4" />
                Ajouter
              </button>
            </div>

            {expandedSections.params && (
              <div className="space-y-3">
                {/* Paramètres définis dans l'OpenAPI */}
                {endpointParams
                  .filter((param: any) => param.in === 'query')
                  .map((param: any, index: number) => (
                    <div key={`api-param-${index}`} className="space-y-1">
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
                        className="w-full px-3 py-2 border rounded-md text-sm"
                        placeholder={param.description || `Valeur pour ${param.name}`}
                      />

                      {param.description && <p className="text-xs text-gray-500">{param.description}</p>}
                    </div>
                  ))}

                {/* Paramètres personnalisés */}
                {Object.entries(queryParams)
                  .filter(([key]) => !endpointParams.some((p: any) => p.name === key))
                  .map(([key, value], index) => (
                    <div key={`custom-param-${index}`} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={key}
                        onChange={(e) => {
                          const newParams = { ...queryParams }
                          delete newParams[key]
                          newParams[e.target.value] = value
                          setQueryParams(newParams)
                        }}
                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                        placeholder="Clé"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleQueryParamChange(key, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                        placeholder="Valeur"
                      />
                      <button onClick={() => removeQueryParam(key)} className="p-2 text-red-600 hover:bg-red-50 rounded-md">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                {endpointParams.filter((p: any) => p.in === 'query').length === 0 && Object.keys(queryParams).length === 0 && (
                  <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-md">
                    <p>Aucun paramètre de requête défini pour cet endpoint</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Headers Tab */}
        {activeTab === 'headers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => toggleSection('headers')} className="text-gray-500 hover:text-gray-700">
                  {expandedSections.headers ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                <h4 className="font-medium">Headers</h4>
              </div>
              <button onClick={addHeader} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                <Plus className="h-4 w-4" />
                Ajouter
              </button>
            </div>

            {expandedSections.headers && (
              <div className="space-y-3">
                {/* Headers par défaut */}
                {Object.entries(defaultHeaders).map(([key, value]) => (
                  <div key={`default-header-${key}`} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{key}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">par défaut</span>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={value}
                      readOnly
                      className="w-full px-3 py-2 border rounded-md text-sm bg-gray-50"
                    />
                  </div>
                ))}

                {/* Headers personnalisés */}
                {Object.entries(headers).map(([key, value], index) => (
                  <div key={`custom-header-${index}`} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => {
                        const newHeaders = { ...headers }
                        delete newHeaders[key]
                        newHeaders[e.target.value] = value
                        setHeaders(newHeaders)
                      }}
                      className="flex-1 px-3 py-2 border rounded-md text-sm"
                      placeholder="Clé"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleHeaderChange(key, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md text-sm"
                      placeholder="Valeur"
                    />
                    <button onClick={() => removeHeader(key)} className="p-2 text-red-600 hover:bg-red-50 rounded-md">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {Object.keys(headers).length === 0 && (
                  <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-md">
                    <p>Aucun header personnalisé ajouté</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
