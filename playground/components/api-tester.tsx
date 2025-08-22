import { useState } from 'react';
import { makeApiRequest } from '@/utils/api-client';
import BaseUrlSettings from '@/components/base-url-settings';
import styles from '@/styles/ApiTester.module.css';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type ApiResponse = {
  status: number;
  data: any;
  error?: string;
};

export default function ApiTester() {
  const [baseUrl, setBaseUrl] = useState(
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/dev'
  );
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [endpoint, setEndpoint] = useState('/hello');
  const [requestBody, setRequestBody] = useState('{}');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      let body = undefined;
      if (method !== 'GET' && requestBody.trim()) {
        body = JSON.parse(requestBody);
      }

      const result = await makeApiRequest(endpoint, method, body, baseUrl);
      setResponse(result);
    } catch (error) {
      setResponse({
        status: 0,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <BaseUrlSettings 
        baseUrl={baseUrl} 
        onBaseUrlChange={setBaseUrl}
      />
      
      <h2>API Tester</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <select 
            value={method} 
            onChange={(e) => setMethod(e.target.value as HttpMethod)}
            className={styles.select}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="/api/endpoint"
            className={styles.input}
            required
          />
        </div>

        {method !== 'GET' && (
          <div className={styles.row}>
            <label htmlFor="requestBody">Request Body (JSON):</label>
            <textarea
              id="requestBody"
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              placeholder='{\"key\": \"value\"}'
              className={styles.textarea}
              rows={6}
            />
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className={styles.button}
        >
          {loading ? 'Sending...' : 'Send Request'}
        </button>
      </form>

      {response && (
        <div className={styles.response}>
          <h3>Response</h3>
          <div className={styles.responseHeader}>
            <span className={`${styles.status} ${response.status >= 200 && response.status < 300 ? styles.success : styles.error}`}>
              Status: {response.status}
            </span>
          </div>
          
          {response.error ? (
            <div className={styles.error}>
              <strong>Error:</strong> {response.error}
            </div>
          ) : (
            <pre className={styles.responseBody}>
              {JSON.stringify(response.data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}