import { test, expect } from 'vitest'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { handler } from '../src/handlers/hello'

const mockContext: Context = {
  awsRequestId: 'test-request-id',
} as Context

const mockEvent = {} as APIGatewayProxyEvent

test('hello handler は 200 と正しいボディを返す', async () => {
  const result = await handler(mockEvent, mockContext)

  expect(result.statusCode).toBe(200)

  const body = JSON.parse(result.body)
  expect(body).toHaveProperty(
    'message',
    'Hello World from Serverless REST API!'
  )
})

test('hello handler はエラー時に 500 を返す', async () => {
  // 不正な context を渡してエラーを発生させる
  const invalidContext = null as unknown as Context

  const result = await handler(mockEvent, invalidContext)

  expect(result.statusCode).toBe(500)

  const body = JSON.parse(result.body)
  expect(body).toHaveProperty(
    'error',
    'Internal Server Error'
  )
})
