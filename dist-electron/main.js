import { ipcMain as l, app as t, BrowserWindow as a, screen as m } from "electron";
import { fileURLToPath as f } from "node:url";
import o from "node:path";
const c = o.dirname(f(import.meta.url));
process.env.APP_ROOT = o.join(c, "..");
const r = process.env.VITE_DEV_SERVER_URL, v = o.join(process.env.APP_ROOT, "dist-electron"), d = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = r ? o.join(process.env.APP_ROOT, "public") : d;
let e = null, n = !1, s = !1;
function u() {
  const { width: i, height: p } = m.getPrimaryDisplay().workAreaSize;
  e = new a({
    width: i,
    height: p,
    show: !0,
    autoHideMenuBar: !0,
    title: "HMS - Hotel Management System",
    icon: o.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: o.join(c, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      devTools: !0
    }
  }), e.maximize(), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), r ? e.loadURL(r) : e.loadFile(o.join(d, "index.html")), e.on("close", (g) => {
    !n && !s && (g.preventDefault(), s = !0, console.log("🔴 Window closing - initiating logout sequence..."), e == null || e.webContents.send("app-closing"), setTimeout(() => {
      console.log("⏰ Logout timeout reached, force quitting..."), n = !0, s = !1, t.quit();
    }, 8e3));
  }), e.on("closed", () => {
    e = null;
  });
}
l.on("logout-complete", () => {
  console.log("✅ Logout completed, quitting app..."), n = !0, s = !1, e && !e.isDestroyed() && e.destroy(), t.quit();
});
l.on("test-message", () => {
  console.log("📧 Test message received from renderer");
});
t.on("before-quit", (i) => {
  !n && e && !e.isDestroyed() && (i.preventDefault(), e.close());
});
t.on("window-all-closed", () => {
  process.platform !== "darwin" && (n = !0, t.quit());
});
t.on("activate", () => {
  a.getAllWindows().length === 0 && (n = !1, s = !1, u());
});
t.whenReady().then(u);
export {
  v as MAIN_DIST,
  d as RENDERER_DIST,
  r as VITE_DEV_SERVER_URL
};
