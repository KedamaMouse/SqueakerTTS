import * as React from 'react';
import { IElectrionAPI, IVoiceProfile } from "../../../ICommonInterfaces";
import { IVoice } from './VoiceOptions';



interface IVoiceListProps
{
    electronAPI : IElectrionAPI;
    voiceProfile: IVoiceProfile;
    setvoiceProfile: (value: IVoiceProfile) =>void;
    voices: Array<IVoice>;
}

export const VoiceList:React.FC<IVoiceListProps> = (props) =>
{
    const changeHandler:React.ChangeEventHandler<HTMLSelectElement> = (event): void=>{
        props.setvoiceProfile({...props.voiceProfile, "voice": event.target.value});
    };

    const options = props.voices?.map((voice)=>
    {
        return <option value={voice.name} key={voice.id}>{voice.description}</option>
    });
    if(options && props.voiceProfile.voice ==="")
    {
        props.setvoiceProfile({...props.voiceProfile, "voice": options[0].props.value});
    }

    return <select onChange={changeHandler} value={props.voiceProfile.voice}>{options}</select>;
}

