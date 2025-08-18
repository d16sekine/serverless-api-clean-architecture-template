# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Serverless Framework template for building REST APIs with TypeScript on AWS Lambda. This template provides a foundation for creating scalable, serverless REST API endpoints with the following features:

- **serverless.yml**: Serverless Framework configuration for AWS Lambda deployment and API Gateway setup
- **TypeScript Configuration**: Full TypeScript setup with type definitions for type-safe API development
- **Sample API Endpoints**: Example REST API handlers in `src/handlers/` demonstrating GET/POST patterns
- **Development Tools**: ESLint, Vitest for testing, and serverless-offline for local API development

## Technical Specifications

### Dependencies

- servereless framework
- serverless-offline
- serverless-esbuild
- esbuild
- vitest
- eslint
- prettier

### Architecture

The project follows a typical serverless structure:

- `src/handlers/` - Lambda function handlers
- `serverless.yml` - AWS resource definitions and function configurations
- Functions are built using the `serverless-esbuild` plugin
- CORS is pre-configured for API Gateway endpoints

- 環境変数は.envで設定。.envは.gitignore対象なので、.env.exampleも用意する
- Domain driven designとClean Archtectureの思想を参考に、技術依存の部分とビジネスロジックの責務を分離する

## Directory Structure

基本的に以下の構造に従ってください。

```
.
├── README.md
├── package.json
├── yarn.lock
├── serverless.yml
├── tsconfig.json
├── __tests__/
└── src/
    ├── domain/           # ビジネスロジック（技術非依存）
    │   ├── entities/     # ドメインエンティティ
    │   └── services/     # ドメインサービス
    ├── usecases/         # アプリケーションのユースケース
    │   └── ports/        # リポジトリインターフェース
    ├── repositories/     # リポジトリの具体的な実装
    ├── infrastructure/   # 技術依存の実装
    └── handlers/         # Lambda関数のエントリーポイント
        └── types/        # ハンドラー用の型定義
```


## Development Guidelines

### Development method: Test-Driven Development (TDD)

- 原則としてテスト駆動開発（TDD）で進める
- 期待される入出力に基づき、まずテストを作成する
- 実装コードは書かず、テストのみを用意する
- テストを実行し、失敗を確認する
- テストが正しいことを確認できた段階でコミットする
- その後、テストをパスさせる実装を進める
- 実装中はテストを変更せず、コードを修正し続ける
- すべてのテストが通過するまで繰り返す
- lintを実行する。エラーが発生する場合は修正し、lintが通ることを確認する

### Coding Conventions

#### TypeScript
- 型定義はtypeを優先して利用する

#### Test
- テスト用の関数はtest()を使用する

### Commit message
- conventional commitsに従う
  - https://www.conventionalcommits.org/ja/v1.0.0/

## Common Commands

### Development

- `yarn dev` - Start serverless offline for local development (port 3000)
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

