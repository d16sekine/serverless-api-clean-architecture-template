// ------------------------------------------------------------------
// infrastructure 層（技術依存の実装）
// IdProvider ポートを Node.js 標準の randomUUID で実装する。
// ------------------------------------------------------------------
import { randomUUID } from 'node:crypto'
import { IdProvider } from '../usecases/ports/id-provider'

export class UuidIdProvider implements IdProvider {
  generate(): string {
    return randomUUID()
  }
}
