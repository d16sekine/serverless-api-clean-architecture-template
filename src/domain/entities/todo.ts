// ------------------------------------------------------------------
// domain 層（技術非依存のビジネスロジック）
// フレームワークや AWS SDK には一切依存しない。id や時刻など「外部で決まる値」
// は引数で受け取り、この層は純粋・決定的に保つ（＝テストが容易になる）。
// ------------------------------------------------------------------
import { ValidationError } from '../errors'

export type Todo = {
  readonly id: string
  readonly title: string
  readonly completed: boolean
  readonly createdAt: string
}

export type CreateTodoInput = {
  id: string
  title: string
  createdAt: string
}

const MAX_TITLE_LENGTH = 100

// Todo を生成するファクトリ。ビジネスルール（不変条件）はここで守る。
export const createTodo = (
  input: CreateTodoInput
): Todo => {
  const title = input.title.trim()

  if (title.length === 0) {
    throw new ValidationError('title は必須です')
  }
  if (title.length > MAX_TITLE_LENGTH) {
    throw new ValidationError(
      `title は ${MAX_TITLE_LENGTH} 文字以内で入力してください`
    )
  }

  return {
    id: input.id,
    title,
    completed: false,
    createdAt: input.createdAt,
  }
}

// 完了状態にした「新しい」Todo を返す（元のオブジェクトは変更しない = 不変）。
export const completeTodo = (todo: Todo): Todo => {
  return { ...todo, completed: true }
}
