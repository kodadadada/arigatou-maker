チャンネル登録・スパチャ・メンバー・ジュエルのお礼モーションを作るアプリです。

## ダウンロード

| パソコン | ファイル |
|---|---|
| Mac（Apple シリコン：M1 / M2 / M3 / M4 など） | `arigatou-maker-…-mac-arm64.dmg` |
| Mac（Intel） | `arigatou-maker-…-mac-x64.dmg` |
| Windows | `arigatou-maker-…-win-x64.exe` |

## インストール

**Mac**

このアプリは Apple の署名をしていないため、ダウンロードした `.dmg` をそのまま開くと「**破損しているため開けません**」と出ます（ファイルは壊れていません）。次の手順で入れてください。

1. 「ターミナル」を開き（Spotlight で「ターミナル」と検索）、次の1行を貼り付けて return を押します。ダウンロードした `.dmg` から「インターネットから来た」という印を外すコマンドで、何も表示されなければ成功です
   ```bash
   xattr -d com.apple.quarantine ~/Downloads/arigatou-maker-*-mac-*.dmg
   ```
2. ダウンロードフォルダの `.dmg` を開き、「ArigatouMaker」を「Applications」フォルダにドラッグします
3. 「アプリケーション」フォルダの「ありがとう演出メーカー」（日本語の Mac ではこの名前で表示されます）をダブルクリックして起動します

アプリを「アプリケーション」フォルダに入れたあとで「破損している」と出た場合は、ターミナルで次を実行してから開き直してください。
```bash
xattr -dr com.apple.quarantine /Applications/ArigatouMaker.app
```

**Windows**
1. `.exe` を開きます
2. 「Windows によって PC が保護されました」と出たら、「詳細情報」→「実行」を押してください
3. 画面の案内どおりにインストールすると、スタートメニューとデスクトップに「ありがとう演出メーカー」ができます

## アプリでできること

- 公開ページ（https://kodadadada.github.io/arigatou-maker/ ）と同じように、演出を作って動画（透過 WebM / MP4）や静止画で書き出せます
- わんコメを起動した状態で「わんコメに保存」を押すと、テンプレートと設定がまとめてわんコメに入ります。OBS のブラウザソースに `http://localhost:11180/templates/custom/arigatou-maker/?overlay` を入れると、スパチャなどが届いたときに自動で演出が流れます
- わんコメの「設定 → API」に何も登録しなくても、わんコメにつながります
