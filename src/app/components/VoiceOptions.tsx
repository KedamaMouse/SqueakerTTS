import * as React from 'react';
import { IElectrionAPI, IVoiceProfile, pitchMax, pitchMin, rateMax, rateMin, vocalLengthMax, vocalLengthMin } from "../../ICommonInterfaces";

import { VoiceList } from './VoiceList';
import {Slider, VolumeSlider } from './Sliders';

interface IVoiceOptions
{
    electronAPI : IElectrionAPI;
    voiceProfile: IVoiceProfile;
    setvoiceProfile: (value: IVoiceProfile) =>void;
}

export const VoiceOptions:React.FC<IVoiceOptions> = (props) => {
    
    const onVocalLengthChange = React.useCallback((value: number)=>
    {
        props.setvoiceProfile({...props.voiceProfile, "vocalLength": value});

    },[props.voiceProfile]);

    const onPitchChange = React.useCallback((value: number)=>
    {
        props.setvoiceProfile({...props.voiceProfile, "pitch": value});

    },[props.voiceProfile]);

    const onRateChange = React.useCallback((value: number)=>
    {
        props.setvoiceProfile({...props.voiceProfile, "rate": value});
    },[props.voiceProfile]);

    if(!props.voiceProfile){return <></>}

    return <>                
        <VoiceList electronAPI={props.electronAPI} voiceProfile={props.voiceProfile} setvoiceProfile={props.setvoiceProfile}/>
        <VolumeSlider electronAPI={props.electronAPI} /> 
        <Slider min={vocalLengthMin} max={vocalLengthMax} value={props.voiceProfile.vocalLength} setValue={onVocalLengthChange} label={"Vocal Length"}/>
        <Slider min={pitchMin} max={pitchMax} value={props.voiceProfile.pitch} setValue={onPitchChange} label='pitch'/>
        <Slider min={rateMin} max={rateMax} value={props.voiceProfile.rate} setValue={onRateChange} label='rate'/>
    </>
}