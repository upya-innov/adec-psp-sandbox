'use client';

import { useState, useEffect } from 'react';
import { EndpointCard } from '@/components/api/endpoint-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  FileText
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

  // Nouveaux états pour l'authentification
  const [apiKey, setApiKey] = useState<string>('');
  const [apiSecret, setApiSecret] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('sandbox');

  useEffect(() => {
    async function loadSpec() {
      try {
        const data = await loadOpenAPISpec();
        setSpec(data);
        const allEndpoints = getAllEndpoints(data);
        setEndpoints(allEndpoints);
        setFilteredEndpoints(allEndpoints);

        // Sélectionner le premier endpoint par défaut
        if (allEndpoints.length > 0) {
          setSelectedEndpoint(allEndpoints[0]);
        }
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

  useEffect(() => {
    let filtered = endpoints;

    if (selectedTag !== 'all') {
      filtered = getEndpointsByTag(spec, selectedTag);
    }

    if (searchQuery) {
      filtered = filtered.filter(endpoint =>
        endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEndpoints(filtered);
  }, [endpoints, selectedTag, searchQuery, spec]);

  const handleTestEndpoint = (endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint);
  };

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
        alert('Authentification réussie ! Token obtenu.');
      } else {
        alert('Échec de l\'authentification. Vérifiez vos credentials.');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      alert('Erreur lors de l\'authentification.');
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
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              {spec?.info.title}
            </h1>
            <p className="text-gray-600 mt-2">
              {spec?.info.description.split('\n')[0]}
            </p>
          </div>

          {/* Section d'authentification */}
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
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">API Key</label>
                <input
                  type="password"
                  className="w-full border rounded-md p-2 text-sm"
                  placeholder="Votre clé API"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">API Secret</label>
                <input
                  type="password"
                  className="w-full border rounded-md p-2 text-sm"
                  placeholder="Votre secret API"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
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

            <div className="flex gap-3">
              <button
                onClick={handleAuthentication}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm"
              >
                Obtenir un Token
              </button>

              <button
                onClick={() => {
                  setApiKey('');
                  setApiSecret('');
                  setAccessToken('');
                  localStorage.removeItem('adec_api_key');
                  localStorage.removeItem('adec_api_secret');
                  localStorage.removeItem('adec_access_token');
                }}
                className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 text-sm"
              >
                Effacer
              </button>

              {accessToken && (
                <span className="flex items-center text-green-600 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Authentifié
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
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
                    {tag.name === 'Utilities' && <Globe className="h-4 w-4 mr-2" />}
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
                apiSecret={apiSecret}
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
                To use the ADEC PSP API, you need to authenticate using your API key and secret.
                Obtain an access token by calling the <code>/auth/token</code> endpoint.
              </p>

              <h3>API Environments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Sandbox</h4>
                  <code className="text-sm">https://api.sandbox.adecsa.com/v1</code>
                  <p className="text-sm text-gray-600 mt-2">
                    Use for testing and development
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Production</h4>
                  <code className="text-sm">https://api.adecsa.com/v1</code>
                  <p className="text-sm text-gray-600 mt-2">
                    Use for live transactions
                  </p>
                </div>
              </div>

              <h3>Webhooks</h3>
              <p>
                The API uses webhooks to notify your application about payment and transfer status changes.
                All webhooks include an <code>x-secret-key</code> header for verification.
              </p>

              <h3>Usage Example</h3>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                {`// Authentication
POST /auth/token
{
  "api_key": "your_api_key",
  "api_secret": "your_api_secret"
}

// Payment example
POST /payments/direct
{
  "transaction_id": "TX-123456",
  "amount": 1000,
  "currency": "XOF",
  "country": "CI",
  "channel": "orange-money",
  "customer": {
    "phone_number": "+2250700000000"
  }
}`}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}