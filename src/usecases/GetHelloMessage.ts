import { Message } from '../domain/entities/Message'

export class GetHelloMessageUseCase {
  execute(): Message {
    return {
      message: 'Hello World from Serverless REST API!',
      timestamp: new Date().toISOString(),
    }
  }
}
