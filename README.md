## 初期開発メモ

### setup

```bash
npm ci
```

### ビルド

PR を作成すると、テストの目的でビルドが試行されます。

### リリース

master に push をすると、ドラフトのリリースが生成されます。
GitHub 上でドラフトをリリースしてください。

具体的には以下のフローに従います。

packages/optoid-desktop/package.json のバージョンを更新します。

```
"version": "x.x.x",
```

master に向けて PR を作成し、ビルドを確認します。

merge します。

ドラフトをリリースします。

参考にしたもの

- https://github.com/getsentry/sentry/blob/2ebe01feab863d89aa7564e6d243b6d80c230ddc/.github/file-filters.yml

### MacOS でローカルからリリースするための setup

!!! リリースは基本的に GitHub Actions で実行することを想定しています !!!

```bash
brew install gh
```

For building Windows installer on MacOS, install wine mono.

```bash
# install wine
# https://github.com/Squirrel/Squirrel.Windows/issues/1605#issuecomment-1101862417
brew uninstall --cask xquartz || true
brew uninstall --cask wine-stable || true
brew tap gcenx/wine
brew install --cask --no-quarantine wine-crossover

brew install mono
```

Append the following to bash_profile, etc...

```bash:xxx_profile
export MONO_GAC_PREFIX="/usr/local"
```

```bash
export MONO_GAC_PREFIX="/usr/local"
```

### リリース (ローカルで実行する場合)

!!! リリースは基本的に GitHub Actions で実行することを想定しています !!!

packages/optoid-desktop/package.json のバージョンを更新する。

```
"version": "x.x.x",
```

publish する。

```bash
(export GITHUB_TOKEN="$(gh auth token)" && npm -w packages/optoid-desktop run publish -- --platform=darwin)
(export GITHUB_TOKEN="$(gh auth token)" && npm -w packages/optoid-desktop run publish -- --platform=win32)
```

GitHub 上に draft ができているので、 publish する。

なお、[ここ](https://github.com/erikhofer/electron-publish-example/tree/main) を参考に構築した。
同じバージョンで複数のアーキテクチャを順番に publish すれば、1 つのリリースにまとまるらしい。（まじかよ。）

### ユーザー固有データ

- `c:\ProgramData\OpTaliX`
  - `default` <- load on start (& reload on restart)
  - `optix.cfg`
  - `coatp.asc`
  - `osp priv.dat`

`default` に関しては仕様の記述なし。

### チュートリアルを読んでみる

- レンズの設計ファイル `.otx` を編集するのがメイン機能らしい。
- 他にもファイルの種類は色々ある。

まずは、レンズの曲率や距離を設定することを目標にする。

### memo

https://ui-schema.bemit.codes/examples
https://github.com/StefanTerdell/zod-to-json-schema#readme
https://tech.fusic.co.jp/posts/2023-05-22-electron-forge-react-vite-typescript-desktop-app-setup/
https://qiita.com/allJokin/items/76cd3f2627d1497d0a76#%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0%E3%81%AE%E8%A8%AD%E5%AE%9A

## vender

https://github.com/jeanbmar/black-moon-rewind/tree/master/packages/np-bundle
