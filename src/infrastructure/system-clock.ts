// ------------------------------------------------------------------
// infrastructure 層: Clock ポートをシステム時刻で実装する。
// ------------------------------------------------------------------
import { Clock } from '../usecases/ports/clock'

export class SystemClock implements Clock {
  now(): string {
    return new Date().toISOString()
  }
}
