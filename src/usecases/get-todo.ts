// ------------------------------------------------------------------
// usecases 層: id を指定して Todo を 1 件取得する
// 見つからなければドメインのエラーを投げる（HTTP への変換は handler 層）。
// ------------------------------------------------------------------
import { Todo } from '../domain/entities/todo'
import { TodoNotFoundError } from '../domain/errors'
import { TodoRepository } from './ports/todo-repository'

export class GetTodoUseCase {
  constructor(
    private readonly todoRepository: TodoRepository
  ) {}

  async execute(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findById(id)
    if (!todo) {
      throw new TodoNotFoundError(id)
    }
    return todo
  }
}
