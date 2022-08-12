import * as React from 'react';
import ReactSlider from 'react-slider';
import { IElectrionAPI } from "../../ICommonInterfaces";

interface IVolumeSliderProps
{
    electronAPI : IElectrionAPI;
}
export const VolumeSlider:React.FC<IVolumeSliderProps> = (props) =>
{
    const [volume,setVolume]= React.useState<number>(parseIntSetting("volume",0,100,100));

    React.useEffect(()=>
    {
        props.electronAPI.sendTTSCommand("setVolume",volume.toString());
        window.localStorage.setItem("volume",volume.toString());
    },[volume]);
    
    return <Slider label='Volume' min={0} max={100} setValue={setVolume} value={volume}/>
}

interface ISliderProps
{
    value: number,
    setValue: (value: number)=>void,
    min: number,
    max: number,
    label: string

}

export const Slider:React.FC<ISliderProps> = (props) =>
{
    return <div className='sliderContainer'><label>{props.label}</label><ReactSlider value={props.value} onAfterChange={props.setValue} className='sliderSlider' trackClassName='volumeSliderTrack' thumbClassName='volumeSliderThumb'
    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>} min={props.min} max={props.max} /></div>   
}


export function parseIntSetting(key: string, min: number, max: number, initialValue: number): number
{
    let value=parseInt(window.localStorage.getItem(key));
    if(isNaN(value))
    {
        value=initialValue;
    }
    else if(value < min)
    {
        value = min;
    }
    else if (value > max)
    {
        value = max;
    }

    return value;
}