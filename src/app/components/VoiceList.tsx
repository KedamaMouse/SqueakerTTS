import * as React from 'react';
import { IElectrionAPI, IVoiceProfile } from "../../ICommonInterfaces";

interface IVoice
{
    voiceInfo:
    {
        name: string;
        id: string;
        description: string;
    }
}

interface IVoiceListProps
{
    electronAPI : IElectrionAPI;
    voiceProfile: IVoiceProfile;
    setvoiceProfile: (value: IVoiceProfile) =>void;
}
export const VoiceList:React.FC<IVoiceListProps> = (props) =>
{
    const [voices,setVoices] = React.useState<Array<IVoice>>();
    const changeHandler:React.ChangeEventHandler<HTMLSelectElement> = React.useCallback((event): void=>{
        props.setvoiceProfile({...props.voiceProfile, "voice": event.target.value});
    },[]);

    if(!voices)
    {
        getVoices(props.electronAPI,setVoices);
    }

    const options = voices?.map((voice)=>
    {
        return <option value={voice.voiceInfo.name} key={voice.voiceInfo.id}>{voice.voiceInfo.description}</option>
    });
    if(options && props.voiceProfile.voice ==="")
    {
        props.setvoiceProfile({...props.voiceProfile, "voice": options[0].props.value});
    }

    return voices ? <select onChange={changeHandler} value={props.voiceProfile.voice}>{options}</select> : <></>;
}

async function getVoices(electronAPI:IElectrionAPI,setVoices: React.Dispatch<(prevState: undefined) => undefined>)
{
    const voices =await electronAPI.sendTTSCommand("getVoices");
    setVoices(voices);
}