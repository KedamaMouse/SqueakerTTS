import { BrowserWindow, ipcMain } from "electron";
import { Connection, ConnectionBuilder } from "electron-cgi";
import { exepath } from "./main";

export class ConnectionHandler {
  constructor(window: BrowserWindow) {
    this.window=window;
    this.makeConnection();
  }
  private connection: Connection;
  private  window: BrowserWindow;

  private makeConnection(): void {
    ipcMain.removeHandler("sendTTSCommand");
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
