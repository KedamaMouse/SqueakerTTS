const url = require("url");
const path = require("path");

import { app, BrowserWindow, ipcMain } from "electron";
import { ConnectionBuilder } from "electron-cgi";

let window: BrowserWindow | null;
const exepath="C:\\Users\\roaik\\codeProjects\\easyTTS\\src\\dotnet\\TTSAPIConnector\\bin\\Debug\\net6.0\\TTSAPIConnector.exe";

let connection =new ConnectionBuilder().connectTo(exepath, "--connect").build();


ipcMain.handle("sendTTSCommand",(_event,command,arg)=>
{
  return connection.send(command,arg);
})

const createWindow = () => {
  window = new BrowserWindow({ width: 800, height: 600 ,webPreferences: {
    devTools: true,
    nodeIntegration: false,
    nodeIntegrationInWorker: false,
    nodeIntegrationInSubFrames: false,
    contextIsolation: true,
    preload: path.join(__dirname, "preload.js"),
    disableBlinkFeatures: "Auxclick",
  }});

  window.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  window.on("closed", () => {
    window = null;
  });
};

app.on("ready", createWindow);


app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (window === null) {
    createWindow();
  }
});