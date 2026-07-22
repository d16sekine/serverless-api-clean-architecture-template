import { test, expect } from 'vitest'
import { InMemoryTodoRepository } from '../../src/repositories/in-memory-todo-repository'
import { CreateTodoUseCase } from '../../src/usecases/create-todo'
import { ListTodosUseCase } from '../../src/usecases/list-todos'
import { GetTodoUseCase } from '../../src/usecases/get-todo'
import { CompleteTodoUseCase } from '../../src/usecases/complete-todo'
import { TodoNotFoundError } from '../../src/domain/errors'
import { IdProvider } from '../../src/usecases/ports/id-provider'
import { Clock } from '../../src/usecases/ports/clock'

// テスト用のフェイク実装（決定的な値を返す）。
// ポート（interface）に依存しているため、本物の UUID や時計を使わずに検証できる。
const fakeIdProvider = (value: string): IdProvider => ({
  generate: () => value,
})
const fakeClock = (value: string): Clock => ({
  now: () => value,
})

test('CreateTodoUseCase は Todo を生成してリポジトリに保存する', async () => {
  const repository = new InMemoryTodoRepository()
  const useCase = new CreateTodoUseCase(
    repository,
    fakeIdProvider('id-1'),
    fakeClock('2026-01-01T00:00:00.000Z')
  )

  const todo = await useCase.execute({ title: 'タスク' })

  expect(todo.id).toBe('id-1')
  expect(todo.completed).toBe(false)
  expect(await repository.findById('id-1')).toEqual(todo)
})

test('ListTodosUseCase は保存済みの Todo をすべて返す', async () => {
  const repository = new InMemoryTodoRepository()
  const create = new CreateTodoUseCase(
    repository,
    fakeIdProvider('id-1'),
    fakeClock('2026-01-01T00:00:00.000Z')
  )
  await create.execute({ title: 'A' })

  const todos = await new ListTodosUseCase(
    repository
  ).execute()

  expect(todos).toHaveLength(1)
  expect(todos[0].title).toBe('A')
})

test('GetTodoUseCase は存在しない id で TodoNotFoundError を投げる', async () => {
  const repository = new InMemoryTodoRepository()
  const useCase = new GetTodoUseCase(repository)

  await expect(useCase.execute('missing')).rejects.toThrow(
    TodoNotFoundError
  )
})

test('CompleteTodoUseCase は Todo を完了状態にして保存する', async () => {
  const repository = new InMemoryTodoRepository()
  await new CreateTodoUseCase(
    repository,
    fakeIdProvider('id-1'),
    fakeClock('2026-01-01T00:00:00.000Z')
  ).execute({ title: 'タスク' })

  const todo = await new CompleteTodoUseCase(
    repository
  ).execute('id-1')

  expect(todo.completed).toBe(true)
  expect(
    (await repository.findById('id-1'))?.completed
  ).toBe(true)
})
