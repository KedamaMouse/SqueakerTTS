import * as React from 'react';
import styled from 'styled-components';
import { Button, SectionDiv } from './CommonStyledComponents';
import { DataManager } from './DataManager';

interface ISettingsProps
{
    dataManager: DataManager;
}

export const Settings: React.FC<ISettingsProps> = (props) => {
    
    const removeStartSpeaking = props.dataManager.setStartCommand.bind(props.dataManager,"");
    const removeStopSpeaking = props.dataManager.setStopCommand.bind(props.dataManager,"");


    return <SectionDiv>
        <SettingLine>On Start speaking: {getShortPath(props.dataManager.startCommand)}<Button onClick={removeStartSpeaking}>X</Button></SettingLine>
        <SettingLine>On Stop speaking: {getShortPath(props.dataManager.stopCommand)}<Button onClick={removeStopSpeaking}>X</Button></SettingLine>
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