import { IData, IVoiceProfile } from "../../ICommonInterfaces";
import * as React from 'react';
import styled from "styled-components";


interface IVoiceProfileSelectProps
{
    data: IData;
}

export const VoiceProfileSelect:React.FC<IVoiceProfileSelectProps> = (props) => {


    const widgets:React.ReactElement[] =[];

    for (const profileKey in props.data.voiceProfiles)
    {
        const profile =props.data.voiceProfiles[profileKey];
        widgets.push(<VoiceProfleWidget voiceProfile={profile} key={profileKey}></VoiceProfleWidget>);
    }

    return <>{widgets}</>
}


interface IVoiceProfileWidgetProps
{
    voiceProfile: IVoiceProfile;
}

const OuterDiv = styled.div`
font-size: 10px;
margin: 5px;
background-color: ${props => props.theme.editBackColor};
`;

const VoiceProfleWidget:React.FC<IVoiceProfileWidgetProps> = (props) =>{



    return <OuterDiv>
        <div>{props.voiceProfile.key}</div>
        <div><label>voice</label> {props.voiceProfile.voice}</div>
        <div><label>vocal length</label>{props.voiceProfile.vocalLength}</div>        
    </OuterDiv>
}