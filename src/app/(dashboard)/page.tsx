'use client';

import { useState, useEffect } from 'react';
import { EndpointCard } from '@/components/api/endpoint-card';
import { APITester } from '@/components/api/api-tester';
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

export default function DashboardPage() {
  const [spec, setSpec] = useState<any>(null);
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [filteredEndpoints, setFilteredEndpoints] = useState<Endpoint[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSpec() {
      try {
        const data = await loadOpenAPISpec();
        setSpec(data);
        const allEndpoints = getAllEndpoints(data);
        setEndpoints(allEndpoints);
        setFilteredEndpoints(allEndpoints);
      } catch (error) {
        console.error('Failed to load API spec:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSpec();
  }, []);

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

  const tags = spec?.tags || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {spec?.info.title}
        </h1>
        <p className="text-muted-foreground mt-2">
          {spec?.info.description.split('\n')[0]}
        </p>
      </div>

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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
          <APITester
            initialEndpoint={selectedEndpoint}
            spec={spec}
          />
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
                <p className="text-sm text-muted-foreground mt-2">
                  Use for testing and development
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Production</h4>
                <code className="text-sm">https://api.adecsa.com/v1</code>
                <p className="text-sm text-muted-foreground mt-2">
                  Use for live transactions
                </p>
              </div>
            </div>

            <h3>Webhooks</h3>
            <p>
              The API uses webhooks to notify your application about payment and transfer status changes.
              All webhooks include an <code>x-secret-key</code> header for verification.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}