const url = require("url");
const path = require("path");

import { app, BrowserWindow, Menu } from "electron";
import { ConnectionHandler } from "./ConnectionHandler";
import { GetMenuTemplate } from "./electronMenu";

let window: BrowserWindow | null;

app.commandLine.appendSwitch('disable-renderer-backgrounding');

const createWindow = () => {
  window = new BrowserWindow({ width: 600, height: 600 ,webPreferences: {
    devTools: true,
    nodeIntegration: false,
    nodeIntegrationInWorker: false,
    nodeIntegrationInSubFrames: false,
    contextIsolation: true,
    preload: path.join(__dirname, "preload.js"),
    disableBlinkFeatures: "Auxclick",
    backgroundThrottling: false,
  }});
  Menu.setApplicationMenu(Menu.buildFromTemplate(GetMenuTemplate(window)));
  window.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );
  const connection =new ConnectionHandler(window);
  window.on("closed", () => {
    window = null;
    connection.destroy();
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