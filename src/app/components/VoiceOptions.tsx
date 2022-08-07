import * as React from 'react';
import { IElectrionAPI, ITTSRequest, IVoiceProfile } from "../../ICommonInterfaces";

import { VoiceList } from './VoiceList';
import { parseIntSetting, Slider, VolumeSlider } from './Sliders';

interface IVoiceOptions
{
    electronAPI : IElectrionAPI;
    voiceProfile: IVoiceProfile;
    setvoiceProfile: (value: IVoiceProfile) =>void;
}

const vocalLengthMin=50;
const vocalLengthMax=200;
const rateMin=20;
const rateMax=200;
const pitchMin=-50;//not sure these are accurate for pitch, didn't find these bounds documented.
const pitchMax=50;


export const VoiceOptions:React.FC<IVoiceOptions> = (props) => {
    

    React.useEffect(()=>{
        if(!props.voiceProfile)
        {
            props.setvoiceProfile({
                vocalLength: parseIntSetting("VocalLength",vocalLengthMin,vocalLengthMax,100),
                pitch: parseIntSetting("pitch",pitchMin,pitchMax,0),
                rate: parseIntSetting("rate",rateMin,rateMax,100),
                key:"default",
                voice:""
            });
        }});

    const onVocalLengthChange = React.useCallback((value: number)=>
    {
        window.localStorage.setItem("VocalLength",value.toString());

        const newSettings={...props.voiceProfile}        
        newSettings.vocalLength=value;
        props.setvoiceProfile(newSettings);

    },[props.voiceProfile]);

    const onPitchChange = React.useCallback((value: number)=>
    {
        window.localStorage.setItem("pitch",value.toString());

        const newSettings={...props.voiceProfile}
        newSettings.pitch=value;
        props.setvoiceProfile(newSettings);

    },[props.voiceProfile]);

    const onRateChange = React.useCallback((value: number)=>
    {
        window.localStorage.setItem("rate",value.toString());

        const newSettings={...props.voiceProfile}
        newSettings.rate=value;
        props.setvoiceProfile(newSettings);

    },[props.voiceProfile]);

    if(!props.voiceProfile){return <></>}

    return <>                
        <VoiceList electronAPI={props.electronAPI} />
        <VolumeSlider electronAPI={props.electronAPI} /> 
        <Slider min={vocalLengthMin} max={vocalLengthMax} value={props.voiceProfile.vocalLength} setValue={onVocalLengthChange} label={"Vocal Length"}/>
        <Slider min={pitchMin} max={pitchMax} value={props.voiceProfile.pitch} setValue={onPitchChange} label='pitch'/>
        <Slider min={rateMin} max={rateMax} value={props.voiceProfile.rate} setValue={onRateChange} label='rate'/>
    </>
}