import {
  app,
  BrowserWindow
} from "electron"
import { initDb } from "./db"


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
  win.loadURL(`file://${__dirname}/../index.html`);  // For release
  // win.loadURL(`file://${__dirname}/../../src/index.html`);
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