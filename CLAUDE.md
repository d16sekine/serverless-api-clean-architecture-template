# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a serverless framework template for TypeScript Lambda functions on AWS. The project includes:

- **serverless.yml**: Serverless Framework configuration for AWS Lambda deployment
- **TypeScript Configuration**: Full TypeScript setup with type definitions
- **Sample Functions**: Hello world and API proxy handlers in `src/handlers/`
- **Development Tools**: ESLint, Vitest, and offline development support

## Development method

### Test-Driven Development (TDD)

- 原則としてテスト駆動開発（TDD）で進める
- 期待される入出力に基づき、まずテストを作成する
- 実装コードは書かず、テストのみを用意する
- テストを実行し、失敗を確認する
- テストが正しいことを確認できた段階でコミットする
- その後、テストをパスさせる実装を進める
- 実装中はテストを変更せず、コードを修正し続ける
- すべてのテストが通過するまで繰り返す

### rules
- テスト用の関数はtest()を使用する

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

### Directory Structure

基本的に以下の構造に従ってください。

.
├── README.md
├── package.json
├── src/
├── __tests__/
├── serverless.yml
├── tsconfig.json


