import * as React from 'react';
import { IElectrionAPI, ITTSRequest, IVoiceProfile } from '../../ICommonInterfaces';

interface IAppProps
{
    electronAPI : IElectrionAPI;
    voiceProfile: IVoiceProfile;
}

export const TTSInputField:React.FC<IAppProps> = (props) => {
    const [text,setText] = React.useState<string>("");
    
    const handleChange:React.ChangeEventHandler<HTMLTextAreaElement> = React.useCallback((event)=>{
        setText(event.target.value);
    },[setText]);

    const submitText = React.useCallback(()=>
    {
        const request: ITTSRequest =
        {   
            text: text.trim(),
            pitch: props.voiceProfile.pitch,
            rate: props.voiceProfile.rate,
            vocalLength: props.voiceProfile.vocalLength,
            voice: props.voiceProfile.voice
        };
        props.electronAPI.speak(request);
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
        
    },[submitText]);

    return <textarea className='textArea' autoFocus onKeyUp={onKeyUp} value={text} onChange={handleChange} />
}