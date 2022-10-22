const url = require("url");
const path = require("path");
import { app, BrowserWindow, dialog, ipcMain, Menu } from "electron";
import { ConnectionHandler } from "./ConnectionHandler";
import { GetMenuTemplate } from "./electronMenu";
import { ipcFromMainChannels } from "../ICommonInterfaces";

const WINDOW_DEFAULT_WIDTH=600;
const WINDOW_DEFAULT_HEIGHT=600;

export class mainProcessBehavior {
  window: BrowserWindow;

  constructor() {
    app.commandLine.appendSwitch('disable-renderer-backgrounding');
    app.on("ready", this.createWindow.bind(this));
    app.on("activate", this.createWindow.bind(this));

    app.on("window-all-closed", () => {

      if (process.platform !== "darwin") {
        app.quit();
      }
    });
    ipcMain.handle("promptForStartCommand",this.promptForStartCommand.bind(this));
    ipcMain.handle("promptForStopCommand",this.promptForStopCommand.bind(this));
    ipcMain.handle("setWindowSize",this.setWindowSize.bind(this));
  }

  private createWindow() {
    if (!this.window) {
      this.window = new BrowserWindow({
        width: WINDOW_DEFAULT_WIDTH, height: WINDOW_DEFAULT_HEIGHT, webPreferences: {
          devTools: true,
          nodeIntegration: false,
          nodeIntegrationInWorker: false,
          nodeIntegrationInSubFrames: false,
          contextIsolation: true,
          preload: path.join(__dirname, "preload.js"),
          disableBlinkFeatures: "Auxclick",
          backgroundThrottling: false,
        },
        icon: path.join(__dirname, "..\\assets\\MediumCheese.ico"),
      });

      Menu.setApplicationMenu(Menu.buildFromTemplate(GetMenuTemplate(this)));
      this.window.loadURL(
        url.format({
          pathname: path.join(__dirname, "index.html"),
          protocol: "file:",
          slashes: true
        })
      );
      const connection = new ConnectionHandler(this.window);
      this.window.on("closed", () => {
        this.window = null;
        connection.destroy();
      });
    }
  }

  public send(channel: ipcFromMainChannels, ...args: any[]): void {
    this.window.webContents.send(channel, ...args);
  }

  public promptForStartCommand()
  {
    const file=dialog.showOpenDialogSync(this.window,{properties: ['openFile']});
    if(file && file.length >0){
        this.send(ipcFromMainChannels.startCommandSet,file[0]);
    }
  }

  public promptForStopCommand()
  {
    const file=dialog.showOpenDialogSync(this.window,{properties: ['openFile']});
    if(file && file.length >0){
        this.send(ipcFromMainChannels.stopCommandSet,file[0]);
    }
  }

  private setWindowSize(_event: Electron.IpcMainInvokeEvent, width: number, height: number)
  {
    if(width === 0)
    {
      width=WINDOW_DEFAULT_WIDTH;
    }
    if(height === 0)
    {
      height=WINDOW_DEFAULT_HEIGHT;
    }
    this.window.setSize(width,height);
  }

}