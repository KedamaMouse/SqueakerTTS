import * as React from 'react';
import { IElectrionAPI } from "../../ICommonInterfaces";

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
}
export const VoiceList:React.FC<IVoiceListProps> = (props) =>
{
    const [voices,setVoices] = React.useState<Array<IVoice>>();
    const [selectedVoice,setSelectedVoice]= React.useState<string>(window.localStorage.getItem("selectedVoice"));
    const changeHandler:React.ChangeEventHandler<HTMLSelectElement> = React.useCallback((event): void=>{
        setSelectedVoice(event.target.value);
    },[setSelectedVoice]);

    React.useEffect(()=>{
        if(voices)
        {
            props.electronAPI.sendTTSCommand("setVoice",selectedVoice);
            window.localStorage.setItem("selectedVoice",selectedVoice);
        }
    },[selectedVoice,voices]);

    if(!voices)
    {
        getVoices(props.electronAPI,setVoices);
    }


    const options = voices?.map((voice)=>
    {
        return <option value={voice.voiceInfo.name} key={voice.voiceInfo.id}>{voice.voiceInfo.description}</option>
    });
    return voices ? <select onChange={changeHandler} value={selectedVoice}>{options}</select> : <></>;
}

async function getVoices(electronAPI:IElectrionAPI,setVoices: React.Dispatch<(prevState: undefined) => undefined>)
{
    const voices =await electronAPI.sendTTSCommand("getVoices");
    setVoices(voices);
}