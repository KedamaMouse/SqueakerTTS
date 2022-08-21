import * as React from 'react';
import styled from 'styled-components';
import { IElectrionAPI, ITTSRequest, IVoiceProfile } from '../../../ICommonInterfaces';
import { InputHistory } from './InputHistory';

interface IAppProps
{
    electronAPI : IElectrionAPI;
    voiceProfile: IVoiceProfile;
    setNeedToAssignFocus : (value: boolean)=> void;
    takeFocus: boolean;
}

export const TTSInputField:React.FC<IAppProps> = (props) => {
    const [text,setText] = React.useState<string>("");
    const textArea = React.useRef<HTMLTextAreaElement>();
    const [inputHistory,setInputHistory] = React.useState<InputHistory>(new InputHistory());
    inputHistory.saveChanges=setInputHistory;
    
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
        inputHistory.addEntry(request.text);
        setText("");
    },[text,inputHistory]); 

    const onKeyUp:React.KeyboardEventHandler<HTMLTextAreaElement> = React.useCallback((event)=>{
        switch(event.key)
        {
            case "Enter":
                submitText();
                break;
            case "Escape":
                props.electronAPI.sendTTSCommand("stop");
                break;
            case "ArrowUp": 
            case "ArrowDown":
                const dir = (event.key === "ArrowUp") ? 1 : -1;
                setText(inputHistory.getNextEntry(text,dir));
        }
        
    },[submitText,inputHistory]);

    React.useEffect(()=>{
        if(props.takeFocus && textArea.current)
        {
            textArea.current.focus();
            props.setNeedToAssignFocus(false);
        }
    },[props.takeFocus,textArea.current,props.setNeedToAssignFocus]);


    return <TextArea accessKey='`' autoFocus onKeyUp={onKeyUp} value={text} onChange={handleChange} ref={textArea} />
}

const TextArea = styled.textarea`
    width:  calc(100% - 6px);
    background-color: ${props => props.theme.editBackColor};
`