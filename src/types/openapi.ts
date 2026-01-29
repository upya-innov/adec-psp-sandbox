// src/types/openapi.ts

export interface OpenAPISpec {
  openapi: string;

  info: {
    title: string;
    version: string;
    description?: string;
    contact?: {
      name?: string;
      email?: string;
      url?: string;
    };
    license?: {
      name?: string;
      url?: string;
    };
    [k: string]: any;
  };

  servers?: Array<{
    url: string;
    description?: string;
    [k: string]: any;
  }>;

  tags?: Array<{
    name: string;
    description?: string;
    [k: string]: any;
  }>;

  paths: Record<string, PathItem>;

  components?: {
    securitySchemes?: Record<string, SecurityScheme>;
    schemas?: Record<string, Schema>;
    examples?: Record<string, any>;
    parameters?: Record<string, Parameter>;
    responses?: Record<string, Response>;
    [k: string]: any;
  };

  security?: SecurityRequirement[];

  [k: string]: any;
}

export interface PathItem {
  get?: Operation;
  post?: Operation;
  put?: Operation;
  delete?: Operation;
  patch?: Operation;
  options?: Operation;
  head?: Operation;
  trace?: Operation;
  parameters?: Parameter[];
  [k: string]: any;
}

export interface Operation {
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, Response>;
  security?: SecurityRequirement[];
  [k: string]: any;
}

export interface Parameter {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  schema?: Schema;
  example?: any;
  examples?: Record<string, any>;
  [k: string]: any;
}

export interface RequestBody {
  description?: string;
  content?: Record<string, MediaType>; // <-- tolérant
  required?: boolean;
  [k: string]: any;
}

export interface MediaType {
  schema?: Schema;
  example?: any;
  examples?: Record<string, any>;
  [k: string]: any;
}

export interface Response {
  description?: string;
  headers?: Record<string, Header>;
  content?: Record<string, MediaType>;
  [k: string]: any;
}

export interface Header {
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  schema?: Schema;
  [k: string]: any;
}

export interface Schema {
  type?: string;
  properties?: Record<string, Schema>;
  required?: string[];
  items?: Schema;
  enum?: string[];
  format?: string;
  example?: any;
  $ref?: string;
  allOf?: Schema[];
  anyOf?: Schema[];
  oneOf?: Schema[];
  not?: Schema;
  additionalProperties?: any;
  [k: string]: any;
}

export interface SecurityScheme {
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
  description?: string;
  name?: string;
  in?: 'query' | 'header' | 'cookie';
  scheme?: string;
  bearerFormat?: string;
  flows?: any;
  openIdConnectUrl?: string;
  [k: string]: any;
}

export interface SecurityRequirement {
  [name: string]: string[];
}

export interface Endpoint {
  path: string;
  method: string;
  summary: string;
  description: string;
  tags: string[];
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, Response>;
  security?: SecurityRequirement[];
}
