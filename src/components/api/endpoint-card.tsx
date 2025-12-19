'use client';

import { useState } from 'react';
import { Endpoint } from '@/types/openapi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Terminal,
  FileText,
  Code,
  Play,
  ChevronDown,
  ChevronUp,
  Shield
} from 'lucide-react';

interface EndpointCardProps {
  endpoint: Endpoint;
  onTest?: (endpoint: Endpoint) => void;
}

export function EndpointCard({ endpoint, onTest }: EndpointCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800';
      case 'POST': return 'bg-green-100 text-green-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPath = (path: string) => {
    return path.replace(/{([^}]+)}/g, '{$1}');
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className={getMethodColor(endpoint.method)}>
                {endpoint.method}
              </Badge>
              <CardTitle className="text-lg font-mono">
                {formatPath(endpoint.path)}
              </CardTitle>
            </div>
            <CardDescription>{endpoint.summary}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {onTest && (
              <Button
                size="sm"
                onClick={() => onTest(endpoint)}
                className="gap-1"
              >
                <Play className="h-4 w-4" />
                Tester
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {endpoint.security && endpoint.security.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Authentification requise
            </span>
          </div>
        )}
      </CardHeader>

      {expanded && (
        <CardContent>
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description" className="gap-2">
                <FileText className="h-4 w-4" />
                Description
              </TabsTrigger>
              <TabsTrigger value="parameters" className="gap-2">
                <Terminal className="h-4 w-4" />
                Paramètres
              </TabsTrigger>
              <TabsTrigger value="responses" className="gap-2">
                <Code className="h-4 w-4" />
                Réponses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-4 mt-4">
              <div className="prose prose-sm max-w-none">
                <p>{endpoint.description}</p>
              </div>
            </TabsContent>

            <TabsContent value="parameters" className="space-y-4 mt-4">
              {endpoint.parameters && endpoint.parameters.length > 0 ? (
                <div className="space-y-2">
                  {endpoint.parameters.map((param: any, index: number) => (
                    <div key={index} className="p-3 border rounded-md">
                      <div className="flex justify-between items-center">
                        <code className="font-mono text-sm">{param.name}</code>
                        <Badge variant="outline">{param.in}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {param.description}
                      </p>
                      {param.schema && (
                        <div className="mt-2">
                          <span className="text-xs font-medium">Type:</span>
                          <code className="ml-2 text-xs font-mono">
                            {param.schema.type}
                          </code>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucun paramètre requis</p>
              )}
            </TabsContent>

            <TabsContent value="responses" className="space-y-4 mt-4">
              {Object.entries(endpoint.responses).map(([status, response]: [string, any]) => (
                <div key={status} className="p-3 border rounded-md">
                  <div className="flex justify-between items-center">
                    <Badge
                      className={
                        status.startsWith('2') ? 'bg-green-100 text-green-800' :
                          status.startsWith('4') ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {response.description}
                    </span>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}