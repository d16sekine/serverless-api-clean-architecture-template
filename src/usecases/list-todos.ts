// ------------------------------------------------------------------
// usecases 層: Todo 一覧を取得する
// ------------------------------------------------------------------
import { Todo } from '../domain/entities/todo'
import { TodoRepository } from './ports/todo-repository'

export class ListTodosUseCase {
  constructor(
    private readonly todoRepository: TodoRepository
  ) {}

  async execute(): Promise<Todo[]> {
    return this.todoRepository.findAll()
  }
}
