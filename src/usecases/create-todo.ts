// ------------------------------------------------------------------
// usecases 層（アプリケーションのユースケース）
// 「Todo を作成する」という操作の手順を組み立てる。ドメインのルールは
// domain 層に、技術詳細は port 経由で外部に委ねる。
// ------------------------------------------------------------------
import { Todo, createTodo } from '../domain/entities/todo'
import { TodoRepository } from './ports/todo-repository'
import { IdProvider } from './ports/id-provider'
import { Clock } from './ports/clock'

export type CreateTodoCommand = {
  title: string
}

export class CreateTodoUseCase {
  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly idProvider: IdProvider,
    private readonly clock: Clock
  ) {}

  async execute(command: CreateTodoCommand): Promise<Todo> {
    const todo = createTodo({
      id: this.idProvider.generate(),
      title: command.title,
      createdAt: this.clock.now(),
    })

    await this.todoRepository.save(todo)
    return todo
  }
}
