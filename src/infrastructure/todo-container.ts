// ------------------------------------------------------------------
// composition root（依存性の組み立て）
// 各層の実装をここで 1 回だけ結線する。handler はこの結線済みユースケースを
// 使うだけで、具体的な実装（リポジトリや時計）を知らなくてよい。
// 本番で永続化を変えたい場合は、ここの InMemoryTodoRepository を
// DynamoDbTodoRepository 等に差し替えるだけでよい（他の層は無変更）。
// ------------------------------------------------------------------
import { InMemoryTodoRepository } from '../repositories/in-memory-todo-repository'
import { UuidIdProvider } from './uuid-id-provider'
import { SystemClock } from './system-clock'
import { CreateTodoUseCase } from '../usecases/create-todo'
import { ListTodosUseCase } from '../usecases/list-todos'
import { GetTodoUseCase } from '../usecases/get-todo'
import { CompleteTodoUseCase } from '../usecases/complete-todo'

const todoRepository = new InMemoryTodoRepository()
const idProvider = new UuidIdProvider()
const clock = new SystemClock()

export const createTodoUseCase = new CreateTodoUseCase(
  todoRepository,
  idProvider,
  clock
)
export const listTodosUseCase = new ListTodosUseCase(
  todoRepository
)
export const getTodoUseCase = new GetTodoUseCase(
  todoRepository
)
export const completeTodoUseCase = new CompleteTodoUseCase(
  todoRepository
)
