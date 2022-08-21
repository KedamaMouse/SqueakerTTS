import * as React from 'react';
import ReactSlider from 'react-slider';
import styled from 'styled-components';
import { IElectrionAPI } from "../../../ICommonInterfaces";

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
    return <SliderContainer>
        <label>{props.label}</label>
        <StyledSlider><ReactSlider value={props.value} onAfterChange={props.setValue}
        renderTrack={(props, state) => <div {...props}><TrackDiv></TrackDiv></div>}
    renderThumb={(props, state) => <div {...props}><ThumbDiv>{state.valueNow}</ThumbDiv></div>} min={props.min} max={props.max} /></StyledSlider>
    </SliderContainer>   
}

const SliderContainer= styled.div`
    display: flex;
`

const StyledSlider= styled.div`
    flex-grow: 1;
    margin-left: 10px;
`
const ThumbDiv = styled.div`
    background-color: ${props => props.theme.sliderThumbBackColor};
    color: ${props => props.theme.sliderThumbTextColor};
    border-radius: 25px;
`
const TrackDiv = styled.div`
    height: 10px;
    margin-top: 5px;
    background-color:  ${props => props.theme.editBackColor};
`



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