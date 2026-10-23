// ページ（index.html）からアプリの機能を使うための窓口。これがあるとき、ページはアプリとして動く
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('arigatouApp', {
  saveToOneComme: (json) => ipcRenderer.invoke('save-onecomme', json),
  openOneCommeFolder: () => ipcRenderer.invoke('open-onecomme-folder'),
});
