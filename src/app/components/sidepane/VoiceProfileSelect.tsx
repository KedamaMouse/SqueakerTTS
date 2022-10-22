import { IVoiceProfile } from "../../../ICommonInterfaces";
import * as React from 'react';
import styled, { css } from "styled-components";
import { GlobalHotKeys } from "react-hotkeys";
import { Button } from "../UI/CommonStyledComponents";


interface IVoiceProfileSelectProps
{
    
    setActiveVoiceProfile: (key:string) => void;
    removeVoiceProfile: (key:string) => void;
    activeVoiceKey: string;
    voiceProfiles: {[key: string]: IVoiceProfile};
    compactMode: boolean;
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
        widgets.push(<VoiceProfleWidget voiceProfile={profile} key={profileKey} hotkey={hotkey} compactMode={props.compactMode}
            setActiveVoiceProfile={props.setActiveVoiceProfile} removeVoiceProfile={props.removeVoiceProfile}
            selected={(profileKey === props.activeVoiceKey)}></VoiceProfleWidget>);
        

    }

    return <><GlobalHotKeys keyMap={keyMap} handlers={handlers} allowChanges/>{widgets}</>
}




interface OuterDivProps
{
    activeProfile: boolean;
    compactMode: boolean;
}

const activeWidgetborderwidth=2;
function widgetMargin(compactMode: boolean)
{
    return compactMode ? 3 : 5;
}
const OuterDiv = styled.div<OuterDivProps>`
    font-size: 12px;
    margin: ${props => widgetMargin(props.compactMode)}px;
    padding: ${props => props.compactMode ? "1px" : "4px"};
    
    background-color: ${props => props.theme.editBackColor};
    ${props => props.activeProfile && css`
        border-style: solid;
        border-width: ${activeWidgetborderwidth}px;
        border-color: ${props => props.theme.selectedBorderColor};
        margin: ${widgetMargin(props.compactMode) -activeWidgetborderwidth}px;
    `};
`;


interface IVoiceProfileWidgetProps
{
    voiceProfile: IVoiceProfile;
    selected: boolean;
    setActiveVoiceProfile: (key:string) => void;
    removeVoiceProfile: (key:string) => void;
    hotkey: string;
    compactMode: boolean;
}

const VoiceProfleWidget:React.FC<IVoiceProfileWidgetProps> = (props) =>{

    const onClick = React.useCallback(()=>{props.setActiveVoiceProfile(props.voiceProfile.key)},[props.setActiveVoiceProfile]);
    const outerdiv = React.useRef<HTMLDivElement>();

    const onRemove:React.MouseEventHandler<HTMLButtonElement> = (event)=>{ 
        props.removeVoiceProfile(props.voiceProfile.key);    
        event.stopPropagation();
    }

    React.useEffect(()=>
    {
        if(props.selected && outerdiv.current)
        {
            
            outerdiv.current.scrollIntoView({block: "nearest"})
        }
    },[props.selected,outerdiv])


    return <OuterDiv onClick={onClick } activeProfile={props.selected} compactMode={props.compactMode} ref={outerdiv}>
        <TopRow>
            <NameSpan compactMode={props.compactMode}>{props.voiceProfile.key}</NameSpan>
            {props.hotkey ? <span>({props.hotkey})</span> : null}
            {!props.selected ? <Button title="Remove" onClick={onRemove} floatRight compactMode={props.compactMode}>X</Button> : null }
            <ClearFloat/>

        </TopRow>
        {props.compactMode ? null : <FlexContainer>
            <FlexItem><Label>voice: </Label> {props.voiceProfile.voice}</FlexItem>
            <FlexItem><Label>vocal length: </Label>{props.voiceProfile.vocalLength}</FlexItem>
            <FlexItem><Label>pitch: </Label>{props.voiceProfile.pitch}</FlexItem>
            <FlexItem><Label>rate: </Label>{props.voiceProfile.rate}</FlexItem> 
        </FlexContainer>}
    </OuterDiv>
}

const TopRow = styled.div`
    
`
const ClearFloat= styled.div`
    clear: both;
`

const NameSpan=styled.span<{compactMode: boolean}>`
    font-weight: bold;
    line-height: 17px;
    ${props => props.compactMode && css`
    line-height: 12px;
    font-size: 10px;
    
  `}
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