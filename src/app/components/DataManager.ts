import { IData, IVoiceProfile } from "../../ICommonInterfaces";
import * as React from 'react';
import { IElectrionAPI } from "../../mainElectronProcess/preload";

//Manager for all state that needs to be saved.

export function useDataManager(electronAPI : IElectrionAPI): DataManager
{
    const dataManager=React.useState<DataManager>(new DataManager(electronAPI))[0];
    dataManager.useState();

    return dataManager;
}

export class DataManager implements IData
{
    public activeVoiceKey: string;
    public setActiveVoiceKey: React.Dispatch<React.SetStateAction<string>>;

    public voiceProfiles: { [key: string]: IVoiceProfile; };
    public setVoiceProfiles: React.Dispatch<React.SetStateAction<{[key: string]: IVoiceProfile; }>>;
    
    public startCommand: string;
    private __setStartCommand: React.Dispatch<React.SetStateAction<string>>;

    public stopCommand: string;
    private __setStopCommand: React.Dispatch<React.SetStateAction<string>>;

    private electronAPI : IElectrionAPI;

    public constructor(electronAPI : IElectrionAPI)
    {
        this.electronAPI=electronAPI;
    }

    public useState()
    {
        const [activeVoiceKey, setActiveVoiceKey] = React.useState<string>();
        const [voiceProfiles, setVoiceProfiles] = React.useState<{[key: string]: IVoiceProfile}>();
        const [startCommand, setStartCommand] = React.useState<string>();
        const [stopCommand, setStopCommand] = React.useState<string>();
        
        this.activeVoiceKey= activeVoiceKey;
        this.setActiveVoiceKey= setActiveVoiceKey;
        this.voiceProfiles= voiceProfiles;
        this.setVoiceProfiles= setVoiceProfiles;
        this.startCommand= startCommand;
        this.__setStartCommand= setStartCommand;
        this.stopCommand= stopCommand;
        this.__setStopCommand= setStopCommand;
    }

    public updateVoiceProfile(value: IVoiceProfile)
    {
        this.setVoiceProfiles({
            ...this.voiceProfiles,
            [value.key]: value
        });
    }

    public removeVoiceProfile(key: string){
        const newData = {...this.voiceProfiles}
        delete newData[key];
        this.setVoiceProfiles(newData);
    }

    public LoadData(): void
    {

        let loadedData: IData=null;
        try{
            loadedData=JSON.parse(window.localStorage.getItem("Data"));
        }catch(e)
        {
            console.log("bad data: "+ window.localStorage.getItem("Data"));
        }
        
        if(loadedData)
        {
            this.setVoiceProfiles(loadedData.voiceProfiles);
            this.setActiveVoiceKey(loadedData.activeVoiceKey);
            this.setStartCommand(loadedData.startCommand);
            this.setStopCommand(loadedData.stopCommand);
        }
        else
        {
            //set default values
            this.updateVoiceProfile({
                vocalLength: 100,
                pitch: 0,
                rate: 100,
                key:"default",
                voice:"",
            });
            this.setActiveVoiceKey("default");
        }
        

    }
    public SaveData(): void
    {
        window.localStorage.setItem("Data",JSON.stringify(this.getData()));
    }
    
    public ExportToClipboard(): void
    {
        navigator.clipboard.writeText(JSON.stringify(this.getData()));
    }

    public async ImportFromClipboard(): Promise<void>
    {
        const newData=await navigator.clipboard.readText();
        if(newData){
            window.localStorage.setItem("Data",newData);
            this.setActiveVoiceKey("");
        }
    }

    public RestoreDefaults(): void
    {
        window.localStorage.removeItem("Data");
        this.setActiveVoiceKey("");
    }


    private getData(): IData
    {
        return  {
            activeVoiceKey: this.activeVoiceKey,
            voiceProfiles: this.voiceProfiles,
            startCommand: this.startCommand,
            stopCommand: this.stopCommand,
        };
    }

    public setStartCommand(command: string): void
    {
        this.__setStartCommand(command);
        this.electronAPI.sendTTSCommand("setStartCommand",command);

    }

    public setStopCommand(command: string): void
    {
        this.__setStopCommand(command);
        this.electronAPI.sendTTSCommand("setStopCommand",command);
    }
}