import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { ipcFromMainChannels, ITTSRequest } from "../ICommonInterfaces";

export interface IElectrionAPI {
    sendTTSCommand: (command: string, arg?: any) => Promise<any>;
    speak: (args: ITTSRequest) => Promise<any>;
    on: (channel: ipcFromMainChannels, callback: (event: IpcRendererEvent, ...args: any[]) => void) => ()=>void;
    promptForStartCommand: () => void;
    promptForStopCommand: () => void;
    setWindowSize: (width: number, height: number) => void;
}

const coreSend= (command:string, arg?: any) => 
{
    return ipcRenderer.invoke("sendTTSCommand",command, arg);        
}

const electronAPI: IElectrionAPI=
{
    speak: (args: ITTSRequest) => {
        return coreSend("speak", args);
    },
    sendTTSCommand: coreSend,

    on: (channel: ipcFromMainChannels, callback) => {
        if (Object.values(ipcFromMainChannels).includes(channel)) {

            ipcRenderer.on(channel, callback);
            return () => { ipcRenderer.removeListener(channel, callback); };
        }
    },
    promptForStartCommand: () => {
        ipcRenderer.invoke("promptForStartCommand");
    },
    promptForStopCommand: () => {
        ipcRenderer.invoke("promptForStopCommand");
    },
    setWindowSize: function (width: number, height: number): void {
        ipcRenderer.invoke("setWindowSize",width,height);
    }
}

contextBridge.exposeInMainWorld('electronAPI',electronAPI);