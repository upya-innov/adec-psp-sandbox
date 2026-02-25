'use client';

import { useState } from 'react';
import {
  Copy,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Download
} from 'lucide-react';

interface ResponseViewerProps {
  response: any;
  loading: boolean;
}

export default function ResponseViewer({ response, loading }: ResponseViewerProps) {
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    headers: false,
    body: true
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Envoi de la requête en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4 inline-block">
              <Download className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réponse</h3>
            <p className="text-gray-500">Envoyez une requête pour voir la réponse ici</p>
          </div>
        </div>
      </div>
    );
  }

  const copyToClipboard = () => {
    const textToCopy = typeof response.data === 'object'
      ? JSON.stringify(response.data, null, 2)
      : String(response.data || response);

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const formatJson = (data: any): string => {
    try {
      if (data === null || data === undefined) {
        return 'null';
      }

      if (typeof data === 'string') {
        // Essayer de parser si c'est du JSON
        try {
          const parsed = JSON.parse(data);
          return JSON.stringify(parsed, null, 2);
        } catch {
          return data;
        }
      }

      if (typeof data === 'object') {
        return JSON.stringify(data, null, 2);
      }

      return String(data);
    } catch (e) {
      return String(data);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-100 text-green-800';
    if (status >= 300 && status < 400) return 'bg-yellow-100 text-yellow-800';
    if (status >= 400 && status < 500) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = (status: number) => {
    if (status >= 200 && status < 300) return 'Succès';
    if (status >= 300 && status < 400) return 'Redirection';
    if (status >= 400 && status < 500) return 'Erreur client';
    return 'Erreur serveur';
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Fonction sécurisée pour convertir n'importe quelle valeur en string
  const safeStringify = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';

    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch (e) {
        return '[Object]';
      }
    }

    if (typeof value === 'function') {
      return '[Function]';
    }

    return String(value);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold">Réponse</h3>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(response.status)}`}>
              {response.status} {response.statusText}
            </span>
            <span className="text-xs text-gray-500">{getStatusText(response.status)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {response.time}ms
          </div>
          <button
            onClick={copyToClipboard}
            className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors"
            title="Copier la réponse"
          >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="divide-y">
        {/* Section Headers */}
        {response.headers && Object.keys(response.headers).length > 0 && (
          <div>
            <button
              onClick={() => toggleSection('headers')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                {expandedSections.headers ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span className="font-medium">Headers</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {Object.keys(response.headers).length}
                </span>
              </div>
            </button>
            {expandedSections.headers && (
              <div className="px-4 pb-4">
                <div className="bg-gray-50 rounded overflow-hidden">
                  <div className="divide-y">
                    {Object.entries(response.headers).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-3 p-3">
                        <div className="col-span-1">
                          <span className="font-mono text-sm text-gray-700">{key}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="font-mono text-sm text-gray-900 break-all">
                            {safeStringify(value)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section Body */}
        <div>
          <button
            onClick={() => toggleSection('body')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              {expandedSections.body ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <span className="font-medium">Body</span>
              {response.data && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {response.size ? `${response.size} bytes` : 'JSON'}
                </span>
              )}
            </div>
          </button>
          {expandedSections.body && response.data && (
            <div className="px-4 pb-4">
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto max-h-96 overflow-y-auto font-mono">
                  {formatJson(response.data)}
                </pre>
              </div>
            </div>
          )}
          {expandedSections.body && !response.data && (
            <div className="px-4 pb-4">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Pas de contenu dans la réponse</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Informations supplémentaires */}
      <div className="p-4 border-t bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Statut</div>
            <div className={`px-2 py-1 text-xs rounded-full font-medium inline-block ${getStatusColor(response.status)}`}>
              {response.status}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Temps</div>
            <div className="font-medium">{response.time}ms</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Taille</div>
            <div className="font-medium">{response.size ? `${response.size} bytes` : '-'}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">URL</div>
            <div className="font-mono text-xs truncate" title={response.url}>
              {response.url?.split('/').pop() || '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}