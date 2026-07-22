import { test, expect } from 'vitest'
import { InMemoryTodoRepository } from '../../src/repositories/in-memory-todo-repository'
import { createTodo } from '../../src/domain/entities/todo'

const sampleTodo = () =>
  createTodo({
    id: 'id-1',
    title: 'タスク',
    createdAt: '2026-01-01T00:00:00.000Z',
  })

test('save した Todo を findById で取得できる', async () => {
  const repository = new InMemoryTodoRepository()
  const todo = sampleTodo()

  await repository.save(todo)

  expect(await repository.findById('id-1')).toEqual(todo)
})

test('findById は存在しない id で null を返す', async () => {
  const repository = new InMemoryTodoRepository()

  expect(await repository.findById('missing')).toBeNull()
})

test('save は同じ id の Todo を上書きする', async () => {
  const repository = new InMemoryTodoRepository()
  const todo = sampleTodo()
  await repository.save(todo)

  await repository.save({ ...todo, completed: true })

  expect(
    (await repository.findById('id-1'))?.completed
  ).toBe(true)
  expect(await repository.findAll()).toHaveLength(1)
})
