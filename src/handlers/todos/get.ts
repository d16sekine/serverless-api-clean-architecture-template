// ------------------------------------------------------------------
// handlers 層: GET /todos/{id}
// ------------------------------------------------------------------
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda'
import { getTodoUseCase } from '../../infrastructure/todo-container'
import { ValidationError } from '../../domain/errors'
import { jsonResponse, toErrorResponse } from '../http'

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id
    if (!id) {
      throw new ValidationError('id が必要です')
    }
    const todo = await getTodoUseCase.execute(id)
    return jsonResponse(200, todo)
  } catch (error) {
    return toErrorResponse(error)
  }
}
