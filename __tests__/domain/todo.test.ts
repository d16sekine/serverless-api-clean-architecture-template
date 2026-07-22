import { test, expect } from 'vitest'
import {
  createTodo,
  completeTodo,
} from '../../src/domain/entities/todo'
import { ValidationError } from '../../src/domain/errors'

// ドメイン層は技術に依存せず、純粋・決定的（id や時刻は引数で受け取る）。
// そのため new Date() 等をモックせずにテストできる。

test('createTodo は completed=false の Todo を生成する', () => {
  const todo = createTodo({
    id: 'id-1',
    title: '牛乳を買う',
    createdAt: '2026-01-01T00:00:00.000Z',
  })

  expect(todo).toEqual({
    id: 'id-1',
    title: '牛乳を買う',
    completed: false,
    createdAt: '2026-01-01T00:00:00.000Z',
  })
})

test('createTodo は title の前後の空白を除去する', () => {
  const todo = createTodo({
    id: 'id-1',
    title: '  タスク  ',
    createdAt: '2026-01-01T00:00:00.000Z',
  })

  expect(todo.title).toBe('タスク')
})

test('createTodo は空の title を ValidationError で拒否する', () => {
  expect(() =>
    createTodo({
      id: 'id-1',
      title: '   ',
      createdAt: '2026-01-01T00:00:00.000Z',
    })
  ).toThrow(ValidationError)
})

test('createTodo は 100 文字を超える title を拒否する', () => {
  expect(() =>
    createTodo({
      id: 'id-1',
      title: 'あ'.repeat(101),
      createdAt: '2026-01-01T00:00:00.000Z',
    })
  ).toThrow(ValidationError)
})

test('completeTodo は completed=true の新しい Todo を返し、元の Todo は変更しない', () => {
  const todo = createTodo({
    id: 'id-1',
    title: 'タスク',
    createdAt: '2026-01-01T00:00:00.000Z',
  })

  const completed = completeTodo(todo)

  expect(completed.completed).toBe(true)
  expect(todo.completed).toBe(false) // 不変性
})
