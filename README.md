# ツリーデータ構造 シミュレーター

React 18とTypeScriptで構築されたツリーデータ構造の可視化アプリケーションです。

## デモプレイ
https://yunbow.github.io/react-sim-data-tree/demo/

## 主要機能

### 1. ツリーアルゴリズム
- **対応アルゴリズム**
  - 二分探索木 (BST)
  - AVL木
  - 赤黒木
  - Min-Heap
  - Max-Heap

### 2. 操作機能
- **挿入 (Insert)**
  - 任意の値をツリーに挿入
  - ステップごとに可視化

- **削除 (Delete)**
  - 指定した値をツリーから削除
  - 3つのケース（葉、子1つ、子2つ）を正しく処理

### 3. コントロール機能
- アルゴリズム選択
- 初期ノード数設定 (1-20)
- アニメーション速度調整
- リセット機能

## 技術スタック
- **React 18** - UIライブラリ
- **TypeScript** - プログラミング言語
- **Storybook 7** - コンポーネント開発・ドキュメント
- **CSS Modules** - スタイリング
- **Vite** - ビルドツール

## プロジェクト構造

```
src/
├── features/                        # 機能別モジュール
│   └── tree/                        # ツリー機能
│       ├── algorithms/              # ツリーアルゴリズム実装
│       │   ├── bst.ts              # 二分探索木
│       │   └── index.ts
│       ├── components/              # 機能専用コンポーネント
│       │   ├── TreeCanvas/          # ツリー可視化
│       │   ├── TreeControls/        # コントロール
│       │   └── TreeStats/           # 統計表示
│       ├── hooks/                   # カスタムフック
│       │   └── useTreeSimulator.ts
│       ├── utils/                   # ユーティリティ
│       │   └── treeLayout.ts        # レイアウト計算
│       └── TreeSimulator/           # メインコンポーネント
├── components/                      # 共通UIコンポーネント
│   ├── Button/                      # ボタン
│   ├── Select/                      # セレクトボックス
│   ├── Slider/                      # スライダー
│   └── Input/                       # テキスト入力
├── types/                           # 汎用的な型定義
│   └── index.ts
├── App.tsx                          # メインアプリ
├── main.tsx                         # エントリーポイント
└── theme.css                        # テーマカラー定義
```

## セットアップ

```bash
# インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview

# Storybook起動
npm run storybook

# Storybook ビルド
npm run build-storybook
```

## ライセンス

MIT License
