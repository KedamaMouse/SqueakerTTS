import * as React from 'react';
import styled from 'styled-components';
import { IElectrionAPI, ipcFromMainChannels } from '../../ICommonInterfaces';
import { SectionDiv } from './CommonStyledComponents';


interface IInstructionsProps
{
    electronAPI : IElectrionAPI;
}

export const Instructions:React.FC<IInstructionsProps> = (props) => {
    
    const [errorText,setErrorText] = React.useState<string>("");
    
    React.useEffect(()=>{
        const removeListener=props.electronAPI.on(ipcFromMainChannels.errorReconnect,()=>{
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
    
    
    return <SectionDiv>
        <ErrorDiv>{errorText}</ErrorDiv>
        w(text) to whipser <br/>
        ee(text) for strong emphasis <br/>
        e(text) for modorate emphasis <br/>
        r(text) for reduced emphasis <br/>
        s(text) for soft phonation <br/>
    </SectionDiv>
}

const ErrorDiv = styled.div`
    color: ${props => props.theme.errorColor};
`