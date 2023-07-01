import { app, BrowserWindow, autoUpdater, dialog } from "electron";
import path from "path";

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

const REPO_OWNER = "ryusuke410";
const REPO_NAME = "optoid";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// アプリケーションのアップデート
const server = "https://update.electronjs.org";
const feed = `${server}/${REPO_OWNER}/${REPO_NAME}/${process.platform}-${
  process.arch
}/${app.getVersion()}`;

if (app.isPackaged) {
  // パッケージされている（ローカル実行ではない）
  autoUpdater.setFeedURL({
    url: feed,
  });
  autoUpdater.checkForUpdates(); // アップデートを確認する

  // アップデートのダウンロードが完了したとき
  autoUpdater.on("update-downloaded", async () => {
    const returnValue = await dialog.showMessageBox({
      message: "アップデートあり",
      detail: "再起動してインストールできます。",
      buttons: ["再起動", "後で"],
    });
    if (returnValue.response === 0) {
      autoUpdater.quitAndInstall(); // アプリを終了してインストール
    }
  });

  // アップデートがあるとき
  autoUpdater.on("update-available", () => {
    dialog.showMessageBox({
      message: "アップデートがあります",
      buttons: ["OK"],
    });
  });

  // アップデートがないとき
  autoUpdater.on("update-not-available", () => {
    dialog.showMessageBox({
      message: "アップデートはありません",
      buttons: ["OK"],
    });
  });

  // エラーが発生したとき
  autoUpdater.on("error", () => {
    dialog.showMessageBox({
      message: "アップデートエラーが起きました",
      buttons: ["OK"],
    });
  });
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
