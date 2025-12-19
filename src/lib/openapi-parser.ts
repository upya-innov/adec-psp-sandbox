import { OpenAPISpec, Endpoint, Operation } from '@/types/openapi';

let cachedSpec: OpenAPISpec | null = null;

// Type guard pour vérifier si c'est une opération valide
function isOperation(obj: any): obj is Operation {
  return obj && typeof obj === 'object' && 'responses' in obj;
}

// Type guard pour vérifier si c'est un PathItem
function isPathItem(obj: any): obj is Record<string, any> {
  return obj && typeof obj === 'object';
}

export async function loadOpenAPISpec(): Promise<OpenAPISpec> {
  if (cachedSpec) {
    return cachedSpec;
  }

  try {
    const response = await fetch('/openapi.json');
    if (!response.ok) {
      throw new Error('Failed to load OpenAPI spec');
    }
    const spec = await response.json() as OpenAPISpec;
    cachedSpec = spec;
    return spec;
  } catch (error) {
    console.error('Error loading OpenAPI spec:', error);
    throw error;
  }
}

export function getAllEndpoints(spec: OpenAPISpec): Endpoint[] {
  const endpoints: Endpoint[] = [];

  Object.entries(spec.paths).forEach(([path, pathItem]) => {
    if (!isPathItem(pathItem)) return;

    Object.entries(pathItem).forEach(([method, operation]) => {
      // Vérifier si c'est une méthode HTTP valide
      const httpMethods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];
      if (!httpMethods.includes(method.toLowerCase()) || !isOperation(operation)) {
        return;
      }

      endpoints.push({
        path,
        method: method.toUpperCase(),
        summary: operation.summary || '',
        description: operation.description || '',
        tags: operation.tags || [],
        parameters: operation.parameters || [],
        requestBody: operation.requestBody,
        responses: operation.responses,
        security: operation.security,
      });
    });
  });

  return endpoints;
}

export function getEndpointsByTag(spec: OpenAPISpec, tag: string): Endpoint[] {
  return getAllEndpoints(spec).filter(endpoint =>
    endpoint.tags.includes(tag)
  );
}

export function getEndpointByPath(spec: OpenAPISpec, path: string, method: string): Endpoint | undefined {
  return getAllEndpoints(spec).find(
    endpoint => endpoint.path === path && endpoint.method === method.toUpperCase()
  );
}