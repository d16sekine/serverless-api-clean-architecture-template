// ------------------------------------------------------------------
// handlers 層: Todo リソースのルーター（単一 Lambda = lambdalith 構成）
//
// Todo の 4 ルートを 1 つの Lambda 関数で受け、HTTP メソッドとリソース
// パスで各アクションへ振り分ける。単一の関数（＝単一プロセス）になるため、
// InMemoryTodoRepository の状態が全ルートで共有され、ローカルでも本番でも
// 一貫して動く。
//
// メモ: インメモリ実装は「1 インスタンス内」でのみ状態を保持する。複数
// インスタンスへスケールしたり永続化が必要になったら、TodoRepository ポート
// を DynamoDB 実装に差し替えるだけでよい（domain / usecases 層は無変更）。
// ------------------------------------------------------------------
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda'
import { handler as createTodo } from './create'
import { handler as listTodos } from './list'
import { handler as getTodo } from './get'
import { handler as completeTodo } from './complete'
import { jsonResponse, toErrorResponse } from '../http'

type RouteHandler = (
  event: APIGatewayProxyEvent
) => Promise<APIGatewayProxyResult>

type Route = {
  method: string
  resource: string
  handler: RouteHandler
}

// API Gateway の resource はパステンプレート（例: /todos/{id}）が入る。
const routes: Route[] = [
  {
    method: 'POST',
    resource: '/todos',
    handler: createTodo,
  },
  { method: 'GET', resource: '/todos', handler: listTodos },
  {
    method: 'GET',
    resource: '/todos/{id}',
    handler: getTodo,
  },
  {
    method: 'PATCH',
    resource: '/todos/{id}/complete',
    handler: completeTodo,
  },
]

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const resource = event.resource ?? event.path
  const route = routes.find(
    r =>
      r.method === event.httpMethod &&
      r.resource === resource
  )

  if (!route) {
    return jsonResponse(404, { error: 'Not Found' })
  }

  try {
    return await route.handler(event)
  } catch (error) {
    return toErrorResponse(error)
  }
}
