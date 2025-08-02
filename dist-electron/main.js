import { ipcMain, app, BrowserWindow, screen } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === "development";
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win = null;
let isQuitting = false;
let logoutInProgress = false;
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width,
    height,
    show: true,
    autoHideMenuBar: true,
    title: "HMS - Hotel Management System",
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
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
    if (!isQuitting && !logoutInProgress) {
      event.preventDefault();
      logoutInProgress = true;
      console.log("🔴 Window closing - initiating logout sequence...");
      win == null ? void 0 : win.webContents.send("app-closing");
      setTimeout(() => {
        console.log("⏰ Logout timeout reached, force quitting...");
        isQuitting = true;
        logoutInProgress = false;
        app.quit();
      }, 8e3);
    }
  });
  win.on("closed", () => {
    win = null;
  });
}
ipcMain.on("logout-complete", () => {
  console.log("✅ Logout completed, quitting app...");
  isQuitting = true;
  logoutInProgress = false;
  if (win && !win.isDestroyed()) {
    win.destroy();
  }
  app.quit();
});
ipcMain.on("test-message", () => {
  console.log("📧 Test message received from renderer");
});
app.on("before-quit", (event) => {
  if (!isQuitting && win && !win.isDestroyed()) {
    event.preventDefault();
    win.close();
  }
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    isQuitting = true;
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    isQuitting = false;
    logoutInProgress = false;
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
