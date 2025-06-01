#!/bin/bash

echo "🔧 iOS ビルド問題解決スクリプト"
echo "================================"

# 1. DerivedData をクリーンアップ
echo "📁 DerivedData をクリーニング中..."
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# 2. Pod キャッシュをクリア
echo "🧹 CocoaPods キャッシュをクリア中..."
cd ios
pod cache clean --all

# 3. Pods ディレクトリを削除
echo "🗑️  Pods ディレクトリを削除中..."
rm -rf Pods
rm -rf Podfile.lock

# 4. ビルドフォルダをクリーン
echo "🧽 ビルドフォルダをクリーン中..."
rm -rf build

# 5. node_modules を再インストール
echo "📦 node_modules を再インストール中..."
cd ..
rm -rf node_modules
npm install

# 6. iOS 依存関係を再インストール
echo "🔄 iOS 依存関係を再インストール中..."
cd ios
pod install

# 7. Xcode プロジェクトをクリーンビルド
echo "🏗️  Xcode プロジェクトをクリーンビルド中..."
xcodebuild clean -workspace TikTokClone.xcworkspace -scheme TikTokClone

echo "✅ 完了！再度ビルドを試してください。"
echo ""
echo "それでも問題が解決しない場合："
echo "1. Xcode を再起動"
echo "2. Mac を再起動"
echo "3. Xcode の設定をリセット: rm -rf ~/Library/Preferences/com.apple.dt.Xcode.plist"