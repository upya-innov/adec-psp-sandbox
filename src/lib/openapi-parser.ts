// src/lib/openapi-parser.ts
import { OpenAPISpec, Endpoint, Operation } from '@/types/openapi';

let cachedSpec: OpenAPISpec | null = null;

// Type guard: Operation OpenAPI
function isOperation(obj: any): obj is Operation {
  return !!obj && typeof obj === 'object' && 'responses' in obj;
}

// Type guard: PathItem (objet)
function isPathItem(obj: any): obj is Record<string, any> {
  return !!obj && typeof obj === 'object';
}

export async function loadOpenAPISpec(): Promise<OpenAPISpec> {
  if (cachedSpec) return cachedSpec;

  const response = await fetch('/openapi.json', { cache: 'no-store' });
  if (!response.ok) throw new Error('Failed to load OpenAPI spec');

  const spec = (await response.json()) as OpenAPISpec;
  cachedSpec = spec;
  return spec;
}

export function getAllEndpoints(spec: OpenAPISpec): Endpoint[] {
  const endpoints: Endpoint[] = [];
  const httpMethods = new Set([
    'get',
    'post',
    'put',
    'delete',
    'patch',
    'options',
    'head',
    'trace',
  ]);

  Object.entries(spec.paths || {}).forEach(([path, pathItem]) => {
    if (!isPathItem(pathItem)) return;

    Object.entries(pathItem).forEach(([method, operation]) => {
      const lower = method.toLowerCase();
      if (!httpMethods.has(lower)) return;
      if (!isOperation(operation)) return;

      endpoints.push({
        path,
        method: method.toUpperCase(),
        summary: operation.summary || `${method.toUpperCase()} ${path}`,
        description: operation.description || '',
        tags: operation.tags?.length ? operation.tags : ['Untagged'],
        parameters: operation.parameters || [],
        requestBody: operation.requestBody,
        responses: operation.responses || {},
        security: operation.security,
      } as Endpoint);
    });
  });

  // Tri stable
  endpoints.sort((a, b) => {
    const tagA = a.tags?.[0] || '';
    const tagB = b.tags?.[0] || '';
    return tagA.localeCompare(tagB) || a.path.localeCompare(b.path);
  });

  return endpoints;
}

export function getEndpointsByTag(spec: OpenAPISpec, tag: string): Endpoint[] {
  return getAllEndpoints(spec).filter((endpoint) => endpoint.tags?.includes(tag));
}

export function getEndpointByPath(
  spec: OpenAPISpec,
  path: string,
  method: string
): Endpoint | undefined {
  const m = method.toUpperCase();
  return getAllEndpoints(spec).find((endpoint) => endpoint.path === path && endpoint.method === m);
}