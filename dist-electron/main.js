import { app, ipcMain, BrowserWindow, screen } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === "development";
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
let isQuitting = false;
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width,
    height,
    show: true,
    autoHideMenuBar: true,
    title: "HMS - Hotal Management System",
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      // Changed to false for better security
      contextIsolation: true,
      // Changed to true to enable contextBridge
      devTools: isDev
    }
  });
  win.maximize();
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  win.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      win == null ? void 0 : win.webContents.send("app-closing");
      isQuitting = true;
      setTimeout(() => {
        app.quit();
      }, 3e3);
    }
  });
}
app.on("before-quit", (event) => {
  if (win && !win.isDestroyed() && !isQuitting) {
    event.preventDefault();
    isQuitting = true;
    win.webContents.send("app-closing");
    setTimeout(() => {
      app.quit();
    }, 2e3);
  }
});
ipcMain.on("logout-complete", () => {
  console.log("Logout complete, quitting app...");
  app.quit();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    isQuitting = true;
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    isQuitting = false;
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
