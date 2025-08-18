import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda'
import { GetHelloMessageUseCase } from '../usecases/GetHelloMessage'
import { HelloResponse } from './types/HelloResponse'

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const useCase = new GetHelloMessageUseCase()
    const messageData = useCase.execute()

    const response: HelloResponse = {
      message: messageData.message,
      timestamp:
        messageData.timestamp || new Date().toISOString(),
      requestId: context.awsRequestId,
      envSample: process.env.ENV_SAMPLE || 'default_value',
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(response),
    }
  } catch (error) {
    console.error('Error in hello handler:', error)

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message:
          error instanceof Error
            ? error.message
            : 'Unknown error',
      }),
    }
  }
}
