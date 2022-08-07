
import * as React from 'react';
import { IData, IElectrionAPI, ITTSRequest, IVoiceProfile } from "../../ICommonInterfaces";
import { VoiceOptions } from './VoiceOptions';



interface IAppProps
{
    electronAPI : IElectrionAPI;
}

export const App:React.FC<IAppProps> = (props) => {
    const [text,setText] = React.useState<string>("");
    const [data,setData]= React.useState<IData>(null);

    const voice= data?.voiceProfiles[data.activeVoiceKey];

    const handleChange:React.ChangeEventHandler<HTMLTextAreaElement> = React.useCallback((event)=>{
        setText(event.target.value);
    },[setText]);

    const submitText = React.useCallback(()=>
    {
        const request: ITTSRequest =
        {   
            text: text.trim(),
            pitch: voice.pitch,
            rate: voice.rate,
            vocalLength: voice.vocalLength,
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

    const updateVoiceProfile: (value: IVoiceProfile) => void = React.useCallback((value)=>
    {
        setData({...data,voiceProfiles:{...data?.voiceProfiles,[value.key]: value}, activeVoiceKey: value.key});

    },[data]);
    

    return  <>
                <textarea className='textArea' autoFocus onKeyUp={onKeyUp} value={text} onChange={handleChange} />
                <VoiceOptions electronAPI={props.electronAPI} voiceProfile={voice} setvoiceProfile={updateVoiceProfile}/>
            </>;
    
};