
import * as React from 'react';
import { IElectrionAPI } from '../../preload';

import { VoiceList } from './VoiceList';
import { VolumeSlider } from './VolumeSlider';



interface IAppProps
{
    electronAPI : IElectrionAPI;
}

export const App:React.FC<IAppProps> = (props) => {
    const [text,setText] = React.useState<string>("");

    const handleChange:React.ChangeEventHandler<HTMLTextAreaElement> = React.useCallback((event)=>{
        setText(event.target.value);
    },[setText]);

    const submitText = React.useCallback(()=>
    {

        props.electronAPI.sendTTSCommand("speak",text.trim());
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
            </>;
    
};