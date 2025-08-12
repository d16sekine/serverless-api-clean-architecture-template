# Serverless Framework TypeScript Template

A production-ready serverless framework template for building TypeScript Lambda functions on AWS.

## Features

- **TypeScript Support**: Full TypeScript configuration with type definitions
- **Fast Building**: Uses esbuild for rapid compilation and bundling
- **Testing**: Vitest for modern, fast testing
- **Code Quality**: ESLint and Prettier for consistent code formatting and linting
- **Local Development**: Serverless offline for local testing
- **API Gateway**: Pre-configured CORS and HTTP endpoints

## Getting Started

### Prerequisites

- Node.js 18 or higher
- AWS CLI configured with appropriate credentials
- Yarn package manager

### Using This Template

1. **Create a new repository from this template**
   - Click "Use this template" on GitHub
   - Or clone: `git clone <YOUR_REPOSITORY_URL>`

2. **Initial Setup**
   ```bash
   cd <your-project-name>
   
   # Install dependencies
   yarn install
   
   # Update project configuration (see Configuration section below)
   ```

3. **Required Configuration Updates**
   
   After creating your project from this template, update the following files:

   **package.json**:
   ```json
   {
     "name": "your-project-name",
     "repository": "https://github.com/your-username/your-repository",
     "author": "your-email@example.com"
   }
   ```

   **serverless.yml**:
   ```yaml
   service: your-service-name
   ```

4. **Verify Setup**
   ```bash
   # Test the setup
   yarn test
   yarn dev
   ```

### Development

```bash
# Start local development server
yarn dev

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Format code with Prettier
yarn format

# Lint code with ESLint
yarn lint

# Build the project
yarn build
```

The local server will start on `http://localhost:3000`

### Testing the API

```bash
# Test the hello endpoint
curl http://localhost:3000/hello
```

### Deployment

```bash
# Deploy to AWS (development stage)
yarn deploy

# Deploy to specific stage
yarn deploy:dev
yarn deploy:prod

# View function logs
yarn logs

# Remove deployed resources
yarn remove
```

## Project Structure

```
├── __tests__/
│   └── hello.test.ts             # Tests for hello function
├── src/
│   └── handlers/
│       └── hello.ts              # Hello world Lambda function
├── .eslintrc.json                # ESLint configuration
├── .prettierrc.json              # Prettier configuration
├── serverless.yml                # Serverless framework configuration
├── tsconfig.json                 # TypeScript configuration
├── vitest.config.ts              # Vitest configuration
└── package.json                  # Dependencies and scripts
```

## Customization Guide

### Adding New Functions

1. **Create a new handler**:
   ```bash
   # Create new handler file
   touch src/handlers/your-function.ts
   ```

2. **Implement the function**:
   ```typescript
   import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'

   export const handler = async (
     event: APIGatewayProxyEvent,
     context: Context
   ): Promise<APIGatewayProxyResult> => {
     // Your function logic here
     return {
       statusCode: 200,
       headers: {
         'Content-Type': 'application/json',
         'Access-Control-Allow-Origin': '*',
       },
       body: JSON.stringify({ message: 'Success' }),
     }
   }
   ```

3. **Add to serverless.yml**:
   ```yaml
   functions:
     yourFunction:
       handler: src/handlers/your-function.handler
       events:
         - http:
             path: /your-endpoint
             method: get
             cors: true
   ```

4. **Create tests**:
   ```bash
   touch __tests__/your-function.test.ts
   ```

### Environment Configuration

#### Environment Variables
- `NODE_ENV`: Automatically set based on deployment stage
- Add custom variables in `serverless.yml`:
  ```yaml
  provider:
    environment:
      YOUR_CUSTOM_VAR: ${env:YOUR_CUSTOM_VAR, 'default-value'}
  ```

#### AWS Resources Configuration
- **Runtime**: Node.js 20.x
- **Default Region**: ap-northeast-1 (Tokyo) - Change in serverless.yml
- **Memory**: 256MB - Adjust per function if needed
- **Timeout**: 30 seconds - Increase for long-running functions

### Code Quality Setup

The template includes pre-configured tools:

- **ESLint**: TypeScript-aware linting with recommended rules
- **Prettier**: Consistent code formatting
- **Integration**: ESLint and Prettier work together without conflicts

#### Customizing Code Quality Rules

**ESLint (.eslintrc.json)**:
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    // Add your custom rules here
  }
}
```

**Prettier (.prettierrc.json)**:
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

### Database Integration

#### DynamoDB Example
1. **Add IAM permissions in serverless.yml**:
   ```yaml
   provider:
     iam:
       role:
         statements:
           - Effect: Allow
             Action:
               - dynamodb:GetItem
               - dynamodb:PutItem
               - dynamodb:UpdateItem
               - dynamodb:DeleteItem
             Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/YourTable"
   ```

2. **Add DynamoDB resource**:
   ```yaml
   resources:
     Resources:
       YourTable:
         Type: AWS::DynamoDB::Table
         Properties:
           TableName: ${self:service}-${self:provider.stage}-your-table
           AttributeDefinitions:
             - AttributeName: id
               AttributeType: S
           KeySchema:
             - AttributeName: id
               KeyType: HASH
           BillingMode: PAY_PER_REQUEST
   ```

### Testing Strategy

#### Unit Tests with Vitest
```typescript
import { describe, it, expect, vi } from 'vitest'
import { handler } from '../src/handlers/your-function'

describe('Your Function', () => {
  it('should return success response', async () => {
    const event = {} as any
    const context = { awsRequestId: 'test-id' } as any
    
    const result = await handler(event, context)
    
    expect(result.statusCode).toBe(200)
    expect(JSON.parse(result.body)).toHaveProperty('message')
  })
})
```

#### Integration Tests
```bash
# Start local server
yarn dev

# Test endpoints
curl http://localhost:3000/your-endpoint
```

### Deployment Strategies

#### Multiple Environments
```bash
# Development
yarn deploy:dev

# Production
yarn deploy:prod

# Custom stage
serverless deploy --stage staging
```

#### CI/CD Integration
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: yarn install
      - run: yarn test
      - run: yarn deploy:prod
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Available Scripts

### Development
- `yarn dev` - Start serverless offline for local development
- `yarn build` - Build the project using serverless package
- `yarn test` - Run tests with Vitest
- `yarn test:watch` - Run tests in watch mode

### Code Quality
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check if code is properly formatted
- `yarn lint` - Lint code with ESLint
- `yarn lint:fix` - Lint and auto-fix issues with ESLint

### Deployment
- `yarn deploy` - Deploy to AWS (dev stage)
- `yarn deploy:dev` - Deploy to development stage
- `yarn deploy:prod` - Deploy to production stage
- `yarn remove` - Remove deployed resources
- `yarn logs` - View function logs

### Utility
- `yarn clean` - Remove build artifacts

## Contributing

This is a template repository. If you have suggestions for improvements:

1. Fork the original template repository
2. Make your changes
3. Submit a pull request with a clear description

## Troubleshooting

### Common Issues

#### "serverless command not found"
```bash
# Install serverless globally
npm install -g serverless
```

#### AWS credentials not configured
```bash
# Configure AWS CLI
aws configure

# Or use environment variables
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
```

#### TypeScript compilation errors
```bash
# Clear build cache
yarn clean

# Rebuild
yarn build
```

#### Port 3000 already in use
```bash
# Use different port
serverless offline --httpPort 3001

# Or kill process using port 3000
lsof -ti:3000 | xargs kill
```

### Getting Help

- Check the [Serverless Framework documentation](https://www.serverless.com/framework/docs/)
- Review [AWS Lambda documentation](https://docs.aws.amazon.com/lambda/)
- Search existing issues on the original template repository

## License

MIT License - see LICENSE file for details.
