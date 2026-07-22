---
title: 'Serverless Framework 有料化後の選択肢 osls × クリーンアーキテクチャで作るTypeScriptサーバーレスAPI入門'
emoji: '🧅'
type: 'tech'
topics:
  [
    'serverless',
    'typescript',
    'awslambda',
    'cleanarchitecture',
    'osls',
  ]
published: false
---

> この記事は本テンプレートリポジトリに同梱された**下書き**です。公開前に、ご自身の環境・スクリーンショット・リンクに合わせて調整してください。

## この記事で作るもの

TypeScript + AWS Lambda で、**クリーンアーキテクチャ**に沿った REST API（Todo の CRUD）を作ります。
ポイントは 2 つです。

1. **有料化した Serverless Framework v4 ではなく、OSS の `osls` を使う**
2. **Lambda ハンドラーにロジックを直書きせず、層を分けて「差し替え可能・テスト可能」にする**

完成品はこちら（テンプレートリポジトリ）から `Use this template` で始められます。

---

## なぜ `osls`？ — Serverless Framework を取り巻く 2025〜2026 の状況

サーバーレス開発の定番だった **Serverless Framework** は、ここ数年で大きく変わりました。

- **v3 は 2024/12/31 で保守終了（EOL）**。以降、セキュリティ修正・バグ修正・新機能は提供されません。
- **v4 は有料ライセンスへ移行**。年商 200 万ドルを超える組織は有料サブスクリプションが必要になり、
  ライセンスも MIT から独自ライセンスへ変わりました（個人・小規模は引き続き無料）。

「無料で気軽に使える OSS」だった頃と前提が変わったため、コミュニティは v3 を引き継ぐフォークを作りました。
それが **[osls（Open-Source Serverless）](https://github.com/oss-serverless/osls)** です。

- **MIT ライセンス**のまま、v3 互換のドロップイン後継
- `serverless` / `sls` / `osls` のコマンドを提供（既存の書き方がそのまま使える）
- Dashboard など企業向け機能を削ぎ落とし、**軽量・高速**
- Bref コミュニティが保守

つまり「今から新規で Serverless Framework 系のテンプレートを OSS 公開するなら、v3 EOL / v4 有料化を避けて `osls` を土台にするのが自然」という判断です。

### 移行はほぼ 1 行

既存の v3 プロジェクトからの移行は簡単でした。

```diff
  // package.json
- "serverless": "^3.33.0",
+ "osls": "^4.0.0",
```

```diff
  # serverless.yml
- frameworkVersion: '3'
+ frameworkVersion: '4'
```

`serverless-esbuild` / `serverless-offline` などのプラグインもそのまま動きます。

---

## 設計方針：クリーンアーキテクチャで「関心」を分ける

Lambda は 1 ファイルに何でも書けてしまいますが、それだと業務ルールと技術詳細が混ざり、
テストも差し替えも難しくなります。そこで層を分けます。

```
handlers  → usecases → domain      （依存は常に内側の domain へ向かう）
              ↓  ports(interface)
repositories / infrastructure が ports を実装する
```

- **domain**：ビジネスルール（「title は必須」など）。技術に依存しない
- **usecases**：操作の手順（「Todo を作成する」）
- **ports**：usecases が求める抽象（リポジトリや時計の interface）
- **repositories / infrastructure**：port の具体実装（インメモリ / UUID / 時計）
- **handlers**：HTTP の入口。入出力変換とエラー→ステータス変換

---

## 実装のハイライト

### domain：純粋で決定的なエンティティ

`id` や現在時刻を**引数で受け取る**のがコツです。こうすると domain は副作用がなく、テストが決定的になります。

```ts
// src/domain/entities/todo.ts
export const createTodo = (
  input: CreateTodoInput
): Todo => {
  const title = input.title.trim()
  if (title.length === 0)
    throw new ValidationError('title は必須です')
  if (title.length > 100)
    throw new ValidationError(
      'title は 100 文字以内で入力してください'
    )
  return {
    id: input.id,
    title,
    completed: false,
    createdAt: input.createdAt,
  }
}
```

### usecases：ポートにだけ依存する

`CreateTodoUseCase` は「保存先が何か」「UUID をどう作るか」を知りません。すべて port 越しです。

```ts
// src/usecases/create-todo.ts
export class CreateTodoUseCase {
  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly idProvider: IdProvider,
    private readonly clock: Clock
  ) {}

  async execute(command: CreateTodoCommand): Promise<Todo> {
    const todo = createTodo({
      id: this.idProvider.generate(),
      title: command.title,
      createdAt: this.clock.now(),
    })
    await this.todoRepository.save(todo)
    return todo
  }
}
```

### テスト：AWS もDBも起動せずに書ける

port のおかげで、フェイクを注入するだけで単体テストできます。

```ts
const fakeIdProvider = (v: string): IdProvider => ({
  generate: () => v,
})
const fakeClock = (v: string): Clock => ({ now: () => v })

const useCase = new CreateTodoUseCase(
  repo,
  fakeIdProvider('id-1'),
  fakeClock('2026-01-01T00:00:00.000Z')
)
const todo = await useCase.execute({ title: 'タスク' })
expect(todo.id).toBe('id-1')
```

### handlers：エラーを HTTP ステータスへ変換する

ドメインのエラーを、handler 層で HTTP の言葉に翻訳します。

```ts
// src/handlers/http.ts
export const toErrorResponse = (
  error: unknown
): APIGatewayProxyResult => {
  if (error instanceof ValidationError)
    return jsonResponse(400, { error: error.message })
  if (error instanceof TodoNotFoundError)
    return jsonResponse(404, { error: error.message })
  console.error('Unexpected error:', error)
  return jsonResponse(500, {
    error: 'Internal Server Error',
  })
}
```

---

## ローカルで動かす

```bash
yarn install
yarn dev   # serverless offline がポート 3000 で起動
```

別ターミナルから叩いてみます。

```bash
# 作成
curl -X POST http://localhost:3000/dev/todos -H 'Content-Type: application/json' -d '{"title":"牛乳を買う"}'
# => 201 {"id":"...","title":"牛乳を買う","completed":false,"createdAt":"..."}

# 一覧
curl http://localhost:3000/dev/todos

# 完了にする
curl -X PATCH http://localhost:3000/dev/todos/<id>/complete
```

### なぜ Todo は「単一 Lambda」なのか

インメモリ実装はプロセス内にしか状態を持ちません。関数を 4 つに分けると、
esbuild が関数ごとに別バンドルを生成するため状態が共有されず、「作ったのに一覧が空」になります。

そこで Todo の 4 ルートを **1 つの Lambda（lambdalith）+ 内部ルーター**にまとめ、状態を共有させています。
本番で複数インスタンスにスケールする場合は、`TodoRepository` を DynamoDB 実装に差し替えます
（domain / usecases は無変更）。**この差し替えやすさこそがクリーンアーキテクチャの価値**です。

---

## まとめ

- Serverless Framework は **v3 EOL / v4 有料化**。OSS を貫くなら **`osls`** が有力な選択肢
- Lambda でも**層を分ける**と、テスト容易性・差し替え可能性・保守性が大きく上がる
- 「id や時刻を注入する」「リポジトリを interface にする」だけで、テストが決定的になり、本番の永続化も後から差し替えられる

小さく始めて、必要になったら外周（infrastructure / repositories）だけを育てていけます。

## 参考リンク

- [osls（Open-Source Serverless）](https://github.com/oss-serverless/osls)
- [Serverless Framework V4: A New Model（公式ブログ）](https://www.serverless.com/blog/serverless-framework-v4-a-new-model)
- [What's next with the Serverless Framework in 2025?（DEV Community）](https://dev.to/aws-heroes/whats-next-with-the-serverless-framework-in-2025-121d)
- [The Clean Architecture（Robert C. Martin）](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
