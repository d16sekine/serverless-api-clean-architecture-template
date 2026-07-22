// ------------------------------------------------------------------
// domain 層のエラー定義
// 「業務上の失敗」をドメインの言葉で表す。HTTP ステータス等の技術詳細は
// ここには持ち込まず、handler 層で変換する（関心の分離）。
// ------------------------------------------------------------------

// 入力値がビジネスルールを満たさない（handler 層で 400 に変換）
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

// 対象の Todo が存在しない（handler 層で 404 に変換）
export class TodoNotFoundError extends Error {
  constructor(id: string) {
    super(`Todo が見つかりません: ${id}`)
    this.name = 'TodoNotFoundError'
  }
}
