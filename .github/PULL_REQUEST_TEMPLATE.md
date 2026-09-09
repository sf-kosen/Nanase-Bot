~~~md
各項目の説明欄を削除して内容を記載。
その後この説明ブロックを削除

- Title
  Prefixはgitと同様とし、以下の形式で日本語とする  
  - `chore: xxx`
  - `feat: xxx`  
  - `fix: xxx`
  - `hotfix: xxx`
  - `refactor: xxx`

- Tag  
  最適なものを付与したうえで以下のいずれかを選択する。
  - CIの必要がある: `require-ci`
  - CIの必要がない: `not-require-ci`
~~~

## About this PR

### Why
PRが発生した背景を記載 (以下例)

resolves #<Issue Number>

### What
変更内容を簡潔に記載 (以下例)
- `/ping`コマンドを追加

### How
実装上の工夫や判断理由を記載 (以下例)
- 既存の`CommandHandler`に分岐を増やす案もあったが、拡張性を優先して別クラスに切り出した
