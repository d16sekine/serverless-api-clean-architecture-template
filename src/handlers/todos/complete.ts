// ------------------------------------------------------------------
// handlers 層: PATCH /todos/{id}/complete
// ------------------------------------------------------------------
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda'
import { completeTodoUseCase } from '../../infrastructure/todo-container'
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
    const todo = await completeTodoUseCase.execute(id)
    return jsonResponse(200, todo)
  } catch (error) {
    return toErrorResponse(error)
  }
}
