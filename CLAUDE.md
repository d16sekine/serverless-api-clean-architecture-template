# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a serverless framework template for TypeScript Lambda functions on AWS. The project includes:

- **serverless.yml**: Serverless Framework configuration for AWS Lambda deployment
- **TypeScript Configuration**: Full TypeScript setup with type definitions
- **Sample Functions**: Hello world and API proxy handlers in `src/handlers/`
- **Development Tools**: ESLint, Vitest, and offline development support

## Common Commands

### Development

- `npm run dev` - Start serverless offline for local development (port 3000)
- `npm run build` - Compile TypeScript to JavaScript
- `npm test` - Run Vitest tests
- `npm test:watch` - Run Vitest in watch mode

### Deployment

- `npm run deploy` - Deploy to AWS (default stage: dev)
- `npm run deploy:dev` - Deploy to development stage
- `npm run deploy:prod` - Deploy to production stage
- `npm run remove` - Remove the deployed stack from AWS
- `npm run logs` - View logs for the hello function

### Utility

- `npm run clean` - Remove build artifacts and serverless cache

## Architecture

The project follows a typical serverless structure:

- `src/handlers/` - Lambda function handlers
- `serverless.yml` - AWS resource definitions and function configurations
- Functions are built using the `serverless-esbuild` plugin
- CORS is pre-configured for API Gateway endpoints

## ライブラリの追加方法

- ライブラリの追加はpackage.jsonに直接記述するのではなく、`yarn add`を使用すること
- 本番系のビルドに不要なライブラリは、`yarn add -D`を使用すること
- ライブラリの削除は、`yarn remove`を使用すること
