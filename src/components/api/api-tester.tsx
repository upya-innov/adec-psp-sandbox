'use client';

import { useState, useEffect } from 'react';
import { Endpoint } from '@/types/openapi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Play,
  Save,
  Copy,
  RotateCcw,
  Check,
  AlertTriangle,
  Server
} from 'lucide-react';

interface APITesterProps {
  initialEndpoint: Endpoint | null;
  spec: any;
}

export function APITester({ initialEndpoint, spec }: APITesterProps) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(initialEndpoint);
  const [server, setServer] = useState<string>('');
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [body, setBody] = useState<string>('');
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (spec?.servers?.[0]) {
      setServer(spec.servers[0].url);
    }
  }, [spec]);

  useEffect(() => {
    if (initialEndpoint) {
      setSelectedEndpoint(initialEndpoint);
    }
  }, [initialEndpoint]);

  const handleSendRequest = async () => {
    if (!selectedEndpoint || !server) {
      setError('Please select an endpoint and server');
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const url = new URL(`${server}${selectedEndpoint.path}`);

      // Add query parameters
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) {
          url.searchParams.append(key, value);
        }
      });

      const requestOptions: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      // Add body for POST, PUT, PATCH requests
      if (['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && body) {
        requestOptions.body = body;
      }

      const startTime = Date.now();
      const response = await fetch(url.toString(), requestOptions);
      const endTime = Date.now();

      const responseData = await response.json();

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        time: endTime - startTime,
        size: JSON.stringify(responseData).length,
      });
    } catch (err: any) {
      setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const generateExampleBody = () => {
    if (!selectedEndpoint?.requestBody?.content?.['application/json']?.examples) {
      return;
    }

    const examples = selectedEndpoint.requestBody.content['application/json'].examples;
    const firstExample = Object.values(examples)[0];
    if (firstExample && 'value' in firstExample) {
      setBody(JSON.stringify(firstExample.value, null, 2));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Configurez votre requête</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Serveur</label>
                <Select value={server} onValueChange={setServer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un serveur" />
                  </SelectTrigger>
                  <SelectContent>
                    {spec?.servers?.map((s: any, index: number) => (
                      <SelectItem key={index} value={s.url}>
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4" />
                          {s.description}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedEndpoint && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Endpoint</label>
                      <Badge variant="outline">
                        {selectedEndpoint.method}
                      </Badge>
                    </div>
                    <code className="block p-2 bg-secondary rounded text-sm font-mono">
                      {selectedEndpoint.path}
                    </code>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedEndpoint.summary}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Body</label>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={generateExampleBody}
                      >
                        Exemple
                      </Button>
                    </div>
                    <Textarea
                      placeholder='{"key": "value"}'
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="font-mono text-sm h-32"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Résultat</CardTitle>
              <CardDescription>
                Réponse de l&apos;API
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : response ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={
                        response.status >= 200 && response.status < 300
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {response.status} {response.statusText}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Temps: {response.time}ms • Taille: {response.size} bytes
                    </div>
                  </div>

                  <Tabs defaultValue="body">
                    <TabsList>
                      <TabsTrigger value="body">Body</TabsTrigger>
                      <TabsTrigger value="headers">Headers</TabsTrigger>
                    </TabsList>

                    <TabsContent value="body" className="mt-4">
                      <pre className="bg-secondary p-4 rounded-lg overflow-auto text-sm">
                        {JSON.stringify(response.data, null, 2)}
                      </pre>
                    </TabsContent>

                    <TabsContent value="headers" className="mt-4">
                      <div className="space-y-2">
                        {Object.entries(response.headers).map(([key, value]) => (
                          <div key={key} className="flex justify-between border-b pb-2">
                            <code className="text-sm font-medium">{key}</code>
                            <code className="text-sm text-muted-foreground">{String(value)}</code>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Envoyez une requête pour voir la réponse</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button
              onClick={handleSendRequest}
              disabled={!selectedEndpoint || loading}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              {loading ? 'Envoi...' : 'Envoyer la requête'}
            </Button>
            <Button variant="outline" onClick={() => setResponse(null)}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Effacer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}