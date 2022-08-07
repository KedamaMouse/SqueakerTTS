import { contextBridge, ipcRenderer } from "electron";
import { IElectrionAPI, ITTSRequest } from "./ICommonInterfaces";


const coreSend= (command:string, arg?: any) => 
{
    return ipcRenderer.invoke("sendTTSCommand",command, arg);        
}

const electronAPI: IElectrionAPI=
{
    speak: (args: ITTSRequest) =>
    {
        return coreSend("speak",args);
    },     
    sendTTSCommand: coreSend

}

contextBridge.exposeInMainWorld('electronAPI',electronAPI);