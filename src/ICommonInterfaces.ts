

export interface IElectrionAPI {
    sendTTSCommand: (command: string, arg?: any) => Promise<any>;
    speak: (args: ITTSRequest) => Promise<any>;

}

export interface ITTSRequest {
    text: string;
    vocalLength: number;
    pitch: number;
    rate: number;
}

export interface IData 
{
    activeVoiceKey: string,
    voiceProfiles: {[key: string]: IVoiceProfile}

}

export interface IVoiceProfile
{
    key: string,
    voice: string,
    vocalLength: number,
    pitch: number,
    rate: number
}
