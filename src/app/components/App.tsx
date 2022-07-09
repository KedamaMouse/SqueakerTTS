
import * as React from 'react';
import { IElectrionAPI } from '../../preload';

interface IVoice
{

}

export const App = (props:{electronAPI : IElectrionAPI}) => {
    const [text,setText] = React.useState<string>("test");
    const [voices,setVoices] = React.useState<Array<IVoice>>();

    const handleChange:React.ChangeEventHandler<HTMLTextAreaElement> = React.useCallback((event)=>{
        setText(event.target.value);
    },[setText]);

    const buttonClick = React.useCallback(()=>
    {
        props.electronAPI.sendTTSCommand("speak",text);
        setText("");
        getVoices(props.electronAPI,setVoices);
    },[text]);  

    if(!voices)
    {
        getVoices(props.electronAPI,setVoices);
    }

    return <div><textarea value={text} onChange={handleChange} />
    <button onClick={buttonClick}>speak</button></div>;
    
};

async function getVoices(electronAPI:IElectrionAPI,setVoices: React.Dispatch<(prevState: undefined) => undefined>)
{
    const voices =await electronAPI.sendTTSCommand("getVoices");
    setVoices(voices);
}