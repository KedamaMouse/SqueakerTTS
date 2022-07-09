import { contextBridge, ipcRenderer } from "electron";


export interface IElectrionAPI 
{
    sendTTSCommand:(command:string, args: any) => Promise<any>;
}

const electronAPI: IElectrionAPI=
{    
    sendTTSCommand: (command:string, args: any) => 
    {
        return ipcRenderer.invoke("sendTTSCommand",command,args);        
    }

}

contextBridge.exposeInMainWorld('electronAPI',electronAPI);