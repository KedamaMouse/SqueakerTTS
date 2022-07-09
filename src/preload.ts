import { contextBridge, ipcRenderer } from "electron";


export interface IElectrionAPI 
{
    sendTTSCommand:(command:string, args: any) => void;
}

const electronAPI: IElectrionAPI=
{    
    sendTTSCommand: (command:string, args: any) => 
    {
        ipcRenderer.send("sendTTSCommand",command,args);        
    }
}

contextBridge.exposeInMainWorld('electronAPI',electronAPI);