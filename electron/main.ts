import { app, BrowserWindow, screen, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "fs";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;

// Config file path
const configPath = path.join(app.getPath('userData'), 'config.json');


let win: BrowserWindow | null = null;
let isQuitting = false;
let logoutInProgress = false;

// Config management functions
function getConfig() {
  const raw = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(raw);
}


// function saveConfig(config: any) {
//   fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
// }

function hasConfig() {
  return fs.existsSync(configPath);
}

// API function to fetch backend URLs for user
// async function getBackendUrlsForUser(email: string) {
//   try {
//     // Replace with your actual API endpoint
//     const response = await fetch(`https://api.hotelli.com/user/${encodeURIComponent(email)}`);
//     if (!response.ok) {
//       throw new Error('User not found or API error');
//     }
//     const data = await response.json();

//     // Expected response format:
//     // {
//     //   "authServiceUrl": "https://auth-user123.hotelli.com",
//     //   "customerServiceUrl": "https://customer-user123.hotelli.com", 
//     //   "frontdeskServiceUrl": "https://frontdesk-user123.hotelli.com"
//     // }
//     return {
//       authServiceUrl: data.authServiceUrl,
//       customerServiceUrl: data.customerServiceUrl,
//       frontdeskServiceUrl: data.frontdeskServiceUrl
//     };
//   } catch (error) {
//     console.error('Error fetching backend URLs:', error);
//     throw error;
//   }
// }

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

  // Check if config exists and load appropriate page
  if (hasConfig()) {
    // Config exists, load main app
    if (VITE_DEV_SERVER_URL) {
      win.loadURL(VITE_DEV_SERVER_URL);
    } else {
      win.loadFile(path.join(RENDERER_DIST, "index.html"));
    }
  } else {
    // First run, show setup screen
    if (VITE_DEV_SERVER_URL) {
      win.loadURL(`${VITE_DEV_SERVER_URL}/setup.html`);
    } else {
      // Since setup.html is in root directory (same as index.html)
      win.loadFile(path.join(RENDERER_DIST, "setup.html"));
    }
  }

  // Handle navigation attempts for client-side routing (only for main app)
  if (hasConfig() && !VITE_DEV_SERVER_URL) {
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

// IPC Handlers

// Handle setup completion from setup page
ipcMain.handle('setup-submitted', async (_event, email: string) => {
  try {
    console.log('Setup requested for email:', email);

    // For now, return an error since backend is not implemented
    return {
      success: false,
      error: 'Setup functionality is coming soon! Please create a config.json file manually.'
    };

    // Uncomment this when backend is ready:
    /*
    // Fetch backend URLs from your API
    const backendUrls = await getBackendUrlsForUser(email);
    
    // Save config
    const config = {
      email,
      ...backendUrls,
      setupDate: new Date().toISOString()
    };
    
    saveConfig(config);
    console.log('Config saved successfully');
    
    // Load main app
    if (VITE_DEV_SERVER_URL) {
      win?.loadURL(VITE_DEV_SERVER_URL);
    } else {
      win?.loadFile(path.join(RENDERER_DIST, "index.html"));
    }
    
    return { success: true };
    */
  } catch (error) {
    console.error('Setup failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});

// Handle config requests from renderer
ipcMain.handle('get-config', () => {
  try {
    return getConfig();
  } catch (error) {
    console.error('Error getting config:', error);
    return null;
  }
});

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