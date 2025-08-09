import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'

interface HelloResponse {
  message: string
  timestamp: string
  requestId: string
}

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const response: HelloResponse = {
      message: 'Hello from Serverless TypeScript Lambda!',
      timestamp: new Date().toISOString(),
      requestId: context.requestId,
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
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
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}
