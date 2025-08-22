# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Serverless Framework template for building REST APIs with TypeScript on AWS Lambda. This template provides a foundation for creating scalable, serverless REST API endpoints with the following features:

- **serverless.yml**: Serverless Framework configuration for AWS Lambda deployment and API Gateway setup
- **TypeScript Configuration**: Full TypeScript setup with type definitions for type-safe API development
- **Sample API Endpoints**: Example REST API handlers in `src/handlers/` demonstrating GET/POST patterns
- **Development Tools**: ESLint, Vitest for testing, and serverless-offline for local API development
- **playground**: Next.jsによるAPIの動作とレスポンスを確認できるWebページを用意

## Technical Specifications

### Dependencies

- yarn(パッケージ管理)
- serverless framework (v3)
- serverless-offline (ローカル開発用)
- serverless-esbuild (TypeScriptビルド用)
- esbuild (高速バンドラー)
- vitest (テストフレームワーク)
- eslint (コード品質チェック)
- prettier (コードフォーマッター)
- dotenv (環境変数管理)
- Next.js（APIテスト用Webページ）

### Architecture

The project follows a typical serverless structure:

- `src/handlers/` - Lambda function handlers
- `serverless.yml` - AWS resource definitions and function configurations
- Functions are built using the `serverless-esbuild` plugin
- CORS is pre-configured for API Gateway endpoints

- 環境変数は.envで設定。.envは.gitignore対象なので、.env.exampleも用意する
- Domain driven designとClean Archtectureの思想を参考に、技術依存の部分とビジネスロジックの責務を分離する

### Playground

- Next.jsによるAPIテスト用のWebアプリケーション
- ローカル環境でAPIエンドポイントの動作確認とレスポンスの検証が可能
- serverless-offlineと連携してリアルタイムでのAPIテストを実行
- page routerを利用

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
└── playground/          # APIテスト用Next.jsアプリケーション
    ├── pages/           # ページコンポーネント
    ├── components/      # 共通コンポーネント
    ├── styles/          # スタイル定義
    └── utils/           # ユーティリティ関数
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
- 型定義はtypeを優先して利用する（interfaceは必要な場合のみ）
- 厳密な型付けを行い、anyの使用は避ける
- 非同期処理はasync/awaitを使用する
- エラーハンドリングはtry-catchで明示的に行う

#### Test
- テスト用の関数はtest()を使用する（describe/itではなく）
- テストファイルは`__tests__/`ディレクトリに配置
- ファイル名は`*.test.ts`形式とする
- モックは最小限にし、実際の振る舞いに近いテストを書く

#### Naming Conventions
- ファイル名：ケバブケース（例：user-service.ts）
- クラス名：パスカルケース（例：UserService）
- 関数名・変数名：キャメルケース（例：getUserById）
- 定数：大文字スネークケース（例：MAX_RETRY_COUNT）

### Commit message
- conventional commitsに従う
  - https://www.conventionalcommits.org/ja/v1.0.0/
- プレフィックス例：
  - `feat:` 新機能
  - `fix:` バグ修正
  - `docs:` ドキュメント変更
  - `style:` コードの意味に影響しない変更（空白、フォーマット等）
  - `refactor:` リファクタリング
  - `test:` テストの追加・修正
  - `chore:` ビルドプロセスやツールの変更

## Common Commands

### Development

- `yarn dev` - Start serverless offline for local development (port 3000)
- `yarn build` - Compile TypeScript to JavaScript
- `yarn test` - Run Vitest tests
- `yarn test:watch` - Run Vitest in watch mode

#### Playground Commands

- `yarn playground:dev` - Start playground development server (port 3001)
- `yarn playground:build` - Build playground for production
- `yarn playground:start` - Start production playground server

### Deployment

- `yarn deploy` - Deploy to AWS (default stage: dev)
- `yarn deploy:dev` - Deploy to development stage
- `yarn deploy:prod` - Deploy to production stage
- `yarn remove` - Remove the deployed stack from AWS
- `yarn logs` - View logs for the hello function

### Utility

- `yarn clean` - Remove build artifacts and serverless cache
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Fix auto-fixable linting issues

#### Playground Usage

1. `yarn dev` でServerless APIを起動（port 3000）
2. 別ターミナルで `yarn playground:dev` でPlaygroundを起動（port 3001）
3. http://localhost:3001 でPlaygroundにアクセス
4. APIエンドポイントをテストし、リアルタイムでレスポンスを確認

## Error Handling

### Lambda Functions
- すべてのハンドラーでtry-catchを使用してエラーをキャッチする
- エラーレスポンスは適切なHTTPステータスコードと共に返す
- エラーログは構造化されたフォーマットで出力する

### Response Format
- 成功時：
  ```json
  {
    "statusCode": 200,
    "body": { "data": {...} }
  }
  ```
- エラー時：
  ```json
  {
    "statusCode": 400,
    "body": { "error": "Error message" }
  }
  ```

## Security Best Practices
- 環境変数に機密情報を格納し、コードにハードコードしない
- 入力値の検証を必ず行う
- SQLインジェクション、XSS等の一般的な脆弱性に対する対策を実装
- AWSのIAMロールは最小権限の原則に従って設定

