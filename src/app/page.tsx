'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ApiTester from '@/components/api/ApiTester';
import { Endpoint } from '@/types/openapi';
import { loadOpenAPISpec, getAllEndpoints } from '@/lib/openapi-parser';
import {
  Key,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Copy,
  Check,
  Settings,
  RefreshCw,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

export default function HomePage() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);

  // État pour réduire/afficher la configuration
  const [isConfigCollapsed, setIsConfigCollapsed] = useState<boolean>(false);

  // Ref pour le scroll vers ApiTester
  const apiTesterRef = useRef<HTMLDivElement>(null);

  // États simplifiés - seulement API Key
  const [apiKey, setApiKey] = useState<string>('');
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('sandbox');

  // États UI
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  // Charger la spécification OpenAPI
  useEffect(() => {
    async function loadAPI() {
      try {
        const spec = await loadOpenAPISpec();
        const allEndpoints = getAllEndpoints(spec);
        setEndpoints(allEndpoints);
        if (allEndpoints.length > 0) setSelectedEndpoint(allEndpoints[0]);
      } catch (error) {
        console.error('Failed to load API spec:', error);
        showMessage('error', 'Impossible de charger la spécification API');
      }
    }
    loadAPI();
  }, []);

  // Charger les données sauvegardées
  useEffect(() => {
    const savedApiKey = localStorage.getItem('psp_api_key');
    const savedEnv = localStorage.getItem('psp_environment');
    const savedConfigCollapsed = localStorage.getItem('psp_config_collapsed');

    if (savedApiKey) setApiKey(savedApiKey);
    if (savedEnv === 'production' || savedEnv === 'sandbox') setEnvironment(savedEnv);
    if (savedConfigCollapsed === 'true') setIsConfigCollapsed(true);
  }, []);

  // Sauvegarder les données
  useEffect(() => {
    localStorage.setItem('psp_environment', environment);
    localStorage.setItem('psp_config_collapsed', isConfigCollapsed.toString());
    if (apiKey) {
      localStorage.setItem('psp_api_key', apiKey);
    } else {
      localStorage.removeItem('psp_api_key');
    }
  }, [apiKey, environment, isConfigCollapsed]);

  // Fonction pour afficher des messages
  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Fonction pour copier du texte
  const copyToClipboard = (text: string, itemName: string) => {
    if (!text) {
      showMessage('error', 'Rien à copier');
      return;
    }

    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedItem(itemName);
        showMessage('success', 'Copié dans le presse-papier');
        setTimeout(() => setCopiedItem(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        showMessage('error', 'Échec de la copie');
      });
  };

  // Fonction pour tester l'API Key
  const testApiKey = async () => {
    if (!apiKey) {
      showMessage('error', 'Veuillez entrer une API Key');
      return;
    }

    setIsLoading(true);
    showMessage('info', 'Test de l\'API Key en cours...');

    try {
      const response = await fetch('https://psp-api.fineopay.com/health', {
        method: 'GET',
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        showMessage('success', 'API Key valide !');
      } else {
        showMessage('error', 'API Key invalide ou expirée');
      }
    } catch (error) {
      console.error('API Key test failed:', error);
      showMessage('error', 'Erreur lors du test de l\'API Key');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour réinitialiser
  const handleReset = () => {
    setApiKey('');
    setEnvironment('sandbox');
    setShowApiKey(false);
    showMessage('info', 'Configuration réinitialisée');
  };

  // Fonction pour scroller vers ApiTester
  const scrollToApiTester = () => {
    apiTesterRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Modifier la fonction onSelectEndpoint pour inclure le scroll
  const handleSelectEndpoint = (endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint);

    // Si la configuration est réduite, on scroll directement
    if (isConfigCollapsed) {
      setTimeout(scrollToApiTester, 100); // Petit délai pour la transition
    }
  };

  // Fonction pour basculer l'état de réduction
  const toggleConfigCollapsed = () => {
    setIsConfigCollapsed(!isConfigCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        <Sidebar
          endpoints={endpoints}
          selectedEndpoint={selectedEndpoint}
          onSelectEndpoint={handleSelectEndpoint}
          onScrollToApiTester={scrollToApiTester}
        />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Section de configuration avec bouton de réduction */}
            <div className="mb-8 bg-white rounded-lg shadow">
              {/* En-tête de configuration */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuration API
                    {isConfigCollapsed && (
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        (Réduite - cliquez sur un endpoint pour tester)
                      </span>
                    )}
                  </h2>

                  <div className="flex items-center gap-4">
                    {message && !isConfigCollapsed && (
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800' :
                        message.type === 'error' ? 'bg-red-50 text-red-800' :
                          'bg-blue-50 text-blue-800'
                        }`}>
                        {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> :
                          message.type === 'error' ? <XCircle className="h-4 w-4" /> :
                            <RefreshCw className="h-4 w-4 animate-spin" />}
                        {message.text}
                      </div>
                    )}

                    <button
                      onClick={toggleConfigCollapsed}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors flex items-center gap-1"
                      title={isConfigCollapsed ? "Afficher la configuration" : "Réduire la configuration"}
                    >
                      {isConfigCollapsed ? (
                        <>
                          <ChevronDown className="h-5 w-5" />
                          <span className="text-sm">Afficher</span>
                        </>
                      ) : (
                        <>
                          <ChevronUp className="h-5 w-5" />
                          <span className="text-sm">Réduire</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Contenu de la configuration (conditionnel) */}
              {!isConfigCollapsed && (
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Colonne gauche : API Key */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-3">1. Configuration de l&apos;API Key</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Votre API Key
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type={showApiKey ? "text" : "password"}
                                className="w-full border rounded-md p-2 text-sm font-mono text-xs pr-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="pspkey_live_xxxxxxxxxxxxxxxxxxxxxxxx"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                spellCheck={false}
                              />
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(apiKey, 'apiKey')}
                                  className="text-gray-500 hover:text-blue-600 p-1 rounded hover:bg-gray-100 transition-colors"
                                  title="Copier l'API Key"
                                  disabled={!apiKey}
                                >
                                  {copiedItem === 'apiKey' ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowApiKey(!showApiKey)}
                                  className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors"
                                  title={showApiKey ? "Masquer l'API Key" : "Afficher l'API Key"}
                                >
                                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>
                            <div className="mt-2">
                              <button
                                onClick={testApiKey}
                                disabled={!apiKey || isLoading}
                                className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm flex items-center justify-center gap-2 transition-colors"
                              >
                                {isLoading ? (
                                  <>
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    Test en cours...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4" />
                                    Tester l&apos;API Key
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                            <h4 className="font-medium text-blue-800 text-sm mb-1">Où trouver votre API Key ?</h4>
                            <ul className="text-xs text-blue-700 space-y-1">
                              <li className="flex items-start gap-1">
                                <span className="mt-0.5">•</span>
                                <span>Connectez-vous à votre espace client Fineopay</span>
                              </li>
                              <li className="flex items-start gap-1">
                                <span className="mt-0.5">•</span>
                                <span>Accédez à la section &quot;API Keys&quot; ou &quot;Développeurs&quot;</span>
                              </li>
                              <li className="flex items-start gap-1">
                                <span className="mt-0.5">•</span>
                                <span>Générez une nouvelle clé ou copiez une clé existante</span>
                              </li>
                              <li className="flex items-start gap-1">
                                <span className="mt-0.5">•</span>
                                <span>Collez-la dans le champ ci-dessus</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Colonne droite : Environnement et informations */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-3">2. Environnement</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Environnement</label>
                            <select
                              className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={environment}
                              onChange={(e) => setEnvironment(e.target.value as 'sandbox' | 'production')}
                            >
                              <option value="sandbox">Sandbox (Test)</option>
                              <option value="production">Production (Live)</option>
                            </select>
                            <div className="mt-2 text-xs text-gray-600 space-y-1">
                              <p className="flex items-center gap-1">
                                <span className="font-medium">Base URL:</span>
                                <code className="bg-gray-100 px-1.5 py-0.5 rounded">https://psp-api.fineopay.com/api/v1</code>
                              </p>
                              <p className={`flex items-center gap-1 ${environment === 'sandbox' ? 'text-yellow-600' : 'text-green-600'}`}>
                                <span className="font-medium">Statut:</span>
                                {environment === 'sandbox' ? (
                                  <>
                                    <span className="h-2 w-2 bg-yellow-500 rounded-full"></span>
                                    <span>Mode test - Aucune transaction réelle</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                                    <span>Mode production - Transactions réelles</span>
                                  </>
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                            <h4 className="font-medium text-gray-800 text-sm mb-1">Recommandations</h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                              <li className="flex items-start gap-1">
                                <span className="mt-0.5">•</span>
                                <span>Utilisez le mode <strong>Sandbox</strong> pour vos tests de développement</span>
                              </li>
                              <li className="flex items-start gap-1">
                                <span className="mt-0.5">•</span>
                                <span>Basculez sur <strong>Production</strong> uniquement lorsque vous êtes prêt pour le lancement</span>
                              </li>
                              <li className="flex items-start gap-1">
                                <span className="mt-0.5">•</span>
                                <span>Ne partagez jamais votre API Key en production</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={handleReset}
                            className="flex-1 text-red-600 border border-red-300 px-4 py-2 rounded-md hover:bg-red-50 text-sm transition-colors"
                          >
                            Réinitialiser
                          </button>
                          <button
                            onClick={() => copyToClipboard(apiKey, 'apiKey')}
                            disabled={!apiKey}
                            className="flex-1 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 text-sm transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                          >
                            <Copy className="h-4 w-4" />
                            Copier la clé
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Indicateurs d'état */}
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="font-medium mb-3">État de la configuration</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className={`p-3 rounded-md ${apiKey ? 'bg-green-50' : 'bg-gray-100'} transition-colors`}>
                        <div className="text-xs text-gray-500 mb-1">API Key</div>
                        <div className={`font-medium ${apiKey ? 'text-green-600' : 'text-gray-400'} flex items-center gap-1`}>
                          {apiKey ? (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              <span className="truncate">Configurée</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4" />
                              <span>Non configurée</span>
                            </>
                          )}
                        </div>
                        {apiKey && (
                          <div className="text-xs text-gray-500 mt-1 truncate">
                            {apiKey.substring(0, 20)}...
                          </div>
                        )}
                      </div>
                      <div className="p-3 rounded-md bg-blue-50 transition-colors">
                        <div className="text-xs text-gray-500 mb-1">Environnement</div>
                        <div className="font-medium text-blue-600 flex items-center gap-1">
                          {environment === 'sandbox' ? (
                            <>
                              <span className="h-2 w-2 bg-yellow-500 rounded-full"></span>
                              <span>Sandbox</span>
                            </>
                          ) : (
                            <>
                              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                              <span>Production</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="p-3 rounded-md bg-gray-50 transition-colors">
                        <div className="text-xs text-gray-500 mb-1">Base URL</div>
                        <div className="font-medium text-gray-700 text-sm truncate">
                          psp-api.fineopay.com
                        </div>
                      </div>
                      <div className="p-3 rounded-md bg-gray-50 transition-colors">
                        <div className="text-xs text-gray-500 mb-1">Endpoints disponibles</div>
                        <div className="font-medium text-gray-700">
                          {endpoints.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section ApiTester avec ref */}
            <div ref={apiTesterRef}>
              {selectedEndpoint && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold">Testeur d&apos;API</h2>
                    <div className="text-sm text-gray-500">
                      {apiKey ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Prêt à tester
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          Configurez d&apos;abord votre API Key
                        </span>
                      )}
                    </div>
                  </div>
                  <ApiTester
                    endpoint={selectedEndpoint}
                    environment={environment}
                    accessToken=""
                    apiKey={apiKey}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}