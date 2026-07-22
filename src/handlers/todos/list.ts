// ------------------------------------------------------------------
// handlers 層: GET /todos
// ------------------------------------------------------------------
import { APIGatewayProxyResult } from 'aws-lambda'
import { listTodosUseCase } from '../../infrastructure/todo-container'
import { jsonResponse, toErrorResponse } from '../http'

export const handler =
  async (): Promise<APIGatewayProxyResult> => {
    try {
      const todos = await listTodosUseCase.execute()
      return jsonResponse(200, { todos })
    } catch (error) {
      return toErrorResponse(error)
    }
  }
