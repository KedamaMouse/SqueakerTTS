import { contextBridge, ipcRenderer } from "electron";


export interface IElectrionAPI 
{
    sendTTSCommand:(command:string,  arg?: any) => Promise<any>;
    speak:(args: ITTSRequest) => Promise<any>;
    
}

export interface ITTSRequest
{
    text: string;
    vocalLength: number;
    pitch: number;
    rate: number;
}

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