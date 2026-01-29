'use client';

import { useState, useEffect } from 'react';
import { EndpointCard } from '@/components/api/endpoint-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loadOpenAPISpec, getAllEndpoints, getEndpointsByTag } from '@/lib/openapi-parser';
import { Endpoint } from '@/types/openapi';
import {
  Search,
  Filter,
  Database,
  CreditCard,
  Send,
  Globe,
  Shield,
  Terminal,
  FileText,
} from 'lucide-react';
import ApiTester from '@/components/api/ApiTester';

export default function DashboardPage() {
  const [spec, setSpec] = useState<any>(null);
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [filteredEndpoints, setFilteredEndpoints] = useState<Endpoint[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Nouveau modèle: login email/password + X-API-Key (pour endpoints /api-key)
  const [email, setEmail] = useState<string>('owner@mycompany.com');
  const [password, setPassword] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>(''); // X-API-Key
  const [accessToken, setAccessToken] = useState<string>('');
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('sandbox'); // conservé pour UI

  useEffect(() => {
    async function loadSpec() {
      try {
        const data = await loadOpenAPISpec();
        setSpec(data);
        const allEndpoints = getAllEndpoints(data);
        setEndpoints(allEndpoints);
        setFilteredEndpoints(allEndpoints);
        if (allEndpoints.length > 0) setSelectedEndpoint(allEndpoints[0]);
      } catch (error) {
        console.error('Failed to load API spec:', error);
      } finally {
        setLoading(false);
      }
    }
    loadSpec();
  }, []);

  // Charger depuis localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('psp_email');
    const savedApiKey = localStorage.getItem('psp_api_key');
    const savedToken = localStorage.getItem('psp_access_token');
    const savedEnv = localStorage.getItem('psp_environment');

    if (savedEmail) setEmail(savedEmail);
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedToken) setAccessToken(savedToken);
    if (savedEnv === 'production' || savedEnv === 'sandbox') setEnvironment(savedEnv);
  }, []);

  // Sauvegarder dans localStorage
  useEffect(() => {
    localStorage.setItem('psp_email', email);
    localStorage.setItem('psp_environment', environment);

    if (apiKey) localStorage.setItem('psp_api_key', apiKey);
    else localStorage.removeItem('psp_api_key');

    if (accessToken) localStorage.setItem('psp_access_token', accessToken);
    else localStorage.removeItem('psp_access_token');
  }, [email, apiKey, accessToken, environment]);

  useEffect(() => {
    let filtered = endpoints;

    if (selectedTag !== 'all' && spec) {
      filtered = getEndpointsByTag(spec, selectedTag);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((endpoint) =>
        (endpoint.path || '').toLowerCase().includes(q) ||
        (endpoint.summary || '').toLowerCase().includes(q) ||
        (endpoint.description || '').toLowerCase().includes(q)
      );
    }

    setFilteredEndpoints(filtered);
  }, [endpoints, selectedTag, searchQuery, spec]);

  const handleTestEndpoint = (endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint);
  };

  // ✅ Auth: POST /auth/login via proxy (évite CORS)
  const handleAuthentication = async () => {
    try {
      const response = await fetch('/api/sandbox/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: '/auth/login',
          method: 'POST',
          headers: {}, // tu peux ajouter des headers custom si besoin
          body: { email, password },
          environment, // gardé pour UI, mais ton proxy doit ignorer ou mapper
        }),
      });

      const result = await response.json();

      // ✅ Supporte les 2 formats:
      // 1) { success, data: { access_token } }
      // 2) { access_token }
      const token =
        result?.data?.access_token ||
        result?.access_token;

      if (!token) {
        console.error('Login response:', result);
        alert("Échec: access_token introuvable dans la réponse.");
        return;
      }

      setAccessToken(token);

      // Optionnel: stocker refresh_token / expires_in si tu veux
      // const refresh = result?.data?.refresh_token;
      // const expiresIn = result?.data?.expires_in;

      alert('Authentification réussie ✅ Token obtenu.');
    } catch (error) {
      console.error('Authentication failed:', error);
      alert("Erreur lors de l’authentification.");
    }
  };


  const tags = spec?.tags || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">{spec?.info?.title || 'API Dashboard'}</h1>
            <p className="text-gray-600 mt-2">{spec?.info?.description?.split('\n')?.[0] || ''}</p>
          </div>

          <div className="mb-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">🔐 Configuration API</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Environnement</label>
                <select
                  className="w-full border rounded-md p-2 text-sm"
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value as 'sandbox' | 'production')}
                >
                  <option value="sandbox">Sandbox</option>
                  <option value="production">Production</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Base URL: <code>https://psp-api.fineopay.com</code>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2 text-sm"
                  placeholder="owner@mycompany.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mot de passe</label>
                <input
                  type="password"
                  className="w-full border rounded-md p-2 text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Access Token</label>
                <input
                  type="password"
                  className="w-full border rounded-md p-2 text-sm"
                  placeholder="Token JWT (auto-rempli)"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  readOnly={!!accessToken}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">X-API-Key (pour endpoints /api-key)</label>
                <input
                  type="password"
                  className="w-full border rounded-md p-2 text-sm"
                  placeholder="Votre X-API-Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAuthentication}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm"
              >
                Se connecter (obtenir token)
              </button>

              <button
                onClick={() => {
                  setEmail('owner@mycompany.com');
                  setPassword('');
                  setApiKey('');
                  setAccessToken('');
                  localStorage.removeItem('psp_email');
                  localStorage.removeItem('psp_api_key');
                  localStorage.removeItem('psp_access_token');
                }}
                className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 text-sm"
              >
                Effacer
              </button>

              {accessToken && (
                <span className="flex items-center text-green-600 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Authentifié
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="endpoints" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="endpoints" className="gap-2">
              <Database className="h-4 w-4" />
              Endpoints
            </TabsTrigger>
            <TabsTrigger value="tester" className="gap-2">
              <Terminal className="h-4 w-4" />
              Tester API
            </TabsTrigger>
            <TabsTrigger value="documentation" className="gap-2">
              <FileText className="h-4 w-4" />
              Documentation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher des endpoints..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <Button
                  variant={selectedTag === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTag('all')}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Tous
                </Button>

                {tags.map((tag: any) => (
                  <Button
                    key={tag.name}
                    variant={selectedTag === tag.name ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTag(tag.name)}
                  >
                    {tag.name === 'Payments' && <CreditCard className="h-4 w-4 mr-2" />}
                    {tag.name === 'Transfers' && <Send className="h-4 w-4 mr-2" />}
                    {tag.name === 'Currencies' && <Globe className="h-4 w-4 mr-2" />}
                    {tag.name === 'Authentication' && <Shield className="h-4 w-4 mr-2" />}
                    {tag.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              {filteredEndpoints.map((endpoint, index) => (
                <EndpointCard
                  key={`${endpoint.path}-${endpoint.method}-${index}`}
                  endpoint={endpoint}
                  onTest={handleTestEndpoint}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tester">
            {selectedEndpoint ? (
              <ApiTester
                endpoint={selectedEndpoint}
                environment={environment}
                accessToken={accessToken}
                apiKey={apiKey}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Sélectionnez un endpoint à tester</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="documentation">
            <div className="prose max-w-none">
              <h2>Getting Started</h2>

              <h3>Authentication</h3>
              <p>
                Authenticate with <code>POST /auth/login</code> using email/password to receive an{' '}
                <code>access_token</code>.
              </p>

              <h3>API Base URL</h3>
              <div className="border rounded-lg p-4">
                <code className="text-sm">https://psp-api.fineopay.com</code>
              </div>

              <h3>Usage Example</h3>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                {`// Login
POST /auth/login
{
  "email": "owner@mycompany.com",
  "password": "SecurePassword123!"
}

// Initiate payment with JWT
POST /payments
Authorization: Bearer <access_token>

// Initiate payment with API Key
POST /payments/initiate
X-API-Key: <api_key>`}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
