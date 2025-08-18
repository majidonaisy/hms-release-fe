import { app, BrowserWindow, screen, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;

let win: BrowserWindow | null = null;
let isQuitting = false;
let logoutInProgress = false;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width: width,
    height: height,
    show: true,
    autoHideMenuBar: true,
    title: "HMS - Hotel Management System",
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
    },
  });

  win.maximize();

  win.webContents.on("did-finish-load", () => {
    if (win && !win.isDestroyed()) {
      win.webContents.send("main-process-message", new Date().toLocaleString());
    }
  });

  // Add error handling for failed loads
  win.webContents.on('did-fail-load', (_event, _errorCode, errorDescription, validatedURL) => {
    console.log('Failed to load:', validatedURL, errorDescription);
    // Fallback to index.html for client-side routing
    if (!VITE_DEV_SERVER_URL && win && !win.isDestroyed()) {
      win.loadFile(path.join(RENDERER_DIST, "index.html"));
    }
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));

    // Handle navigation attempts for client-side routing
    win.webContents.on('will-navigate', (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);
      if (parsedUrl.protocol === 'file:' && win && !win.isDestroyed()) {
        event.preventDefault();
        win.loadFile(path.join(RENDERER_DIST, "index.html"));
      }
    });
  }

  // Handle window close event
  win.on("close", (event) => {
    if (!isQuitting && !logoutInProgress) {
      event.preventDefault();
      logoutInProgress = true;

      console.log("🔴 Window closing - initiating logout sequence...");

      // Send logout signal to renderer - with null check
      if (win && !win.isDestroyed()) {
        win.webContents.send("app-closing");
      }

      // Set timeout as fallback
      setTimeout(() => {
        console.log("⏰ Logout timeout reached, force quitting...");
        isQuitting = true;
        logoutInProgress = false;
        app.quit();
      }, 8000);
    }
  });

  // Handle window closed
  win.on("closed", () => {
    win = null;
  });
}

// Handle logout completion from renderer
ipcMain.on("logout-complete", () => {
  console.log("✅ Logout completed, quitting app...");
  isQuitting = true;
  logoutInProgress = false;

  if (win && !win.isDestroyed()) {
    win.destroy();
  }
  app.quit();
});

// Handle test message for debugging
ipcMain.on("test-message", () => {
  console.log("📧 Test message received from renderer");
});

// Handle before-quit to trigger window close
app.on("before-quit", (event) => {
  if (!isQuitting && win && !win.isDestroyed()) {
    event.preventDefault();
    // Trigger window close which will handle logout
    win.close();
  }
});

// Standard Electron event handlers
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
