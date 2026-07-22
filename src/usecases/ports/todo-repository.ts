// ------------------------------------------------------------------
// port（リポジトリインターフェース）
// usecase が「永続化に何を求めるか」だけを宣言する。具体的な保存先
// （インメモリ / DynamoDB 等）は repositories 層が実装する = 依存性逆転。
// ------------------------------------------------------------------
import { Todo } from '../../domain/entities/todo'

export type TodoRepository = {
  save(todo: Todo): Promise<void>
  findById(id: string): Promise<Todo | null>
  findAll(): Promise<Todo[]>
}
