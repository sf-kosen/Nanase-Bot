# Nanase-Bot ドキュメント

## 注意
書くのがめんどくさかったのでAIに任せました。<br />
一応内容はほとんどあってますが自由に開発してください。<br />
後たぶんこの方法じゃ非効率なんでファイル構成とか変えてくれる人募集中です。

## 概要 ✅
このリポジトリでは、`src/commands` と `src/handlers` にそれぞれ「スラッシュコマンド」と「ユーザー操作（ボタン / モーダル）」の処理を配置し、`src/index.ts` が実行時にこれらを自動で読み込みます。

---

## 読み込みルール（`src/index.ts` の挙動） 🔧
- 実行ファイルの拡張子から `FILE_TYPE` を判定し、`.ts`（開発）/`.js`（本番）に合わせて読み込むファイル拡張子を決定します。
  - 開発: `src/index.ts` → `FILE_TYPE = ".ts"` → `BASE_DIR = "src"`
  - 本番: `build/src/index.js` → `FILE_TYPE = ".js"` → `BASE_DIR = "build/src"`
- コマンド読込:
  - `${BASE_DIR}/commands` 以下の `FILE_TYPE` 拡張子で終わるファイルを全て `require()` して読み込みます。
  - 読み込んだモジュールは `commands[command.data.name] = command` として登録されます。
- ハンドラ読込:
  - `${BASE_DIR}/handlers` のサブフォルダ（例: `button`, `modal`）を列挙し、各フォルダ内の `FILE_TYPE` で終わるファイルを読み込みます。
  - 各サブフォルダ名が `actions` オブジェクトのキーとなり、`actions[folder][action.data.actionName] = action` と登録されます。

---

## 期待されるファイル構造（例） 📁
```
src/
  commands/
    ping.ts
  handlers/
    button/
      confirm.ts
    modal/
      sampleModal.ts
  types/
    command.ts
    action.ts
dist/  # ビルド後（.js がここに出力される想定）
```

---

## `types`（型）について ✳️
プロジェクト内で使われている主要な型定義は `src/types/command.ts` と `src/types/action.ts` です。主な要点:

- Command:
  - `data.name`, `data.description`, `flags`, `defer`, `options?` を持つ
  - `execute(interaction: CommandInteraction): Promise<void>` を実装
- Action:
  - `data.actionName` を持つ（`button` / `modal` 用に別々の型が定義されています）
  - `execute(interaction): Promise<void>` を実装

型の詳細については `src/types/*.ts` を参照してください。

---

## コード例（テンプレート） ✨
- スラッシュコマンド（`src/commands/ping.ts`）の最小例（互換性のために CommonJS スタイルでエクスポートすることを推奨します）:

```typescript
// src/commands/ping.ts
const data = {
  name: "ping",
  description: "Replies with pong",
  flags: 0,
  defer: false,
};

async function execute(interaction) {
  await interaction.reply("Pong!");
}

module.exports = { data, execute };
```

- ボタンハンドラ（`src/handlers/button/confirm.ts`）の例:

```typescript
// src/handlers/button/confirm.ts
const data = {
  actionName: "confirm",
  defer: false,
};

async function execute(interaction) {
  // ボタン処理
  await interaction.reply({ content: "Confirmed!", ephemeral: true });
}

module.exports = { data, execute };
```

- モーダルハンドラ（`src/handlers/modal/sampleModal.ts`）の例:

```typescript
// src/handlers/modal/sampleModal.ts
const data = {
  actionName: "sample_modal",
  defer: true,
};

async function execute(interaction) {
  const value = interaction.fields.getTextInputValue("input-id");
  // モーダル処理
  await interaction.reply({ content: `You entered: ${value}`, ephemeral: true });
}

module.exports = { data, execute };
```

> 重要: `src/index.ts` は `require()` で読み込んだモジュールのトップレベルに `data` と `execute` があることを期待しています。TypeScript の `export default` を使う場合、コンパイル後に `require()` すると `module.default` に入るケースがあるため、互換性の観点から `module.exports = { ... }`（CommonJS スタイル）を推奨します。

---

## 実行時の注意 📝
- 開発時は `pnpm dev` で `src/index.ts` を実行します。
- 本番では `pnpm build` で `build` を生成し、`node build/src/index.js` を実行します。
- Docker Compose による開発環境は起動時に `pnpm install --frozen-lockfile` を実行するため、ロックファイル変更後も名前付き `node_modules` ボリュームの依存関係が同期されます。

---

## トラブルシューティング 💡
- コマンドが読み込まれない:
  - `commands` フォルダ内のファイルが `FILE_TYPE` と一致しているか確認（`.ts` / `.js`）
  - モジュールのエクスポート方式が `module.exports` になっているか確認
- ハンドラが登録されない:
  - `handlers` のサブフォルダ名（例: `button`）が `actions` のキーとして使われるため、正しいディレクトリ構成か確認

---

必要であれば、既存の `src/commands` や `src/handlers` の中身をもとに、より具体的なテンプレートや lint ルールの提案を書きます。変更してほしい点があれば教えてください。
