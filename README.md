# Singapore Trip Planner (シンガポール旅行しおりアプリ)

シンガポール旅行用の高機能・オフライン対応型スマート旅行しおり Web/PWA アプリケーションです。

## 主な機能
- **スケジュールタイムライン**: 日程別（9/8〜9/10）のアクティビティ・移動時間・滞在時間のタイムライン表示、並び替え、追加・編集・削除機能。
- **Now Playing（現在地・リアルタイム案内）**: シンガポール現地時刻に基づき、現在のアクティビティや次の移動案内、遅延時の自動リスケジュール提案をリアルタイム表示。
- **オフライン対応 & マップ連携**: Leaflet/OpenStreetMap を活用したオフライン地図キャッシュ機能、Google Maps 経路ナビ連携。
- **為替レート・天気ウィジェット**: SGD/JPY 為替計算機およびシンガポールのリアルタイム・時間帯別天気予報。
- **持ち物・チェックリスト**: 旅行準備・必需品チェックリスト。

---

## GitHub Pages への公開手順

本リポジトリは GitHub Actions による GitHub Pages への自動デプロイに対応しています。

1. **GitHub にリポジトリを作成して Push**
2. **GitHub リポジトリ設定**:
   - リポジトリの **Settings** > **Pages** を開きます。
   - **Build and deployment** > **Source** を `GitHub Actions` に設定します。
3. **自動デプロイ**:
   - `main` または `master` ブランチに push されると、`.github/workflows/deploy.yml` が自動起動し、数分で GitHub Pages に公開されます。
   - サブパス（`https://<username>.github.io/<repo-name>/`）およびカスタムドメイン（ルート）の両方に自動対応しています。

---

## ローカル開発手順

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動 (http://localhost:3000)
npm run dev

# 静的エクスポートビルド
npm run build
```
