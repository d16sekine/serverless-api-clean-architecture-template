import { Message } from '../domain/entities/message'

export class GetHelloMessageUseCase {
  execute(): Message {
    return {
      message: 'Hello World from Serverless REST API!',
      timestamp: new Date().toISOString(),
    }
  }
}
