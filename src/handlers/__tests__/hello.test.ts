import { describe, it, expect } from 'vitest'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { handler } from '../hello'

describe('hello handler', () => {
  const mockContext: Context = {
    callbackWaitsForEmptyEventLoop: true,
    functionName: 'test-function',
    functionVersion: '1',
    invokedFunctionArn:
      'arn:aws:lambda:us-east-1:123456789012:function:test-function',
    memoryLimitInMB: '256',
    awsRequestId: 'test-request-id',
    logGroupName: '/aws/lambda/test-function',
    logStreamName:
      '2023/01/01/[1]abcdefghijklmnopqrstuvwxyz',
    getRemainingTimeInMillis: () => 30000,
    done: () => {},
    fail: () => {},
    succeed: () => {},
    requestId: 'test-request-id',
  }

  const mockEvent: Partial<APIGatewayProxyEvent> = {
    resource: '/hello',
    path: '/hello',
    httpMethod: 'GET',
    headers: {},
    multiValueHeaders: {},
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
      requestId: 'test-request-id',
      stage: 'test',
      resourceId: 'test-resource-id',
      httpMethod: 'GET',
      resourcePath: '/hello',
      path: '/test/hello',
      accountId: '123456789012',
      apiId: 'test-api-id',
      protocol: 'HTTP/1.1',
      requestTime: '01/Jan/2023:00:00:00 +0000',
      requestTimeEpoch: 1672531200,
      identity: {
        cognitoIdentityPoolId: null,
        accountId: null,
        cognitoIdentityId: null,
        caller: null,
        sourceIp: '127.0.0.1',
        principalOrgId: null,
        accessKey: null,
        cognitoAuthenticationType: null,
        cognitoAuthenticationProvider: null,
        userArn: null,
        userAgent: 'test-agent',
        user: null,
      },
      domainName:
        'test-api.execute-api.us-east-1.amazonaws.com',
      apiKeyId: null,
      domainPrefix: 'test-api',
    },
    body: null,
    isBase64Encoded: false,
  }

  it('should return 200 status code', async () => {
    const result = await handler(
      mockEvent as APIGatewayProxyEvent,
      mockContext
    )

    expect(result.statusCode).toBe(200)
  })

  it('should return correct headers', async () => {
    const result = await handler(
      mockEvent as APIGatewayProxyEvent,
      mockContext
    )

    expect(result.headers).toEqual({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods':
        'OPTIONS,GET,POST,PUT,DELETE',
    })
  })

  it('should return hello message with correct structure', async () => {
    const result = await handler(
      mockEvent as APIGatewayProxyEvent,
      mockContext
    )
    const body = JSON.parse(result.body)

    expect(body).toHaveProperty(
      'message',
      'Hello from Serverless TypeScript Lambda!'
    )
    expect(body).toHaveProperty('timestamp')
    expect(body).toHaveProperty(
      'requestId',
      mockContext.requestId
    )
    expect(new Date(body.timestamp)).toBeInstanceOf(Date)
  })

  it('should handle errors gracefully', async () => {
    // Mock an error by passing invalid context
    const invalidContext = null as unknown as Context

    const result = await handler(
      mockEvent as APIGatewayProxyEvent,
      invalidContext
    )

    expect(result.statusCode).toBe(500)
    expect(result.headers['Content-Type']).toBe(
      'application/json'
    )

    const body = JSON.parse(result.body)
    expect(body).toHaveProperty(
      'error',
      'Internal Server Error'
    )
    expect(body).toHaveProperty('message')
  })
})
