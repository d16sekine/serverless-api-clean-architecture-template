// ------------------------------------------------------------------
// handlers 層の共通ユーティリティ
// ドメイン/ユースケースの結果とエラーを HTTP レスポンスへ変換する。
// 「HTTP という技術詳細」を handler 層に閉じ込めるのが目的。
// ------------------------------------------------------------------
import { APIGatewayProxyResult } from 'aws-lambda'
import {
  ValidationError,
  TodoNotFoundError,
} from '../domain/errors'

const baseHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export const jsonResponse = (
  statusCode: number,
  body: unknown
): APIGatewayProxyResult => ({
  statusCode,
  headers: baseHeaders,
  body: JSON.stringify(body),
})

// ドメインのエラーを適切な HTTP ステータスへマッピングする。
export const toErrorResponse = (
  error: unknown
): APIGatewayProxyResult => {
  if (error instanceof ValidationError) {
    return jsonResponse(400, { error: error.message })
  }
  if (error instanceof TodoNotFoundError) {
    return jsonResponse(404, { error: error.message })
  }

  console.error('Unexpected error:', error)
  return jsonResponse(500, {
    error: 'Internal Server Error',
  })
}
