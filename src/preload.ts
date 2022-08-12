import { contextBridge, ipcRenderer } from "electron";
import { IElectrionAPI, ipcToMainChannels, ITTSRequest } from "./ICommonInterfaces";


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
    sendTTSCommand: coreSend,

    on: (channel: ipcToMainChannels, callback) =>
    {
        if(Object.values(ipcToMainChannels).includes(channel)){
            
            ipcRenderer.on(channel,callback);
            return () => {ipcRenderer.removeListener(channel,callback);}
        }
    }

}

contextBridge.exposeInMainWorld('electronAPI',electronAPI);