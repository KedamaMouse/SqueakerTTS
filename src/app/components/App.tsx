
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
    const [text,setText] = React.useState<string>("");
    const [voices,setVoices] = React.useState<Array<IVoice>>();

    const handleChange:React.ChangeEventHandler<HTMLTextAreaElement> = React.useCallback((event)=>{
        setText(event.target.value);
    },[setText]);

    const buttonClick = React.useCallback(()=>
    {

        props.electronAPI.sendTTSCommand("speak",text.trim());
        setText("");
    },[text]);  

    const onKeyUp:React.KeyboardEventHandler<HTMLTextAreaElement> = React.useCallback((event)=>{
        if(event.key=== "Enter")
        {
            buttonClick();
        }
        else if(event.key === "Escape")
        {
            props.electronAPI.sendTTSCommand("stop");
        }  
    },[buttonClick])

    if(!voices)
    {
        getVoices(props.electronAPI,setVoices);
    }

    return <>
        <div><textarea className='textArea' autoFocus onKeyUp={onKeyUp} value={text} onChange={handleChange} />
        </div>
        { voices ? <VoiceList voices={voices} electronAPI={props.electronAPI} /> : null}

    </>;
    
};

interface IVoiceListProps
{
    electronAPI : IElectrionAPI;
    voices: Array<IVoice>;
}
const VoiceList:React.FC<IVoiceListProps> = (props) =>
{
    const [selectedVoice,setSelectedVoice]= React.useState<string>(window.localStorage.getItem("selectedVoice"));
    const changeHandler:React.ChangeEventHandler<HTMLSelectElement> = React.useCallback((event): void=>{
        setSelectedVoice(event.target.value);
    },[setSelectedVoice]);

    React.useEffect(()=>{
        props.electronAPI.sendTTSCommand("setVoice",selectedVoice);
        window.localStorage.setItem("selectedVoice",selectedVoice);
    },[selectedVoice]);


    const options = props.voices?.map((voice)=>
    {
        return <option value={voice.voiceInfo.name} key={voice.voiceInfo.id}>{voice.voiceInfo.description}</option>
    });
    return props.voices ? <select onChange={changeHandler} value={selectedVoice}>{options}</select> : <></>;
}

async function getVoices(electronAPI:IElectrionAPI,setVoices: React.Dispatch<(prevState: undefined) => undefined>)
{
    const voices =await electronAPI.sendTTSCommand("getVoices");
    setVoices(voices);
}