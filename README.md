# Serverless Framework TypeScript Template

A production-ready serverless framework template for building TypeScript Lambda functions on AWS.

## Features

- **TypeScript Support**: Full TypeScript configuration with type definitions
- **Fast Building**: Uses esbuild for rapid compilation and bundling
- **Testing**: Vitest for modern, fast testing
- **Local Development**: Serverless offline for local testing
- **API Gateway**: Pre-configured CORS and HTTP endpoints

## Quick Start

### Prerequisites

- Node.js 18 or higher
- AWS CLI configured with appropriate credentials
- Yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/d16sekine/serverless-framework-template.git
cd serverless-framework-template

# Install dependencies
yarn install
```

### Development

```bash
# Start local development server
yarn dev

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

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
├── src/
│   └── handlers/
│       ├── hello.ts              # Hello world Lambda function
│       └── __tests__/
│           └── hello.test.ts     # Tests for hello function
├── serverless.yml                # Serverless framework configuration
├── tsconfig.json                 # TypeScript configuration
├── vitest.config.ts              # Vitest configuration
└── package.json                  # Dependencies and scripts
```

## Configuration

### Environment Variables

The template uses the following environment variables:

- `NODE_ENV`: Automatically set based on deployment stage

## Available Scripts

- `yarn dev` - Start serverless offline for local development
- `yarn build` - Build the project using serverless package
- `yarn test` - Run tests with Vitest
- `yarn test:watch` - Run tests in watch mode
- `yarn deploy` - Deploy to AWS (dev stage)
- `yarn deploy:dev` - Deploy to development stage
- `yarn deploy:prod` - Deploy to production stage
- `yarn remove` - Remove deployed resources
- `yarn logs` - View function logs
- `yarn clean` - Remove build artifacts

## License

MIT License - see LICENSE file for details.
