# マイリー家計簿!'

Next.js + TypeScriptで実装された、使いやすく機能的な家計簿Webアプリケーションです。日々の支出管理から資産管理まで、シンプルで直感的なインターフェースで家計を管理できます。

## デモ

[デモサイトはこちら](https://calculator-red-nu-42.vercel.app)

## 主な特徴

- 📱 レスポンシブデザインで、スマートフォンからデスクトップまで快適に使用可能
- 📊 直感的なグラフ表示で支出傾向を可視化
- 💳 多様な支払い方法に対応
- 🔒 セキュアな認証システム
- 🌙 ダークモード対応
- 📈 リアルタイムデータ同期

## 技術スタック

### フロントエンド

- **Next.js 14**
  - App Router
  - Server Components
  - Client Components
  - Image Optimization
  - API Routes
- **TypeScript 5.1**
  - 厳格な型チェック
  - 型安全性の確保
- **React 18**
  - Concurrent Features
  - Suspense
  - Server Components
- **TailwindCSS 3.3**
  - ユーティリティファースト
  - カスタムテーマ
  - ダークモード対応

### バックエンド

- **Supabase**
  - PostgreSQL データベース
  - リアルタイムサブスクリプション
  - Row Level Security
  - ストレージ機能
- **Clerk**
  - 認証・認可
  - ユーザー管理
  - セッション管理

### 開発ツール

- **ESLint**
  - コード品質管理
  - コーディング規約の強制
- **Prettier**
  - コードフォーマット
- **TypeScript**
  - 型チェック
  - 開発時の補完機能

### デプロイメント

- **Vercel**
  - 自動デプロイ
  - プレビュー環境
  - エッジネットワーク
- **GitHub Actions**
  - CI/CD
  - 自動テスト
  - デプロイ自動化

### モニタリング

- **Sentry**
  - エラー追跡
  - パフォーマンスモニタリング
  - ユーザーセッション追跡

### データ可視化

- **Chart.js**
  - インタラクティブなグラフ
  - カスタマイズ可能なチャート
  - レスポンシブ対応

## データベース設計

// ... existing database design section ...

## 主要機能

### 1. 家計簿タブ

- 月単位のカレンダー表示
  - 日付ごとの支出一覧
  - カテゴリ別の色分け表示
- 日別詳細入力
  - カテゴリ選択
  - 金額入力
  - メモ機能
- 豊富な費目カテゴリ
  - 基本カテゴリ（食費、交通費、光熱費など）
  - カスタムカテゴリ機能
    - カテゴリの追加
    - カテゴリの編集
    - カテゴリの削除
- 電卓機能
  - 基本計算
  - 税込み価格計算
  - 計算履歴

### 2. 資産タブ

- 収支管理
  - 振替
  - 貯金
  - 支払い
  - 収入
- 多様な支払い方法
  - デビットカード
  - クレジットカード
  - QRコード決済
  - その他各種決済方法
- 口座管理
  - 残高表示
  - 取引履歴
  - 振替機能

### 3. 統計タブ

- データの視覚化
  - 円グラフによる支出分析
  - 期間別集計
  - トレンド分析
- フィルタリング機能
  - 期間指定
  - カテゴリ別表示
  - 金額範囲指定

## 開発環境のセットアップ

```bash
# リポジトリのクローン
git clone [repository-url]

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 環境変数の設定

以下の環境変数を`.env.local`ファイルに設定してください：

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## デプロイ

このプロジェクトはVercelにデプロイされています。mainブランチへのプッシュで自動的にデプロイされます。

## テスト

```bash
# ユニットテストの実行
npm run test

# E2Eテストの実行
npm run test:e2e
```

## コントリビューション

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

MITライセンスの下で公開されています。

## 作者

[黒田]

## 謝辞

### 立川 修平 様  

- YouTube: [@bubecode](https://www.youtube.com/@bubecode)  
- Instagram: [instagram.com/bube.code](https://instagram.com/bube.code)  
- X（旧Twitter）: [@bubekichi](https://x.com/bubekichi)  
- JavaScript学習サイト: [jsgym.shiftb.dev](https://jsgym.shiftb.dev)  
- 運営スクール: [shiftb.dev](https://shiftb.dev)

### Shin 様  

- YouTube: [@programming_tutorial_youtube](https://www.youtube.com/@programming_tutorial_youtube)  
- X（旧Twitter）: [@Shin_Engineer](https://twitter.com/Shin_Engineer)  
- Udemy: [Shin様のUdemyページ](https://www.udemy.com/user/jin-tuo-hai/)
