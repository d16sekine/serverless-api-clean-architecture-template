# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a serverless framework template for TypeScript Lambda functions on AWS. The project includes:

- **serverless.yml**: Serverless Framework configuration for AWS Lambda deployment
- **TypeScript Configuration**: Full TypeScript setup with type definitions
- **Sample Functions**: Hello world and API proxy handlers in `src/handlers/`
- **Development Tools**: ESLint, Vitest, and offline development support

## Architecture

The project follows a typical serverless structure:

- `src/handlers/` - Lambda function handlers
- `serverless.yml` - AWS resource definitions and function configurations
- Functions are built using the `serverless-esbuild` plugin
- CORS is pre-configured for API Gateway endpoints

- 環境変数は.envで設定。.envは.gitignore対象なので、.env.exmapleも用意する

### Directory Structure

基本的に以下の構造に従ってください。

.
├── README.md
├── package.json
├── yarn.lock
├── src/
├── __tests__/
├── serverless.yml
├── tsconfig.json

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

### Test rules
- テスト用の関数はtest()を使用する

### TypeScript rules
- 型定義はtypeを優先して利用する

## Common Commands

### Development

- `yarn run dev` - Start serverless offline for local development (port 3000)
- `yarn build` - Compile TypeScript to JavaScript
- `yarn test` - Run Vitest tests
- `yarn test:watch` - Run Vitest in watch mode

### Deployment

- `yarn deploy` - Deploy to AWS (default stage: dev)
- `yarn deploy:dev` - Deploy to development stage
- `yarn deploy:prod` - Deploy to production stage
- `yarn remove` - Remove the deployed stack from AWS
- `yarn logs` - View logs for the hello function

### Utility

- `yarn clean` - Remove build artifacts and serverless cache

