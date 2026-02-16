"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: electron.ipcRenderer,
  process: {
    env: process.env
  }
});
