import * as React from 'react';
import styled from 'styled-components';
import { IElectrionAPI } from '../../../mainElectronProcess/preload';
import { Button, LinkButton, SectionDiv } from '../UI/CommonStyledComponents';

interface ISettingsProps
{
    electronAPI : IElectrionAPI;
    startCommand: string;
    setStartCommand:(command: string)=> void;
    stopCommand: string;
    setStopCommand:(command: string)=> void;
}

export const Settings: React.FC<ISettingsProps> = (props) => {
    
    const removeStartSpeaking = ()=>{props.setStartCommand("")}
    const removeStopSpeaking = ()=>{props.setStopCommand("")};

    const startText= props.startCommand ? getShortPath(props.startCommand) : "select";
    const stopText=props.stopCommand ? getShortPath(props.stopCommand) : "select";


    return <SectionDiv>
        <SettingLine>On Start speaking: 
            <LinkButton onClick={()=>{props.electronAPI.promptForStartCommand()}}>{startText}</LinkButton>
            {props.startCommand ? <Button onClick={removeStartSpeaking}>X</Button> : null}
        </SettingLine>
        <SettingLine>
            On Stop speaking: 
            <LinkButton onClick={()=>{props.electronAPI.promptForStopCommand()}}>{stopText}</LinkButton>
            {props.stopCommand ? <Button onClick={removeStopSpeaking}>X</Button> : null}
        </SettingLine>
    </SectionDiv>
}

const SettingLine= styled.div`
    line-height: 18px;
`


function getShortPath(path: string): string
{
    const index = path.lastIndexOf("\\");
    if(index >= 0)
    {
        return "..."+path.substring(index);
    }
    return path;
}