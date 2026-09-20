# 貢献者ガイドライン

## はじめに

Nanase-Bot に興味を持っていただきありがとうございます。
私たちは、バグ修正、新機能の提案、ドキュメントの改善など、さまざまな形での貢献を歓迎します。

このガイドラインでは、初めて参加する方でも開発の流れが分かるように、Issue の作成から Pull Request の提出までの基本的な手順を説明します。

> [!NOTE]
> 本ドキュメントは [VOICEVOX の貢献者ガイドライン](https://github.com/VOICEVOX/voicevox/blob/main/CONTRIBUTING.md) を参考に作成しています。

## AI使用について
AI使用については、[こちら](./LLM-USAGE-POLICY.md)に記述しています。

こちらを参照してください。

## 担当

|:役割|:担当|
|-|-|
| プロダクトオーナー   | [Sora (@sora81dev)](https://github.com/sora81dev)、[Tanahiro (@tanahiro2010)](https://github.com/tanahiro2010) |
| メンテナー・レビュアー | [Keisuke Ishii (@Akikukeo1)](https://github.com/Akikukeo1) |                                                   |

## 参加の心得

Nanase-Bot は複数人で開発しているオープンソースプロジェクトです。

貢献する際は、次の点に注意してください。

* 大きな仕様変更や新機能を実装する場合は、実装を始める前に Issue で提案・相談してください。
* 既存の Issue に取り組む場合は、作業が重複しないよう、着手することを Issue 上で共有してください。
* レビューでは変更を求められることがあります。疑問や異なる意見がある場合は、その理由を説明したうえで議論してください。
* 変更は、可能な範囲で目的ごとに小さな Pull Request に分けてください。
* API キー、Discord Bot Token、Webhook URL などの秘密情報をコミットしないでください。
* 他者の著作物やコードを利用する場合は、そのライセンスを確認してください。
* このリポジトリのライセンスについては [`LICENSE`](./LICENSE) を確認してください。

## 開発環境

### 必要なもの

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) 24
* [pnpm](https://pnpm.io/) 11

Node.js のバージョンは [`.node-version`](./.node-version)、pnpm のバージョンは [`package.json`](./package.json) で管理されています。

### 1. リポジトリをフォークする

GitHub 上で Nanase-Bot をフォークしてください。

https://github.com/sf-kosen/Nanase-Bot/fork

### 2. リポジトリをクローンする

```bash
git clone https://github.com/<GitHubユーザー名>/Nanase-Bot.git
cd Nanase-Bot
```

必要に応じて、本家リポジトリを `upstream` として登録してください。

```bash
git remote add upstream https://github.com/sf-kosen/Nanase-Bot.git
```

### 3. 依存関係をインストールする

Corepack を有効化します。

```bash
corepack enable
```

その後、依存関係をインストールします。

```bash
pnpm install --frozen-lockfile
```

### 4. 環境変数を設定する

`.env.example` をコピーして `.env` を作成します。

```bash
cp .env.example .env
```

Windows PowerShell の場合は次のように実行できます。

```powershell
Copy-Item .env.example .env
```

`.env` 内に、開発環境で使用する Discord Bot Token などを設定してください。

> [!CAUTION]
> `.env` に含まれる Token や Webhook URL などの秘密情報は、Git にコミットしないでください。

### 5. 開発環境を起動する

```bash
pnpm dev
```

## プロジェクトへの貢献手順

### 1. 提案と相談

次のような変更を行いたい場合は、まず Issue を作成してください。

* 新しい機能を追加したい
* 既存の仕様を変更したい
* バグを発見した
* 大きなリファクタリングを行いたい

Issue では、可能な範囲で次の内容を説明してください。

* 現在どのような問題があるか
* どのように変更したいか
* 変更によってどのような利点があるか
* 既存機能への影響が考えられるか

小さな誤字修正や明らかな不具合修正など、事前の議論が不要な変更については、直接 Pull Request を作成しても構いません。

### 2. 着手する

既存の Issue に取り組む場合は、他の人との作業重複を避けるため、Issue 上で着手することを共有してください。

実装方針に不明点がある場合は、実装を進める前に Issue などで相談してください。

### 3. ブランチを作成する

`main` から作業用ブランチを作成します。

```bash
git switch main
git pull upstream main
git switch -c <ブランチ名>
```

ブランチ名は、変更内容が分かる簡潔な名前にしてください。

例:

```text
feat/add-example-command
fix/reaction-role
docs/update-contributing
```

### 4. 実装する

既存コードとの一貫性を保ちながら実装してください。

このプロジェクトでは、コードのフォーマットと静的解析に [Biome](https://biomejs.dev/) を使用しています。

特に次の点を意識してください。

* 変数名・関数名から役割が分かるようにする
* 不必要に複雑な実装を避ける
* `any` の使用は可能な範囲で避ける
* 既存コードと同じ設計・命名規則を優先する
* 今回の変更と無関係なコードを同時に変更しない
* 大規模なリファクタリングと機能追加を可能な限り同じ Pull Request に含めない

## Pull Request 前の確認

Pull Request を作成する前に、変更内容を確認してください。

### フォーマット・Lint

```bash
pnpm check
```

自動修正可能な問題については、次のコマンドを使用できます。

```bash
pnpm fix
```

### 型チェック

```bash
pnpm typecheck
```

### ビルド

```bash
pnpm build
```

可能であれば、変更した機能について実際に Bot を起動し、期待通り動作することも確認してください。

## Pull Request の作成

実装と確認が完了したら、自分のフォークへ変更を push します。

```bash
git push -u origin <ブランチ名>
```

その後、GitHub から `main` に対する Pull Request を作成してください。

Pull Request には、少なくとも次の情報を記載してください。

* 何を変更したか
* 関連する Issue
* 必要に応じて動作確認方法や補足事項

関連 Issue がある場合は、次のように記載できます。

```text
ref #84
```

Pull Request のマージと同時に Issue を閉じたい場合は、次のように記載できます。

```text
close #84
```

実装途中で意見を求めたい場合や、方針を確認したい場合は Draft Pull Request を利用してください。

## コードレビュー

Pull Request が作成されると、メンテナーや他の開発者によるレビューが行われます。

レビューで修正依頼や質問があった場合は、内容を確認して対応してください。

レビューコメントに疑問がある場合や、別の実装方法が適切だと考える場合は、その理由を説明して議論してください。レビューコメントに必ずそのまま従う必要があるわけではありません。

修正したコードを同じブランチへ push すると、Pull Request に自動的に反映されます。

```bash
git push
```

## Pull Request の大きさ

レビューをしやすくするため、Pull Request は可能な限り1つの目的に絞ってください。

例えば、

* ライブラリの更新
* フォーマット変更
* リファクタリング
* 新機能追加

を同時に行うのではなく、それぞれ別の Pull Request に分割することを推奨します。

変更を小さく保つことで、

* レビューが容易になる
* 問題が発生した場合に原因を特定しやすくなる
* 他の Pull Request との競合を減らせる
* 変更履歴を追いやすくなる

といった利点があります。

## コンフリクトが発生した場合

作業中に `main` が更新され、自分の変更と競合する場合があります。

必要に応じて最新の `main` を取得し、作業ブランチへ反映してください。

```bash
git fetch upstream
git rebase upstream/main
```

コンフリクトを解消した後は、再度

```bash
pnpm check
pnpm typecheck
pnpm build
```

を実行し、問題がないことを確認してください。

すでに Pull Request へ push 済みのブランチを rebase した場合は、履歴を書き換えるため push 方法に注意してください。

```bash
git push --force-with-lease
```

`--force` よりも `--force-with-lease` の使用を推奨します。

## その他

分からないことや判断に迷うことがあれば、Issue や Pull Request で気軽に相談してください。

途中で作業を継続できなくなった場合も問題ありません。
他の開発者が引き継げるよう、Issue などで現在の状況を共有してください。

Nanase-Bot への貢献をお待ちしています。
