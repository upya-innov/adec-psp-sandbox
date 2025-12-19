export interface SandboxEnvironment {
  id: string;
  name: string;
  baseUrl: string;
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  tokenExpiry?: Date;
}

export interface APITestRequest {
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  body?: any;
  queryParams?: Record<string, string>;
}

export interface APITestResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
  size: number;
}

export interface TestHistoryItem {
  id: string;
  timestamp: Date;
  request: APITestRequest;
  response: APITestResponse;
}