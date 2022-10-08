import { app, BrowserWindow, ipcMain } from "electron";
import { Connection, ConnectionBuilder } from "electron-cgi";
const path = require("path");
const fs = require('fs');

export class ConnectionHandler {
  constructor(window: BrowserWindow) {
    this.window=window;
    this.makeConnection();
  }
  private connection: Connection;
  private  window: BrowserWindow;

  private makeConnection(): void {
    ipcMain.removeHandler("sendTTSCommand");

    let exepath=path.join(path.dirname(app.getPath("exe")),"bin\\SqueakerTTSCmd.exe");;
    if(!fs.existsSync(exepath)) //different file path when not packaged.
    {
      exepath=path.join(__dirname,"bin\\SqueakerTTSCmd.exe");
    }
    if(!fs.existsSync(exepath))
    {
      throw new Error("SqueakerTTSCmd Not found at "+exepath);
    }
    
    this.connection = new ConnectionBuilder().connectTo(exepath, "--connect").build();

    ipcMain.handle("sendTTSCommand", (_event, command, arg) => {
      return this.connection.send(command, arg);
    });
    this.connection.onDisconnect = () => {
      this.window.webContents.send("errorReconnect");
      this.makeConnection();
    };

  }

  public destroy(){
    this.connection.onDisconnect=null;
  }
}
