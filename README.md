# Serverless API Clean Architecture Template

A production-ready template for building REST APIs with TypeScript on AWS Lambda, following Clean Architecture principles.

> **Note: This template uses [osls (Open-Source Serverless)](https://github.com/oss-serverless/osls), not the official `serverless` CLI.**
> The official Serverless Framework v3 reached end-of-life on 2024-12-31, and v4 moved to a proprietary, paid license.
> `osls` is the community-maintained, **MIT-licensed** fork of v3 (drop-in compatible), so this template stays fully open-source and free to use.
> All `yarn` scripts call `osls` under the hood, exposing the familiar `serverless` / `sls` / `osls` commands.

## Features

- **Clean Architecture**: Domain-driven design with clear separation of concerns
- **TypeScript Support**: Full TypeScript configuration with type definitions
- **REST API Ready**: Pre-configured for building scalable REST APIs
- **Test-Driven Development**: Vitest setup for TDD workflow
- **Fast Building**: Uses esbuild for rapid compilation and bundling
- **Code Quality**: ESLint and Prettier for consistent code formatting
- **Local Development**: Serverless offline for local API testing
- **API Gateway**: Pre-configured CORS and HTTP endpoints
- **API Playground**: Interactive web UI for testing API endpoints

## Getting Started

### Prerequisites

- Node.js 20.19+ (or 22.13+, or 24+) — required by osls v4
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

#### Using curl

```bash
# Hello endpoint
curl http://localhost:3000/dev/hello

# Todo endpoints (clean-architecture example)
# Create
curl -X POST http://localhost:3000/dev/todos \
  -H 'Content-Type: application/json' -d '{"title":"Buy milk"}'
# List
curl http://localhost:3000/dev/todos
# Get one (use an id returned by create)
curl http://localhost:3000/dev/todos/<id>
# Mark as completed
curl -X PATCH http://localhost:3000/dev/todos/<id>/complete
```

> The Todo endpoints are a worked example of the layered architecture.
> See **[docs/architecture.md](docs/architecture.md)** for a full walkthrough (Japanese).

#### Using API Playground

```bash
# Start the API server (in one terminal)
yarn dev

# Start the playground (in another terminal)
yarn playground:dev

# Open browser
open http://localhost:3001
```

The playground provides an interactive web interface to:

- Test all API endpoints with different HTTP methods
- Customize request headers and body
- View formatted responses
- Switch between different API base URLs (local, dev, prod)

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
├── __tests__/                    # Test files (mirrors src/ layers)
│   ├── domain/                   # todo.test.ts
│   ├── usecases/                 # todo-usecases.test.ts, get-hello-message.test.ts
│   ├── repositories/             # in-memory-todo-repository.test.ts
│   └── hello.test.ts
├── docs/                         # Japanese learning material
│   ├── architecture.md           # Clean architecture walkthrough (tutorial)
│   └── article.md                # Zenn/Qiita article draft
├── src/
│   ├── domain/                   # Business logic (technology-independent)
│   │   ├── entities/             # todo.ts, message.ts
│   │   └── errors.ts             # ValidationError, TodoNotFoundError
│   ├── usecases/                 # Application use cases (create/list/get/complete-todo.ts)
│   │   └── ports/                # Interfaces: todo-repository, id-provider, clock
│   ├── repositories/             # in-memory-todo-repository.ts (implements a port)
│   ├── infrastructure/           # uuid-id-provider, system-clock, todo-container (DI)
│   └── handlers/                 # Lambda entry points
│       ├── todos/                # index.ts (router) + create/list/get/complete.ts
│       ├── http.ts               # domain error -> HTTP status mapping
│       ├── hello.ts
│       └── types/                # Handler type definitions
├── playground/                   # API testing web application (Next.js)
├── serverless.yml                # osls (Serverless Framework v3-compatible) config
├── tsconfig.json                 # TypeScript configuration
├── vitest.config.ts              # Vitest configuration
├── CLAUDE.md                     # AI assistant instructions
└── package.json                  # Dependencies and scripts
```

## Learning Material (日本語)

This template doubles as a hands-on **clean architecture** tutorial in Japanese,
using the Todo API as a worked example:

- **[docs/architecture.md](docs/architecture.md)** — レイヤー構成・依存の向き・リクエストの流れ・新エンドポイントの追加手順を図解
- **[docs/article.md](docs/article.md)** — Zenn/Qiita 向けの解説記事の下書き（osls への移行背景つき）

## Customization Guide

### Adding New Functions

1. **Create a use case**:

   ```bash
   # Create new use case file
   touch src/usecases/YourUseCase.ts
   ```

2. **Implement the use case**:

   ```typescript
   export class YourUseCase {
     execute(params: any) {
       // Business logic here
       return { result: 'success' }
     }
   }
   ```

3. **Create a handler**:

   ```typescript
   import {
     APIGatewayProxyEvent,
     APIGatewayProxyResult,
     Context,
   } from 'aws-lambda'
   import { YourUseCase } from '../usecases/YourUseCase'

   export const handler = async (
     event: APIGatewayProxyEvent,
     context: Context
   ): Promise<APIGatewayProxyResult> => {
     const useCase = new YourUseCase()
     const result = useCase.execute(event)

     return {
       statusCode: 200,
       headers: {
         'Content-Type': 'application/json',
         'Access-Control-Allow-Origin': '*',
       },
       body: JSON.stringify(result),
     }
   }
   ```

4. **Add to serverless.yml**:

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

5. **Create tests (TDD approach)**:

   ```bash
   # Test for use case
   touch __tests__/usecases/YourUseCase.test.ts

   # Test for handler
   touch __tests__/handlers/your-function.test.ts
   ```

### Environment Configuration

#### Environment Variables

This template supports environment variables through `.env` files:

1. **Setup Environment Variables**:

   ```bash
   # Copy the example file
   cp .env.example .env

   # Edit your environment variables
   nano .env
   ```

2. **Configure in serverless.yml**:

   ```yaml
   useDotenv: true

   provider:
     environment:
       ENV_SAMPLE: ${env:ENV_SAMPLE, 'default_value'}
   ```

3. **Use in Lambda functions**:
   ```typescript
   const envSample =
     process.env.ENV_SAMPLE || 'default_value'
   ```

**Note**: `.env` files are automatically ignored by git. Always use `.env.example` to document required environment variables.

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
  "extends": ["@typescript-eslint/recommended", "prettier"],
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

### Playground

- `yarn playground:dev` - Start API playground web interface (port 3001)
- `yarn playground:build` - Build playground for production
- `yarn playground:start` - Start production playground server

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

This template uses **osls** (the community-maintained OSS fork of Serverless Framework v3),
which is installed locally as a dev dependency and provides the `serverless` / `sls` / `osls` commands.
Run commands via `yarn` scripts (e.g. `yarn dev`) or install it globally if you prefer:

```bash
# Install the OSS fork globally (do NOT install the proprietary `serverless` v4 unless intended)
npm install -g osls
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

- Check the [osls (Open-Source Serverless) documentation](https://github.com/oss-serverless/osls)
- Reference the [Serverless Framework v3 documentation](https://www.serverless.com/framework/docs/) (osls is v3-compatible)
- Review [AWS Lambda documentation](https://docs.aws.amazon.com/lambda/)
- Search existing issues on the original template repository

## License

MIT License - see LICENSE file for details.
