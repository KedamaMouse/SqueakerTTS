import { IData, IVoiceProfile } from "../../ICommonInterfaces";
import * as React from 'react';
import styled, { css } from "styled-components";


interface IVoiceProfileSelectProps
{
    data: IData;
}

export const VoiceProfileSelect:React.FC<IVoiceProfileSelectProps> = (props) => {


    const widgets:React.ReactElement[] =[];

    for (const profileKey in props.data.voiceProfiles)
    {
        const profile =props.data.voiceProfiles[profileKey];
        widgets.push(<VoiceProfleWidget voiceProfile={profile} key={profileKey} selected={(profileKey === props.data.activeVoiceKey)}></VoiceProfleWidget>);
    }

    return <>{widgets}</>
}


interface IVoiceProfileWidgetProps
{
    voiceProfile: IVoiceProfile;
    selected: boolean;
}

interface OuterDivProps
{
    activeProfile: boolean;
}

const OuterDiv = styled.div<OuterDivProps>`
    font-size: 12px;
    margin: 5px;
    padding: 5px;
    background-color: ${props => props.theme.editBackColor};
    ${props => props.activeProfile && css`
        border-style: solid;
        border-width: 2px;
        border-color: ${props => props.theme.activeBorderColor};
    `};
`;

const NameDiv=styled.div`
    font-weight: bold;
`;

const Label=styled.label`
    color: ${props => props.theme.labelTextColor};
`

const VoiceProfleWidget:React.FC<IVoiceProfileWidgetProps> = (props) =>{

    return <OuterDiv activeProfile={props.selected} >
        <NameDiv>{props.voiceProfile.key}</NameDiv>
        <div><Label>voice: </Label> {props.voiceProfile.voice}</div>
        <div><Label>vocal length: </Label>{props.voiceProfile.vocalLength}</div>
        <div><Label>pitch: </Label>{props.voiceProfile.pitch}</div>
        <div><Label>rate: </Label>{props.voiceProfile.rate}</div> 
    </OuterDiv>
}