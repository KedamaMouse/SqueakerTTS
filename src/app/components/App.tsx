
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
    const [pitch,setPitch]= React.useState<number>(parseIntSetting("pitch",-50,50,0));
    const [rate,setRate]=React.useState<number>(parseIntSetting("rate",20,200,100));

    const handleChange:React.ChangeEventHandler<HTMLTextAreaElement> = React.useCallback((event)=>{
        setText(event.target.value);
    },[setText]);

    const onVocalLengthChange = React.useCallback((value: number)=>
    {
        window.localStorage.setItem("VocalLength",value.toString());
        setVocalLength(value);

    },[setVocalLength]);

    const onPitchChange = React.useCallback((value: number)=>
    {
        window.localStorage.setItem("pitch",value.toString());
        setPitch(value);

    },[setPitch]);

    const onRateChange = React.useCallback((value: number)=>
    {
        window.localStorage.setItem("rate",value.toString());
        setRate(value);

    },[setRate]);



    const submitText = React.useCallback(()=>
    {
        props.electronAPI.speak({text: text.trim(), vocalLength: vocalLength, pitch: pitch, rate: rate});
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
                <Slider min={-50} max={50} value={pitch} setValue={onPitchChange} label='pitch'/>
                <Slider min={20} max={200} value={rate} setValue={onRateChange} label='rate'/>
            </>;
    
};