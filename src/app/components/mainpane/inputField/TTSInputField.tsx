import * as React from 'react';
import styled,{ css } from "styled-components";
import { ITTSRequest, IVoiceProfile } from '../../../../ICommonInterfaces';
import { IElectrionAPI } from '../../../../mainElectronProcess/preload';
import { InputHistory } from './InputHistory';

interface IAppProps
{
    electronAPI : IElectrionAPI;
    voiceProfile: IVoiceProfile;
    setNeedToAssignFocus : (value: boolean)=> void;
    takeFocus: boolean;
    compactMode: boolean;
}

export const TTSInputField:React.FC<IAppProps> = (props) => {
    const [text,setText] = React.useState<string>("");
    const textArea = React.useRef<HTMLTextAreaElement>();
    const inputHistory = React.useState<InputHistory>(new InputHistory())[0];

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
            voice: props.voiceProfile.voice,
            autoBreaths: props.voiceProfile.autoBreaths
        };
        props.electronAPI.speak(request);
        inputHistory.addEntry(request.text);
        setText("");
    },[text]); 

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
        
    },[submitText]);

    const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = React.useCallback((event)=>{
        switch(event.key)
        {
            case "Enter":
            case "Escape":
            case "ArrowUp": 
            case "ArrowDown":
                event.preventDefault();
        }

    },[]);

    React.useEffect(()=>{
        if(props.takeFocus && textArea.current)
        {
            textArea.current.focus();
            props.setNeedToAssignFocus(false);
        }
    },[props.takeFocus,textArea.current,props.setNeedToAssignFocus]);


    return <TextArea accessKey='`' autoFocus onKeyUp={onKeyUp} onKeyDown={onKeyDown} 
            value={text} onChange={handleChange} ref={textArea} compactMode={props.compactMode} />
}

const TextArea = styled.textarea<{compactMode: boolean}>`
    width:  calc(100% - 33px);
    background-color: ${props => props.theme.editBackColor};

    ${props => props.compactMode && css`
        height: calc(100% - 2px);
        font-size: 16px;
        
    `}
    `