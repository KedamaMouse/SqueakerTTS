
import * as React from 'react';
import { IElectrionAPI } from '../../preload';

import { VoiceList } from './VoiceList';
import { parseIntSetting, Slider, VolumeSlider } from './Sliders';



interface IAppProps
{
    electronAPI : IElectrionAPI;
}

export const App:React.FC<IAppProps> = (props) => {
    const [text,setText] = React.useState<string>("");
    const [vocalLength,setVocalLength] = React.useState<number>(parseIntSetting("VocalLength",50,200,100));

    const handleChange:React.ChangeEventHandler<HTMLTextAreaElement> = React.useCallback((event)=>{
        setText(event.target.value);
    },[setText]);

    const onVocalLengthChange = React.useCallback((value: number)=>
    {
        window.localStorage.setItem("VocalLength",value.toString());
        setVocalLength(value);

    },[setVocalLength]);

    const submitText = React.useCallback(()=>
    {
        props.electronAPI.speak({text: text.trim(), vocalLength: vocalLength});
        setText("");
    },[text]);  

    const onKeyUp:React.KeyboardEventHandler<HTMLTextAreaElement> = React.useCallback((event)=>{
        if(event.key=== "Enter" || event.key==="," || event.key==="." || event.key==="?" || event.key === "!")
        {
            submitText();
        }
        else if(event.key === "Escape")
        {
            props.electronAPI.sendTTSCommand("stop");
        }
        
    },[submitText])

    return  <>
                <textarea className='textArea' autoFocus onKeyUp={onKeyUp} value={text} onChange={handleChange} />
                <VoiceList electronAPI={props.electronAPI} />
                <VolumeSlider electronAPI={props.electronAPI} /> 
                <Slider min={50} max={200} value={vocalLength} setValue={onVocalLengthChange} label={"Vocal Length"}/>
            </>;
    
};