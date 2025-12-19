'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ApiTester from '@/components/api/ApiTester';
import { Endpoint } from '@/types/openapi';
import { loadOpenAPISpec, getAllEndpoints } from '@/lib/openapi-parser';

export default function HomePage() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [apiSecret, setApiSecret] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('sandbox');

  useEffect(() => {
    async function loadAPI() {
      try {
        const spec = await loadOpenAPISpec();
        const allEndpoints = getAllEndpoints(spec);
        setEndpoints(allEndpoints);

        // Sélectionner le premier endpoint par défaut
        if (allEndpoints.length > 0) {
          setSelectedEndpoint(allEndpoints[0]);
        }
      } catch (error) {
        console.error('Failed to load API spec:', error);
      }
    }

    loadAPI();
  }, []);

  // Charger depuis localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('adec_api_key');
    const savedApiSecret = localStorage.getItem('adec_api_secret');
    const savedToken = localStorage.getItem('adec_access_token');
    const savedEnv = localStorage.getItem('adec_environment');

    if (savedApiKey) setApiKey(savedApiKey);
    if (savedApiSecret) setApiSecret(savedApiSecret);
    if (savedToken) setAccessToken(savedToken);
    if (savedEnv === 'production' || savedEnv === 'sandbox') setEnvironment(savedEnv);
  }, []);

  // Sauvegarder dans localStorage
  useEffect(() => {
    if (apiKey) localStorage.setItem('adec_api_key', apiKey);
    if (apiSecret) localStorage.setItem('adec_api_secret', apiSecret);
    if (accessToken) localStorage.setItem('adec_access_token', accessToken);
    localStorage.setItem('adec_environment', environment);
  }, [apiKey, apiSecret, accessToken, environment]);

  const handleAuthentication = async () => {
    try {
      const response = await fetch('/api/sandbox/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: '/auth/token',
          method: 'POST',
          body: {
            api_key: apiKey,
            api_secret: apiSecret,
          },
          environment,
        }),
      });

      const data = await response.json();
      if (data.access_token) {
        setAccessToken(data.access_token);
      }
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          endpoints={endpoints}
          selectedEndpoint={selectedEndpoint}
          onSelectEndpoint={setSelectedEndpoint}
        />

        {/* Contenu principal */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Section d'authentification */}
            <div className="mb-8 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">🔐 Configuration API</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Environnement</label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value as 'sandbox' | 'production')}
                  >
                    <option value="sandbox">Sandbox</option>
                    <option value="production">Production</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Access Token</label>
                  <input
                    type="password"
                    className="w-full border rounded-md p-2"
                    placeholder="Votre token JWT"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">API Key</label>
                  <input
                    type="password"
                    className="w-full border rounded-md p-2"
                    placeholder="Votre clé API"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">API Secret</label>
                  <input
                    type="password"
                    className="w-full border rounded-md p-2"
                    placeholder="Votre secret API"
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={handleAuthentication}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Obtenir un Token
              </button>
            </div>

            {/* Testeur d'API */}
            {selectedEndpoint && (
              <ApiTester
                endpoint={selectedEndpoint}
                environment={environment}
                accessToken={accessToken}
                apiKey={apiKey}
                apiSecret={apiSecret}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}