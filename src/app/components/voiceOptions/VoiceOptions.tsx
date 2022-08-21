import * as React from 'react';
import { IElectrionAPI, IVoiceProfile, pitchMax, pitchMin, rateMax, rateMin, vocalLengthMax, vocalLengthMin } from "../../../ICommonInterfaces";

import { VoiceList } from './VoiceList';
import {Slider, VolumeSlider } from './Sliders';
import { SaveAsButton } from './SaveAsButton';

interface IVoiceOptions
{
    electronAPI : IElectrionAPI;
    voiceProfile: IVoiceProfile;
    setvoiceProfile: (value: IVoiceProfile) =>void;
    setNeedToAssignFocus : (value: boolean)=> void;
}

export const VoiceOptions:React.FC<IVoiceOptions> = (props) => {
    
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

    if(!props.voiceProfile){return <></>}

    return <>                
        <VoiceList electronAPI={props.electronAPI} voiceProfile={props.voiceProfile} setvoiceProfile={props.setvoiceProfile}/>
        <VolumeSlider electronAPI={props.electronAPI} /> 
        <Slider min={vocalLengthMin} max={vocalLengthMax} value={props.voiceProfile.vocalLength} setValue={onVocalLengthChange} label={"Vocal Length"}/>
        <Slider min={pitchMin} max={pitchMax} value={props.voiceProfile.pitch} setValue={onPitchChange} label='pitch'/>
        <Slider min={rateMin} max={rateMax} value={props.voiceProfile.rate} setValue={onRateChange} label='rate'/>
        <SaveAsButton setvoiceProfile={props.setvoiceProfile} voiceProfile={props.voiceProfile} setNeedToAssignFocus={props.setNeedToAssignFocus}></SaveAsButton>
    </>
}