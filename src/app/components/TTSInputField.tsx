import * as React from 'react';
import styled from 'styled-components';
import { IElectrionAPI, ITTSRequest, IVoiceProfile } from '../../ICommonInterfaces';

interface IAppProps
{
    electronAPI : IElectrionAPI;
    voiceProfile: IVoiceProfile;
    setNeedToAssignFocus : (value: boolean)=> void;
    takeFocus: boolean;
}

interface IInputHistory
{
    inputArray: string[];
    position: number;
    unsavedInput: string;    
}

export const TTSInputField:React.FC<IAppProps> = (props) => {
    const [text,setText] = React.useState<string>("");
    const textArea = React.useRef<HTMLTextAreaElement>();
    const [inputHistory,setInputHistory] = React.useState<IInputHistory>({inputArray:[], position: 0, unsavedInput: ""});
    
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
        if(request.text !== inputHistory.inputArray[inputHistory.inputArray.length-1]){
            inputHistory.inputArray.push(request.text);
        }
        inputHistory.position=0;
        if(inputHistory.inputArray.length > 10)
        {
            inputHistory.inputArray.shift();
        }
        setInputHistory(inputHistory);
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
                if(inputHistory.inputArray.length > 0)
                {
                    const dir = (event.key === "ArrowUp") ? 1 : -1;
                    if(inputHistory.position === 0)//0 means on a new unsubmitted input, not in the array.
                    {
                        inputHistory.unsavedInput= text;
                        
                    }
                    const totalInputs=inputHistory.inputArray.length+1;
                    inputHistory.position= (inputHistory.position+dir+totalInputs) % totalInputs;
                    if(inputHistory.position === 0)
                    {
                        setText(inputHistory.unsavedInput);
                    }
                    else
                    {
                        setText(inputHistory.inputArray[inputHistory.inputArray.length-inputHistory.position]);
                    }
                    setInputHistory(inputHistory);
                }

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