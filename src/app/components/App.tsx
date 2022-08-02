
import * as React from 'react';
import { IElectrionAPI, ITTSRequest } from '../../preload';
import { VoiceOptions } from './VoiceOptions';



interface IAppProps
{
    electronAPI : IElectrionAPI;
}

export const App:React.FC<IAppProps> = (props) => {
    const [text,setText] = React.useState<string>("");
    const [voiceSettings,setVoiceSettings]= React.useState<ITTSRequest>(null);

    const handleChange:React.ChangeEventHandler<HTMLTextAreaElement> = React.useCallback((event)=>{
        setText(event.target.value);
    },[setText]);

    const submitText = React.useCallback(()=>
    {
        voiceSettings.text=text.trim();
        props.electronAPI.speak(voiceSettings);
        setText("");
    },[text]);  

    const onKeyUp:React.KeyboardEventHandler<HTMLTextAreaElement> = React.useCallback((event)=>{
        if(event.key=== "Enter")
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
                <VoiceOptions electronAPI={props.electronAPI} voiceSetting={voiceSettings} setVoiceSetting={setVoiceSettings}/>
            </>;
    
};