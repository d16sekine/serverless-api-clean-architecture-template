// ------------------------------------------------------------------
// handlers 層（Lambda のエントリーポイント）: POST /todos
// リクエストの「形」の検証（title が文字列か）だけを行い、
// ビジネスルールの検証は domain 層に任せる。
// ------------------------------------------------------------------
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda'
import { createTodoUseCase } from '../../infrastructure/todo-container'
import { ValidationError } from '../../domain/errors'
import { jsonResponse, toErrorResponse } from '../http'

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { title } = parseBody(event.body)
    const todo = await createTodoUseCase.execute({ title })
    return jsonResponse(201, todo)
  } catch (error) {
    return toErrorResponse(error)
  }
}

const parseBody = (
  raw: string | null
): { title: string } => {
  if (!raw) {
    throw new ValidationError('リクエストボディが必要です')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new ValidationError(
      'リクエストボディが不正な JSON です'
    )
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    typeof (parsed as Record<string, unknown>).title !==
      'string'
  ) {
    throw new ValidationError('title (string) は必須です')
  }

  return { title: (parsed as { title: string }).title }
}
