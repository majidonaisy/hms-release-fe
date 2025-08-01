import { app, BrowserWindow, screen, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === "development";

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;

let win: BrowserWindow | null;
let isQuitting = false;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width: width,
    height: height,
    show: true,
    autoHideMenuBar: true,
    title: "HMS - Hotal Management System",
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false, // Changed to false for better security
      contextIsolation: true, // Changed to true to enable contextBridge
      devTools: isDev,
    },
  });
  win.maximize();

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  // Handle window close event
  win.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();

      // Send logout signal to renderer
      win?.webContents.send("app-closing");

      // Set a flag to prevent multiple close attempts
      isQuitting = true;

      // Force quit after timeout
      setTimeout(() => {
        app.quit();
      }, 3000);
    }
  });
}

// Add this before the existing app event handlers
app.on("before-quit", (event) => {
  if (win && !win.isDestroyed() && !isQuitting) {
    event.preventDefault(); // Prevent immediate quit
    isQuitting = true;

    // Send logout signal to renderer
    win.webContents.send("app-closing");

    // Give time for logout to complete, then quit
    setTimeout(() => {
      app.quit();
    }, 2000); // 2 seconds should be enough for logout API call
  }
});

// Handle logout completion from renderer
ipcMain.on("logout-complete", () => {
  console.log("Logout complete, quitting app...");
  app.quit();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    isQuitting = true;
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    isQuitting = false; // Reset the flag when reactivating
    createWindow();
  }
});

app.whenReady().then(createWindow);
