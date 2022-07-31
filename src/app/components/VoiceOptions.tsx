import * as React from 'react';
import { IElectrionAPI, ITTSRequest } from '../../preload';

import { VoiceList } from './VoiceList';
import { parseIntSetting, Slider, VolumeSlider } from './Sliders';

interface IVoiceOptions
{
    electronAPI : IElectrionAPI;
    voiceSetting: ITTSRequest;
    setVoiceSetting: (value: ITTSRequest) =>void;
}

const vocalLengthMin=50;
const vocalLengthMax=200;
const rateMin=20;
const rateMax=200;
const pitchMin=-50;//not sure these are accurate for pitch, didn't find these bounds documented.
const pitchMax=50;


export const VoiceOptions:React.FC<IVoiceOptions> = (props) => {
    
    if(!props.voiceSetting)
    {
        props.setVoiceSetting({
            vocalLength: parseIntSetting("VocalLength",vocalLengthMin,vocalLengthMax,100),
            pitch: parseIntSetting("pitch",pitchMin,pitchMax,0),
            rate: parseIntSetting("rate",rateMin,rateMax,100),
            text: "",
        });
        return <></>
    }

    const onVocalLengthChange = React.useCallback((value: number)=>
    {
        window.localStorage.setItem("VocalLength",value.toString());

        const newSettings={...props.voiceSetting}        
        newSettings.vocalLength=value;
        props.setVoiceSetting(newSettings);

    },[props.voiceSetting]);

    const onPitchChange = React.useCallback((value: number)=>
    {
        window.localStorage.setItem("pitch",value.toString());

        const newSettings={...props.voiceSetting}
        newSettings.pitch=value;
        props.setVoiceSetting(newSettings);

    },[props.voiceSetting]);

    const onRateChange = React.useCallback((value: number)=>
    {
        window.localStorage.setItem("rate",value.toString());

        const newSettings={...props.voiceSetting}
        newSettings.rate=value;
        props.setVoiceSetting(newSettings);

    },[props.voiceSetting]);

    return <>                
        <VoiceList electronAPI={props.electronAPI} />
        <VolumeSlider electronAPI={props.electronAPI} /> 
        <Slider min={vocalLengthMin} max={vocalLengthMax} value={props.voiceSetting.vocalLength} setValue={onVocalLengthChange} label={"Vocal Length"}/>
        <Slider min={pitchMin} max={pitchMax} value={props.voiceSetting.pitch} setValue={onPitchChange} label='pitch'/>
        <Slider min={rateMin} max={rateMax} value={props.voiceSetting.rate} setValue={onRateChange} label='rate'/>
    </>
}