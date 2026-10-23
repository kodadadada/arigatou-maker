// Mac / Windows 用アプリ（Electron）の本体。中身は公開ページと同じ index.html をそのまま開く
const { app, BrowserWindow, ipcMain, session, shell } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const ONECOMME_PORT = 11180;
const TEMPLATE_NAME = 'arigatou-maker';

function createWindow() {
  const win = new BrowserWindow({
    width: 1320,
    height: 900,
    minWidth: 420,
    minHeight: 500,
    title: 'ありがとう演出メーカー',
    backgroundColor: '#fff6fa',
    icon: path.join(ROOT, 'icons', 'icon-512.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  // 「わんコメから開く」などのリンクはふだんのブラウザで開く
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.loadFile(path.join(ROOT, 'index.html'));
}

// わんコメは知らない Origin からの接続を断るので、わんコメ宛ての WebSocket だけ localhost から来たことにする
function allowOneComme() {
  const urls = [`ws://localhost:${ONECOMME_PORT}/*`, `ws://127.0.0.1:${ONECOMME_PORT}/*`];
  session.defaultSession.webRequest.onBeforeSendHeaders({ urls }, (details, callback) => {
    details.requestHeaders.Origin = `http://localhost:${ONECOMME_PORT}`;
    callback({ requestHeaders: details.requestHeaders });
  });
}

// わんコメのテンプレートフォルダ。起動中のわんコメに聞き、だめなら OS ごとの決まった場所
async function templateRoot() {
  try {
    const res = await fetch(`http://localhost:${ONECOMME_PORT}/api/info`, { signal: AbortSignal.timeout(2000) });
    const info = await res.json();
    if (info.templatePath) return info.templatePath;
  } catch (e) { /* わんコメが起動していない */ }
  return path.join(app.getPath('appData'), 'onecomme', 'templates');
}

// 「設定を保存」：テンプレート（index.html・template.json）と settings.json をまとめてわんコメに入れる
ipcMain.handle('save-onecomme', async (_e, json) => {
  if (typeof json !== 'string' || json.length > 60 * 1024 * 1024) throw new Error('bad settings');
  if (JSON.parse(json).app !== 'arigatou-maker') throw new Error('bad settings');
  const root = await templateRoot();
  try { await fs.access(root); } catch (e) { return { ok: false, reason: 'no-onecomme', root }; }
  const dir = path.join(root, 'custom', TEMPLATE_NAME);
  await fs.mkdir(dir, { recursive: true });
  await fs.copyFile(path.join(ROOT, 'index.html'), path.join(dir, 'index.html'));
  await fs.copyFile(path.join(ROOT, 'template.json'), path.join(dir, 'template.json'));
  await fs.writeFile(path.join(dir, 'settings.json'), json, 'utf8');
  return { ok: true, dir };
});

ipcMain.handle('open-onecomme-folder', async () => {
  const dir = path.join(await templateRoot(), 'custom', TEMPLATE_NAME);
  try { await fs.access(dir); } catch (e) { return false; }
  await shell.openPath(dir);
  return true;
});

app.whenReady().then(() => {
  allowOneComme();
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
