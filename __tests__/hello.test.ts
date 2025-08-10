import { describe, test, expect } from 'vitest'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { handler } from '../src/handlers/hello'

describe('hello handler', () => {
  const mockContext: Context = {
    awsRequestId: 'test-request-id',
  } as Context

  const mockEvent = {} as APIGatewayProxyEvent

  test('should return 200 status code and correct body', async () => {
    const result = await handler(mockEvent, mockContext)

    expect(result.statusCode).toBe(200)
    
    const body = JSON.parse(result.body)
    expect(body).toHaveProperty(
      'message',
      'Hello from Serverless TypeScript Lambda!'
    )
  })

  test('should handle errors gracefully', async () => {
    // Mock an error by passing invalid context
    const invalidContext = null as unknown as Context

    const result = await handler(mockEvent, invalidContext)

    expect(result.statusCode).toBe(500)
    
    const body = JSON.parse(result.body)
    expect(body).toHaveProperty(
      'error',
      'Internal Server Error'
    )
  })
})
