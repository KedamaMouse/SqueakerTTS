
import * as React from 'react';
import { IData, IElectrionAPI, ipcToMainChannels, IVoiceProfile } from "../../ICommonInterfaces";
import { TTSInputField } from './TTSInputField';
import { VoiceOptions } from './VoiceOptions';

interface IAppProps
{
    electronAPI : IElectrionAPI;
}

export const App:React.FC<IAppProps> = (props) => {
   
    const [data,setData]= React.useState<IData>(null);

    const voiceProfile= data?.voiceProfiles[data.activeVoiceKey];

    const updateVoiceProfile: (value: IVoiceProfile) => void = React.useCallback((value)=>
    {
        setData({...data,voiceProfiles:{...data?.voiceProfiles,[value.key]: value}, activeVoiceKey: value.key});

    },[data]);

    //Load and save data
    React.useEffect(()=>{
        if(!data){
            let loadedData=null;
            try{
                loadedData=JSON.parse(window.localStorage.getItem("Data"));
            }catch(e)
            {
                console.log("bad data:"+window.localStorage.getItem("Data"));
            }
            
            if(loadedData)
            {
                setData(loadedData);
            }
            else
            {
                //set default values
                updateVoiceProfile({
                    vocalLength: 100,
                    pitch: 0,
                    rate: 100,
                    key:"default",
                    voice:"",
                })
            }
        }
        else{
            //data exists and changed, save
            window.localStorage.setItem("Data",JSON.stringify(data));
        }
    },[data]);
    
    //import/export/clear data
    React.useEffect(()=>{
        const removeListener=props.electronAPI.on(ipcToMainChannels.export,()=>{
            navigator.clipboard.writeText(JSON.stringify(data));
        });
        return removeListener;
    },[data]);

    React.useEffect(()=>{
        const removeListener=props.electronAPI.on(ipcToMainChannels.import,async ()=>{
            const newData=await navigator.clipboard.readText();
            if(newData){
                window.localStorage.setItem("Data",newData);
                setData(null);
            }
        });
        return removeListener;
    },[data]);

    React.useEffect(()=>{
        const removeListener=props.electronAPI.on(ipcToMainChannels.restoreDefaults,()=>{
            window.localStorage.removeItem("Data");
            setData(null);
        });
        return removeListener;
    },[data]);

    return  data ? <>
                <TTSInputField electronAPI={props.electronAPI} voiceProfile={voiceProfile} />
                <VoiceOptions electronAPI={props.electronAPI} voiceProfile={voiceProfile} setvoiceProfile={updateVoiceProfile}/>
            </> : null;
    
};

