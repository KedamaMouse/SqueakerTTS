import { contextBridge, ipcRenderer } from "electron";


export interface IElectrionAPI 
{
    sendTTSCommand:(command:string,  arg?: string) => Promise<any>;
}

const electronAPI: IElectrionAPI=
{    
    sendTTSCommand: (command:string, arg?: string) => 
    {
        return ipcRenderer.invoke("sendTTSCommand",command, arg);        
    }

}

contextBridge.exposeInMainWorld('electronAPI',electronAPI);