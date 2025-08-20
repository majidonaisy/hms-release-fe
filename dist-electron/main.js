import { app, ipcMain, BrowserWindow, screen } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "fs";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
const configPath = path.join(app.getPath("userData"), "config.json");
let win = null;
let isQuitting = false;
let logoutInProgress = false;
function getConfig() {
  const raw = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(raw);
}
function hasConfig() {
  return fs.existsSync(configPath);
}
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
      devTools: true
    }
  });
  win.maximize();
  win.webContents.on("did-finish-load", () => {
    if (win && !win.isDestroyed()) {
      win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
    }
  });
  win.webContents.on("did-fail-load", (_event, _errorCode, errorDescription, validatedURL) => {
    console.log("Failed to load:", validatedURL, errorDescription);
    if (!VITE_DEV_SERVER_URL && win && !win.isDestroyed()) {
      win.loadFile(path.join(RENDERER_DIST, "index.html"));
    }
  });
  if (hasConfig()) {
    if (VITE_DEV_SERVER_URL) {
      win.loadURL(VITE_DEV_SERVER_URL);
    } else {
      win.loadFile(path.join(RENDERER_DIST, "index.html"));
    }
  } else {
    if (VITE_DEV_SERVER_URL) {
      win.loadURL(`${VITE_DEV_SERVER_URL}/setup.html`);
    } else {
      win.loadFile(path.join(RENDERER_DIST, "setup.html"));
    }
  }
  if (hasConfig() && !VITE_DEV_SERVER_URL) {
    win.webContents.on("will-navigate", (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);
      if (parsedUrl.protocol === "file:" && win && !win.isDestroyed()) {
        event.preventDefault();
        win.loadFile(path.join(RENDERER_DIST, "index.html"));
      }
    });
  }
  win.on("close", (event) => {
    if (!isQuitting && !logoutInProgress) {
      event.preventDefault();
      logoutInProgress = true;
      console.log("🔴 Window closing - initiating logout sequence...");
      if (win && !win.isDestroyed()) {
        win.webContents.send("app-closing");
      }
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
ipcMain.handle("setup-submitted", async (_event, email) => {
  try {
    console.log("Setup requested for email:", email);
    return {
      success: false,
      error: "Setup functionality is coming soon! Please create a config.json file manually."
    };
  } catch (error) {
    console.error("Setup failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
});
ipcMain.handle("get-config", () => {
  try {
    return getConfig();
  } catch (error) {
    console.error("Error getting config:", error);
    return null;
  }
});
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
