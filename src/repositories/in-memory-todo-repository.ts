// ------------------------------------------------------------------
// repositories 層（port の具体的な実装）
// TodoRepository ポートをインメモリ（Map）で実装する。学習・テスト・
// ローカル実行向け。本番では同じポートを DynamoDB 実装に差し替えればよい。
//
// 注意: これはプロセス内メモリのため、実際の AWS Lambda では関数インスタンス
// ごとに状態が分かれ、共有されない。serverless-offline（ローカル）は全関数を
// 同一プロセスで動かすため状態が共有される。この違いこそが「ポートを分ける」
// 理由であり、本番で永続ストアへ差し替えるべき箇所を示している。
// ------------------------------------------------------------------
import { Todo } from '../domain/entities/todo'
import { TodoRepository } from '../usecases/ports/todo-repository'

export class InMemoryTodoRepository
  implements TodoRepository
{
  private readonly store = new Map<string, Todo>()

  async save(todo: Todo): Promise<void> {
    this.store.set(todo.id, todo)
  }

  async findById(id: string): Promise<Todo | null> {
    return this.store.get(id) ?? null
  }

  async findAll(): Promise<Todo[]> {
    return Array.from(this.store.values())
  }
}
