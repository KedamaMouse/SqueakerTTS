import * as React from 'react';
import styled from 'styled-components';
import { IElectrionAPI, ipcToMainChannels } from '../../ICommonInterfaces';


interface IInstructionsProps
{
    electronAPI : IElectrionAPI;
}

export const Instructions:React.FC<IInstructionsProps> = (props) => {
    
    const [errorText,setErrorText] = React.useState<string>("");
    
    React.useEffect(()=>{
        const removeListener=props.electronAPI.on(ipcToMainChannels.errorReconnect,()=>{
            setErrorText("background process disconnected. reconnecting.");
        });
        return removeListener;
    },[setErrorText]);
    
    React.useEffect(()=>{
        if(errorText)
        {
            setTimeout(() => {
                setErrorText("");    
            }, 1000);

        }
    },[errorText])
    
    
    return <OuterDiv>
        <ErrorDiv>{errorText}</ErrorDiv>
        w(text) to whipser <br/>
        ee(text) for strong emphasis <br/>
        e(text) for modorate emphasis <br/>
        r(text) for reduced emphasis <br/>
        s(text) for soft phonation <br/>


    </OuterDiv>
}

const OuterDiv= styled.div`
    margin-top: 10px;
    color: ${props => props.theme.appBackTextColor};
    border-width: 2px;
    border-style: solid;
    border-radius: 10px;
    border-color: ${props => props.theme.editBackColor};
    padding: 4px;
`
const ErrorDiv = styled.div`
    color: ${props => props.theme.errorColor};
`