import { test, expect } from 'vitest'
import {
  jsonResponse,
  toErrorResponse,
} from '../../src/handlers/http'
import {
  ValidationError,
  TodoNotFoundError,
} from '../../src/domain/errors'

test('jsonResponse は statusCode・JSON ヘッダー・本文を返す', () => {
  const res = jsonResponse(200, { ok: true })

  expect(res.statusCode).toBe(200)
  expect(res.headers?.['Content-Type']).toBe(
    'application/json'
  )
  expect(JSON.parse(res.body)).toEqual({ ok: true })
})

test('toErrorResponse は ValidationError を 400 に変換する', () => {
  const res = toErrorResponse(
    new ValidationError('title は必須です')
  )

  expect(res.statusCode).toBe(400)
  expect(JSON.parse(res.body).error).toBe(
    'title は必須です'
  )
})

test('toErrorResponse は TodoNotFoundError を 404 に変換する', () => {
  const res = toErrorResponse(new TodoNotFoundError('id-1'))

  expect(res.statusCode).toBe(404)
})

test('toErrorResponse は未知のエラーを 500 にし、内部詳細を漏らさない', () => {
  const res = toErrorResponse(
    new Error('secret internal detail')
  )

  expect(res.statusCode).toBe(500)
  expect(JSON.parse(res.body).error).toBe(
    'Internal Server Error'
  )
  // 500 応答に内部のエラーメッセージが含まれないこと
  expect(res.body).not.toContain('secret internal detail')
})
