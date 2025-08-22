const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/dev';

export type ApiResponse = {
  status: number;
  data: any;
};

export async function makeApiRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  baseUrl?: string
): Promise<ApiResponse> {
  const apiBaseUrl = baseUrl || API_BASE_URL;
  const url = `${apiBaseUrl}${endpoint}`;
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    let data;
    
    try {
      data = await response.json();
    } catch {
      data = await response.text();
    }

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}