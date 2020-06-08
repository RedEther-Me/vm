import { app, BrowserWindow, ipcMain } from "electron";
import { fork } from "child_process";
import path from "path";
import isDev from "electron-is-dev";

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

const child = fork(path.join(__dirname, "child-setup.js"), ["args"], {
  stdio: ["pipe", "pipe", "pipe", "ipc"],
});

child.stdout.on("data", (d) => {
  console.log("[stdout-main-fork] " + d.toString());
});

child.stderr.on("data", (d) => {
  console.log("[stderr-main-fork] " + d.toString());
});

child.on("message", (m) => mainWindow.webContents.send("message", m));

ipcMain.on("message", (event, data) => {
  child.send(data);
});
