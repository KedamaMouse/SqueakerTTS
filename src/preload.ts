import { contextBridge, ipcRenderer } from "electron";
import { IElectrionAPI, ipcFromMainChannels, ITTSRequest } from "./ICommonInterfaces";


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

    on: (channel: ipcFromMainChannels, callback) =>
    {
        if(Object.values(ipcFromMainChannels).includes(channel)){
            
            ipcRenderer.on(channel,callback);
            return () => {ipcRenderer.removeListener(channel,callback);}
        }
    }

}

contextBridge.exposeInMainWorld('electronAPI',electronAPI);