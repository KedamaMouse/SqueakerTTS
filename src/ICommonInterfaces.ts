import { IpcRendererEvent } from "electron";


export interface IElectrionAPI {
    sendTTSCommand: (command: string, arg?: any) => Promise<any>;
    speak: (args: ITTSRequest) => Promise<any>;
    on: (channel: ipcToMainChannels, callback: (event: IpcRendererEvent, ...args: any[]) => void) => ()=>void;
}

export enum ipcToMainChannels
{
    import = "import",
    export = "export",
    restoreDefaults = "restoreDefaults",
    errorReconnect = "errorReconnect",
}

export interface ITTSRequest {
    text: string;
    vocalLength: number;
    pitch: number;
    rate: number;
    voice: string;
    autoBreaths: boolean;
}

export interface IData 
{
    activeVoiceKey: string;
    voiceProfiles: {[key: string]: IVoiceProfile};
}

export interface IVoiceProfile
{
    key: string;
    voice: string;
    vocalLength: number;
    pitch: number;
    rate: number;
    autoBreaths?: boolean;
}

export const vocalLengthMin=50;
export const vocalLengthMax=200;
export const rateMin=20;
export const rateMax=200;
export const pitchMin=-50;//not sure these are accurate for pitch, didn't find these bounds documented.
export const pitchMax=50;