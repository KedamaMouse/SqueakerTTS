import { IData, IVoiceProfile } from "../../ICommonInterfaces";
import * as React from 'react';
import styled, { css } from "styled-components";
import { GlobalHotKeys } from "react-hotkeys";


interface IVoiceProfileSelectProps
{
    
    setActiveVoiceProfile: (key:string) => void;
    removeVoiceProfile: (key:string) => void;
    activeVoiceKey: string;
    voiceProfiles: {[key: string]: IVoiceProfile};
}

export const VoiceProfileSelect:React.FC<IVoiceProfileSelectProps> = (props) => {


    const widgets:React.ReactElement[] =[];
    const keyMap:{[key: string]: string} = {}
    const handlers:{[key: string]: (keyEvent?: KeyboardEvent) => void;} = {}


    let index=1;
    for (const profileKey in props.voiceProfiles)
    {
        let hotkey="";
        if(index < 10){
            hotkey="alt+"+index;
            keyMap["setVoice"+index]=hotkey;
            handlers["setVoice"+index]=()=>{
                 props.setActiveVoiceProfile(profileKey);
            }
         }
         index++;

        const profile =props.voiceProfiles[profileKey];
        widgets.push(<VoiceProfleWidget voiceProfile={profile} key={profileKey} hotkey={hotkey}
            setActiveVoiceProfile={props.setActiveVoiceProfile} removeVoiceProfile={props.removeVoiceProfile}
            selected={(profileKey === props.activeVoiceKey)}></VoiceProfleWidget>);
        

    }

    return <><GlobalHotKeys keyMap={keyMap} handlers={handlers} allowChanges/>{widgets}</>
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
        border-color: ${props => props.theme.selectedBorderColor};
        margin: 3px;
    `};
`;


interface IVoiceProfileWidgetProps
{
    voiceProfile: IVoiceProfile;
    selected: boolean;
    setActiveVoiceProfile: (key:string) => void;
    removeVoiceProfile: (key:string) => void;
    hotkey: string;
}

const VoiceProfleWidget:React.FC<IVoiceProfileWidgetProps> = (props) =>{

    const onClick = React.useCallback(()=>{props.setActiveVoiceProfile(props.voiceProfile.key)},[props.setActiveVoiceProfile]);

    const onRemove:React.MouseEventHandler<HTMLButtonElement> = (event)=>{ 
        props.removeVoiceProfile(props.voiceProfile.key);    
        event.stopPropagation();
    }


    return <OuterDiv onClick={onClick } activeProfile={props.selected} >
        <TopRow>
            <NameSpan>{props.voiceProfile.key}</NameSpan>
            {props.hotkey ? <span>({props.hotkey})</span> : null}
            {!props.selected ? <RemoveButton title="Remove" onClick={onRemove}>X</RemoveButton> : null }
            <ClearFloat/>

        </TopRow>
        <FlexContainer>
            <FlexItem><Label>voice: </Label> {props.voiceProfile.voice}</FlexItem>
            <FlexItem><Label>vocal length: </Label>{props.voiceProfile.vocalLength}</FlexItem>
            <FlexItem><Label>pitch: </Label>{props.voiceProfile.pitch}</FlexItem>
            <FlexItem><Label>rate: </Label>{props.voiceProfile.rate}</FlexItem> 
        </FlexContainer>
    </OuterDiv>
}

const TopRow = styled.div`
    
`
const RemoveButton = styled.button`
    float: right;
    font-size: 10px;
`
const ClearFloat= styled.div`
    clear: both;
`

const NameSpan=styled.span`
    font-weight: bold;
    line-height: 17px;
`;

const Label=styled.label`
    color: ${props => props.theme.labelTextColor};
`

const FlexContainer=styled.div`
    display: flex;
    flex-wrap: wrap;
`
const FlexItem=styled.div`
    margin-right: 6px;
`