import { test, expect } from 'vitest'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { handler } from '../../src/handlers/todos/index'

// ルーター（handlers 層）を実際の合成ルート（todo-container）越しに検証する
// 統合テスト。domain / usecases / repository の結線まで含めて動作を確認する。
// 各テストは自分で作成した Todo を自分の id で参照するため、共有ストアが
// 蓄積しても互いに干渉しない（一覧の件数は断定しない）。

const makeEvent = (
  over: Partial<APIGatewayProxyEvent>
): APIGatewayProxyEvent =>
  ({
    httpMethod: 'GET',
    resource: '/todos',
    path: '/todos',
    pathParameters: null,
    body: null,
    ...over,
  }) as APIGatewayProxyEvent

test('POST /todos は 201 と作成した Todo を返す', async () => {
  const res = await handler(
    makeEvent({
      httpMethod: 'POST',
      resource: '/todos',
      body: JSON.stringify({ title: 'テスト' }),
    })
  )

  expect(res.statusCode).toBe(201)
  const body = JSON.parse(res.body)
  expect(body.title).toBe('テスト')
  expect(body.completed).toBe(false)
  expect(body.id).toBeDefined()
})

test('未知のルート（method + resource の不一致）は 404 を返す', async () => {
  const res = await handler(
    makeEvent({
      httpMethod: 'DELETE',
      resource: '/todos/{id}',
    })
  )

  expect(res.statusCode).toBe(404)
})

test('不正な JSON ボディは 400 を返す', async () => {
  const res = await handler(
    makeEvent({
      httpMethod: 'POST',
      resource: '/todos',
      body: '{invalid',
    })
  )

  expect(res.statusCode).toBe(400)
})

test('title が無いボディは 400 を返す', async () => {
  const res = await handler(
    makeEvent({
      httpMethod: 'POST',
      resource: '/todos',
      body: JSON.stringify({}),
    })
  )

  expect(res.statusCode).toBe(400)
})

test('存在しない id の取得は 404 を返す', async () => {
  const res = await handler(
    makeEvent({
      httpMethod: 'GET',
      resource: '/todos/{id}',
      pathParameters: { id: 'does-not-exist' },
    })
  )

  expect(res.statusCode).toBe(404)
})

test('作成 → 取得 → 完了 のライフサイクルが通る', async () => {
  const created = await handler(
    makeEvent({
      httpMethod: 'POST',
      resource: '/todos',
      body: JSON.stringify({ title: 'ライフサイクル' }),
    })
  )
  const id = JSON.parse(created.body).id

  const got = await handler(
    makeEvent({
      httpMethod: 'GET',
      resource: '/todos/{id}',
      pathParameters: { id },
    })
  )
  expect(got.statusCode).toBe(200)
  expect(JSON.parse(got.body).id).toBe(id)

  const completed = await handler(
    makeEvent({
      httpMethod: 'PATCH',
      resource: '/todos/{id}/complete',
      pathParameters: { id },
    })
  )
  expect(completed.statusCode).toBe(200)
  expect(JSON.parse(completed.body).completed).toBe(true)
})

test('GET /todos は作成済みの Todo を含む一覧を返す', async () => {
  const created = await handler(
    makeEvent({
      httpMethod: 'POST',
      resource: '/todos',
      body: JSON.stringify({ title: '一覧テスト' }),
    })
  )
  const id = JSON.parse(created.body).id

  const res = await handler(
    makeEvent({ httpMethod: 'GET', resource: '/todos' })
  )

  expect(res.statusCode).toBe(200)
  const todos = JSON.parse(res.body).todos as Array<{
    id: string
  }>
  expect(todos.some(t => t.id === id)).toBe(true)
})
