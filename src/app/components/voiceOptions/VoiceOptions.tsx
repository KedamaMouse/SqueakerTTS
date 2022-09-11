import * as React from 'react';
import { IElectrionAPI, IVoiceProfile, pitchMax, pitchMin, rateMax, rateMin, vocalLengthMax, vocalLengthMin } from "../../../ICommonInterfaces";

import { VoiceList } from './VoiceList';
import {Slider, VolumeSlider } from './Sliders';
import { SaveAsButton } from './SaveAsButton';
import { Checkbox, Label } from '../CommonStyledComponents';

interface IVoiceOptions
{
    electronAPI : IElectrionAPI;
    voiceProfile: IVoiceProfile;
    setvoiceProfile: (value: IVoiceProfile) =>void;
    setNeedToAssignFocus : (value: boolean)=> void;
}

export interface IVoice
{

    name: string;
    id: string;
    description: string;
    supportsVocalLength: boolean;
    supportsPitch: boolean;
}

export const VoiceOptions:React.FC<IVoiceOptions> = (props) => {
    const [voices,setVoices] = React.useState<Array<IVoice>>();


    const onVocalLengthChange =(value: number)=>
    {
        props.setvoiceProfile({...props.voiceProfile, "vocalLength": value});
    };

    const onPitchChange = (value: number)=>
    {
        props.setvoiceProfile({...props.voiceProfile, "pitch": value});
    };

    const onRateChange = (value: number)=>
    {
        props.setvoiceProfile({...props.voiceProfile, "rate": value});
    };
    const onAutoBreathToggle= () =>
    {
        props.setvoiceProfile({...props.voiceProfile, "autoBreaths": !props.voiceProfile.autoBreaths});
    };

    if(!voices)
    {
        getVoices(props.electronAPI,setVoices);
    }

    if(!props.voiceProfile || !voices){return <></>}

    const voice=voices.find((value: IVoice)=>{
        return (value.name === props.voiceProfile.voice);
    });

    return voices ? <>                
        <VoiceList electronAPI={props.electronAPI} voiceProfile={props.voiceProfile} setvoiceProfile={props.setvoiceProfile} voices={voices}/>
        <VolumeSlider electronAPI={props.electronAPI} /> 
        {voice?.supportsVocalLength ? <Slider min={vocalLengthMin} max={vocalLengthMax} 
            value={props.voiceProfile.vocalLength} setValue={onVocalLengthChange} label={"Vocal Length"}/> : null}
        {voice?.supportsPitch ? <Slider min={pitchMin} max={pitchMax} 
            value={props.voiceProfile.pitch} setValue={onPitchChange} label='pitch'/> : null }
        <Slider min={rateMin} max={rateMax} value={props.voiceProfile.rate} setValue={onRateChange} label='rate'/>
        <SaveAsButton setvoiceProfile={props.setvoiceProfile} voiceProfile={props.voiceProfile} setNeedToAssignFocus={props.setNeedToAssignFocus}></SaveAsButton>
        <Label>auto breaths</Label><Checkbox type={"checkbox"} checked={!!props.voiceProfile.autoBreaths} onChange={onAutoBreathToggle} ></Checkbox>
    </> : null;
}

async function getVoices(electronAPI:IElectrionAPI,setVoices: React.Dispatch<(prevState: undefined) => undefined>)
{
    const voices =await electronAPI.sendTTSCommand("getVoices");
    setVoices(voices);
}