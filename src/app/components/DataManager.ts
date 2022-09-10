import { IData, IVoiceProfile } from "../../ICommonInterfaces";

export class DataManager implements IData
{
    public activeVoiceKey: string;
    public setActiveVoiceKey: React.Dispatch<React.SetStateAction<string>>;

    public voiceProfiles: { [key: string]: IVoiceProfile; };
    public setVoiceProfiles: React.Dispatch<React.SetStateAction<{[key: string]: IVoiceProfile; }>>;
    
    
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
            console.log("bad data:"+window.localStorage.getItem("Data"));
        }
        
        if(loadedData)
        {
            this.setVoiceProfiles(loadedData.voiceProfiles);
            this.setActiveVoiceKey(loadedData.activeVoiceKey);
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
        };
    }

    

}