'use client';

import { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Code,
  Eye,
  EyeOff
} from 'lucide-react';

interface ResponseViewerProps {
  response: any;
  loading: boolean;
}

export default function ResponseViewer({ response, loading }: ResponseViewerProps) {
  const [expandedSections, setExpandedSections] = useState({
    body: true,
    headers: false,
    raw: false,
  });
  const [viewMode, setViewMode] = useState<'pretty' | 'raw'>('pretty');
  const [showHiddenFields, setShowHiddenFields] = useState(false);

  const toggleSection = (section: 'body' | 'headers' | 'raw') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadResponse = () => {
    if (!response) return;

    const blob = new Blob([JSON.stringify(response.data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const isSuccess = response?.status >= 200 && response?.status < 300;

  // Fonction pour obtenir le message d'erreur formaté
  const getErrorMessage = (error: any): string => {
    if (!error) return '';

    if (typeof error === 'string') {
      return error;
    }

    if (typeof error === 'object') {
      if (error.message) {
        return error.message;
      }
      if (error.code && error.details) {
        return `${error.code}: ${error.details}`;
      }
      if (error.code) {
        return error.code;
      }
      if (error.details) {
        return error.details;
      }
      return JSON.stringify(error);
    }

    return String(error);
  };

  // Fonction pour obtenir le code d'erreur
  const getErrorCode = (error: any): string => {
    if (!error) return '';

    if (typeof error === 'string') {
      return error;
    }

    if (typeof error === 'object' && error.code) {
      return error.code;
    }

    if (typeof error === 'object') {
      return 'UNKNOWN_ERROR';
    }

    return String(error);
  };

  const renderSimpleJson = (obj: any) => {
    return (
      <pre className="text-sm font-mono whitespace-pre-wrap">
        {JSON.stringify(obj, null, 2)}
      </pre>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 animate-spin text-blue-600" />
            Réponse
          </h3>
        </div>
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Requête en cours...</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Réponse</h3>
        </div>
        <div className="p-8 text-center text-gray-500">
          <div className="mb-4">
            <Code className="h-12 w-12 mx-auto opacity-50" />
          </div>
          <p>Envoyez une requête pour voir la réponse ici</p>
          <p className="text-sm mt-2">Le résultat de votre requête API s&apos;affichera dans ce panneau</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header de la réponse */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold">Réponse</h3>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${isSuccess
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
              }`}>
              {isSuccess ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <span>{response.status} {response.statusText}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(JSON.stringify(response.data, null, 2))}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
              title="Copier la réponse"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={downloadResponse}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
              title="Télécharger la réponse"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Métriques */}
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Temps: {formatResponseTime(response.time)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            <span>Taille: {formatSize(response.size)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Date: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs du contenu */}
      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => setViewMode('pretty')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${viewMode === 'pretty'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            Pretty
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${viewMode === 'raw'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            Raw
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Mode Pretty */}
        {viewMode === 'pretty' && (
          <div className="space-y-4">
            {/* Body Section */}
            <div className="space-y-2">
              <button
                onClick={() => toggleSection('body')}
                className="flex items-center gap-2 w-full text-left"
              >
                {expandedSections.body ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
                <span className="font-medium">Body</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {response.data ? Object.keys(response.data).length : 0} propriétés
                </span>
              </button>

              {expandedSections.body && response.data && (
                <div className="bg-gray-50 rounded-md p-4 overflow-x-auto">
                  <div className="text-sm font-mono whitespace-pre-wrap">
                    {renderSimpleJson(response.data)}
                  </div>
                </div>
              )}
            </div>

            {/* Headers Section */}
            <div className="space-y-2">
              <button
                onClick={() => toggleSection('headers')}
                className="flex items-center gap-2 w-full text-left"
              >
                {expandedSections.headers ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
                <span className="font-medium">Headers</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {Object.keys(response.headers || {}).length} headers
                </span>
              </button>

              {expandedSections.headers && response.headers && (
                <div className="bg-gray-50 rounded-md overflow-hidden">
                  <div className="divide-y">
                    {Object.entries(response.headers).map(([key, value], index) => (
                      <div key={index} className="flex justify-between px-4 py-2 hover:bg-gray-100">
                        <code className="text-sm font-medium text-gray-800">{key}</code>
                        <code className="text-sm text-gray-600 break-all max-w-md">
                          {String(value)}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Informations de débogage (optionnel) */}
            {!isSuccess && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-medium text-red-800">Erreur {response.status}</h4>

                    {/* Afficher le message d'erreur principal */}
                    {(response.data?.message || response.data?.error?.message) && (
                      <p className="text-red-600 text-sm">
                        {response.data.message || response.data.error.message}
                      </p>
                    )}

                    {/* Afficher la description de l'erreur */}
                    {response.data?.error_description && (
                      <p className="text-red-600 text-sm">
                        {response.data.error_description}
                      </p>
                    )}

                    {/* Afficher les détails de l'erreur */}
                    {(response.data?.error?.details || response.data?.details) && (
                      <p className="text-red-600 text-sm">
                        {response.data.error?.details || response.data.details}
                      </p>
                    )}

                    {/* Afficher le code d'erreur */}
                    {(response.data?.error || response.data?.error?.code) && (
                      <div className="mt-2">
                        <span className="text-xs font-medium text-red-800">Code erreur:</span>
                        <code className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          {getErrorCode(response.data.error)}
                        </code>
                      </div>
                    )}

                    {/* Afficher le chemin si disponible */}
                    {response.data?.path && (
                      <div className="mt-1">
                        <span className="text-xs font-medium text-red-800">Chemin:</span>
                        <code className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          {response.data.path}
                        </code>
                      </div>
                    )}

                    {/* Afficher le timestamp si disponible */}
                    {response.data?.timestamp && (
                      <div className="mt-1">
                        <span className="text-xs font-medium text-red-800">Timestamp:</span>
                        <code className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          {new Date(response.data.timestamp).toLocaleString()}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode Raw */}
        {viewMode === 'raw' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleSection('raw')}
                  className="flex items-center gap-2"
                >
                  {expandedSections.raw ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                  <span className="font-medium">Réponse complète</span>
                </button>
                <button
                  onClick={() => setShowHiddenFields(!showHiddenFields)}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  {showHiddenFields ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Cacher les champs sensibles
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Montrer les champs sensibles
                    </>
                  )}
                </button>
              </div>

              {expandedSections.raw && (
                <div className="bg-gray-900 text-gray-100 rounded-md p-4 overflow-x-auto">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {JSON.stringify(
                      showHiddenFields
                        ? response
                        : {
                          ...response,
                          data: response.data && typeof response.data === 'object'
                            ? Object.fromEntries(
                              Object.entries(response.data).map(([key, value]) => [
                                key,
                                ['password', 'secret', 'token', 'key', 'access_token'].some(s =>
                                  key.toLowerCase().includes(s)
                                )
                                  ? '***HIDDEN***'
                                  : value
                              ])
                            )
                            : response.data
                        },
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions rapides */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            {response.data?.transaction_id && (
              <div className="text-sm">
                <span className="text-gray-600">Transaction ID:</span>
                <code className="ml-2 bg-gray-100 px-2 py-1 rounded font-mono">
                  {response.data.transaction_id}
                </code>
              </div>
            )}
            {response.data?.reference && (
              <div className="text-sm">
                <span className="text-gray-600">Reference:</span>
                <code className="ml-2 bg-gray-100 px-2 py-1 rounded font-mono">
                  {response.data.reference}
                </code>
              </div>
            )}
            {response.data?.transfer_id && (
              <div className="text-sm">
                <span className="text-gray-600">Transfer ID:</span>
                <code className="ml-2 bg-gray-100 px-2 py-1 rounded font-mono">
                  {response.data.transfer_id}
                </code>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}