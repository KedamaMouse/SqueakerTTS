import * as React from 'react';
import ReactSlider from 'react-slider';
import { IElectrionAPI } from '../../preload';

interface IVolumeSliderProps
{
    electronAPI : IElectrionAPI;
}
export const VolumeSlider:React.FC<IVolumeSliderProps> = (props) =>
{
    const [volume,setVolume]= React.useState<number>(parseVolume());

    React.useEffect(()=>
    {
        props.electronAPI.sendTTSCommand("setVolume",volume.toString());
        window.localStorage.setItem("volume",volume.toString());
    },[volume]);

    const changeCallback= React.useCallback((value: number): void=>{
        setVolume(value);
    },[setVolume]);

    return <ReactSlider value={volume} onAfterChange={changeCallback} trackClassName='volumeSliderTrack' thumbClassName='volumeSliderThumb'
    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
    />;

}

function parseVolume(): number
{
    let volume=parseInt(window.localStorage.getItem("volume"));
    if(isNaN(volume))
    {
        volume=100;
    }
    else if(volume < 0)
    {
        volume = 0;
    }
    else if (volume > 100)
    {
        volume = 100;
    }

    return volume;
}