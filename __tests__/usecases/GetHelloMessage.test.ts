import { GetHelloMessageUseCase } from '../../src/usecases/GetHelloMessage'
import { test, expect } from 'vitest'

test('GetHelloMessageUseCase returns correct message', () => {
  const useCase = new GetHelloMessageUseCase()
  const result = useCase.execute()

  expect(result.message).toBe('Hello World from Serverless REST API!')
  expect(result.timestamp).toBeDefined()
})