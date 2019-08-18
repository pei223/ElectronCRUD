import {
  app,
  BrowserWindow
} from "electron"
import { initDb } from "./db"
import localforage from 'localforage';

// NeDBを使用するために必要
localforage.ready().catch(function() {
  /* so that webpack sees the rejected promise as handled */
});

process.on('uncaughtException', function(err) {
  app.quit();
});

function createWindow() {
  let win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 900,
    height: 700,
  });
  win.loadURL(`file://${__dirname}/../index.html`);
  win.on("close", () => {
    win = null;
  });
}

app.on("ready", () => {
  initDb()
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", (_e, hasVisibleWindows) => {
  if (!hasVisibleWindows) {
    createWindow();
  }
});