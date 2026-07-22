// ------------------------------------------------------------------
// usecases 層: Todo を完了状態にする
// 取得 → ドメインの振る舞い(completeTodo) → 保存、という手順を組み立てる。
// ------------------------------------------------------------------
import { Todo, completeTodo } from '../domain/entities/todo'
import { TodoNotFoundError } from '../domain/errors'
import { TodoRepository } from './ports/todo-repository'

export class CompleteTodoUseCase {
  constructor(
    private readonly todoRepository: TodoRepository
  ) {}

  async execute(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findById(id)
    if (!todo) {
      throw new TodoNotFoundError(id)
    }

    const completed = completeTodo(todo)
    await this.todoRepository.save(completed)
    return completed
  }
}
