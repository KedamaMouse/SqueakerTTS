import * as React from 'react';
import styled from 'styled-components';
import { IVoiceProfile } from "../../../../ICommonInterfaces";
import { IElectrionAPI } from '../../../../mainElectronProcess/preload';
import { IVoiceInfo } from './VoiceOptions';

interface IVoiceListProps
{
    electronAPI : IElectrionAPI;
    voiceProfile: IVoiceProfile;
    setvoiceProfile: (value: IVoiceProfile) =>void;
    voices: Array<IVoiceInfo>;
}

export const VoiceList:React.FC<IVoiceListProps> = (props) =>
{
    const [vendor, setVendor] = React.useState<string>("");
    const [locale,setLocale] = React.useState<string>("");

    const voiceInfo=props.voices.find((value: IVoiceInfo)=>{
        return (value.name === props.voiceProfile.voice);
    });

    const voiceChangedHandler: React.ChangeEventHandler<HTMLSelectElement> = (event): void=>{
        props.setvoiceProfile({...props.voiceProfile, "voice": event.target.value});
    };
    const filterChangedHandler = (ComparisonValue: string, setValue: React.Dispatch<React.SetStateAction<string>>,event :React.ChangeEvent<HTMLSelectElement>): void=>{
        const newValue=event.target.value;
        setValue(newValue);
        if(newValue && newValue !== ComparisonValue)
        {
            props.setvoiceProfile({...props.voiceProfile, "voice": ""});
        }
    };

    //obtain filter lists
    const [vendorList,localeList] =React.useMemo(()=>{
        const vendorList: string[]=[];
        const localeList: string[]=[];
        for(const voice of props.voices)
        {
            if(vendorList.indexOf(voice.vendor)<0)
            {
                vendorList.push(voice.vendor);
            }
            if(localeList.indexOf(voice.cultureDisplayName)<0)
            {
                localeList.push(voice.cultureDisplayName);
            }
        }
        vendorList.sort();
        localeList.sort();
        return [vendorList,localeList]
    }
    ,[props.voices]);

    const VendorOptions = vendorList.map((value: string) => {
        return <option key={value} value={value}>{value}</option>
    });
    VendorOptions.unshift(<option value="" key="None">[Vendor]</option>);

    const LocaleOptions = localeList.map((value: string) => {
        return <option key={value} value={value}>{value}</option>
    });
    LocaleOptions.unshift(<option value="" key="None">[Locale]</option>)

    //Voices matching current filters
    const VoiceOptions = props.voices.reduce((result,voice)=>
    {
        if(vendor && voice.vendor !== vendor){return result;}
        if(locale && voice.cultureDisplayName !== locale){return result;}

        result.push(<option value={voice.name} key={voice.id}>{voice.description}</option>);
        return result;
    },[]);

    //user filtered options to exclude currently selected voice. select first option in the list.
    React.useEffect(()=>{
        if(props.voiceProfile.voice ==="")
        {
            if(VoiceOptions.length > 0){
                props.setvoiceProfile({...props.voiceProfile, "voice": VoiceOptions[0].props.value});
            }
        }
    });

    //voice changed to one no longer matching current filters. clear filters that don't match new voice.
    React.useEffect(()=>{

        if(voiceInfo && vendor && voiceInfo.vendor !== vendor){
            setVendor("");
        }
        if(voiceInfo && locale && voiceInfo.cultureDisplayName !== locale)
        {
            setLocale("");
        }

    },[voiceInfo?.vendor, voiceInfo?.cultureDisplayName]);

    
    return <div>
        <Select onChange={filterChangedHandler.bind(undefined,voiceInfo?.vendor,setVendor)} value={vendor}>{VendorOptions}</Select>
        <Select onChange={filterChangedHandler.bind(undefined,voiceInfo?.cultureDisplayName,setLocale)} value={locale}>{LocaleOptions}</Select>
        <Select onChange={voiceChangedHandler} value={props.voiceProfile.voice}>{VoiceOptions}</Select>
    </div>;
}

const Select=styled.select`
    margin-bottom: 2px;
    background-color: ${props => props.theme.editBackColor};
`