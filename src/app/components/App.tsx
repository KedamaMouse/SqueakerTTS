
import * as React from 'react';
import { IElectrionAPI } from '../../preload';

interface IVoice
{
    voiceInfo:
    {
        name: string;
        id: string;
        description: string;

    }
}

interface IAppProps
{
    electronAPI : IElectrionAPI;
}

export const App:React.FC<IAppProps> = (props) => {
    const [text,setText] = React.useState<string>("test");
    const [voices,setVoices] = React.useState<Array<IVoice>>();

    const handleChange:React.ChangeEventHandler<HTMLTextAreaElement> = React.useCallback((event)=>{
        setText(event.target.value);
    },[setText]);

    const buttonClick = React.useCallback(()=>
    {
        props.electronAPI.sendTTSCommand("speak",text);
        setText("");
        getVoices(props.electronAPI,setVoices);//TODO remove. easier to debug with, since render process isn't currently attached to debugger on launch.
    },[text]);  

    if(!voices)
    {
        getVoices(props.electronAPI,setVoices);
    }
    return <>
        <div><textarea value={text} onChange={handleChange} />
        <button onClick={buttonClick}>speak</button></div>
        <VoiceList voices={voices} electronAPI={props.electronAPI} />

    </>;
    
};

interface IVoiceListProps
{
    electronAPI : IElectrionAPI;
    voices: Array<IVoice>;
}
const VoiceList:React.FC<IVoiceListProps> = (props) =>
{
    const changeHandler:React.ChangeEventHandler<HTMLSelectElement> = React.useCallback((event): void=>{
    
        props.electronAPI.sendTTSCommand("setVoice",event.target.value);
    },[]);


    const options = props.voices?.map((voice)=>
    {
        return <option value={voice.voiceInfo.name} key={voice.voiceInfo.id}>{voice.voiceInfo.description}</option>
    });
    return <select onChange={changeHandler}>{options}</select>
}

async function getVoices(electronAPI:IElectrionAPI,setVoices: React.Dispatch<(prevState: undefined) => undefined>)
{
    const voices =await electronAPI.sendTTSCommand("getVoices");
    setVoices(voices);
}