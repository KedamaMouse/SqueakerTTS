
import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { IData, IElectrionAPI, ipcToMainChannels, IVoiceProfile } from "../../ICommonInterfaces";
import { ITheme } from '../theme';
import { TTSInputField } from './inputField/TTSInputField';
import { VoiceOptions } from './voiceOptions/VoiceOptions';
import { VoiceProfileSelect } from './VoiceProfileSelect';

interface IAppProps
{
    electronAPI : IElectrionAPI;
}

export const App:React.FC<IAppProps> = (props) => {
   
    const [data,setData]= React.useState<IData>(null);
    const [needToAssignFocus,setNeedToAssignFocus] = React.useState<boolean>(false);

    const voiceProfile= data?.voiceProfiles[data.activeVoiceKey];

    //this is not the best pattern, but fine as long as our data remains small.
    const datastring= JSON.stringify(data); 

    const updateVoiceProfile: (value: IVoiceProfile) => void = React.useCallback((value)=>
    {
        setData({...data,voiceProfiles:{...data?.voiceProfiles,[value.key]: value}, activeVoiceKey: value.key});

    },[datastring]);

    const setActiveVoiceProfile: (key: string) => void = React.useCallback((key)=>{
        setData({...data,voiceProfiles:{...data?.voiceProfiles}, activeVoiceKey: key});
    },[datastring]);

    const removeVoiceProfile:(key: string) => void = React.useCallback((key)=>{
        const newData = {...data,voiceProfiles:{...data?.voiceProfiles}};
        delete newData.voiceProfiles[key];
        setData(newData);
    },[datastring]);

    //Load and save data
    React.useEffect(()=>{
        if(!data){
            let loadedData=null;
            try{
                loadedData=JSON.parse(window.localStorage.getItem("Data"));
            }catch(e)
            {
                console.log("bad data:"+window.localStorage.getItem("Data"));
            }
            
            if(loadedData)
            {
                setData(loadedData);
            }
            else
            {
                //set default values
                updateVoiceProfile({
                    vocalLength: 100,
                    pitch: 0,
                    rate: 100,
                    key:"default",
                    voice:"",
                })
            }
        }
        else{
            //data exists and changed, save
            window.localStorage.setItem("Data",JSON.stringify(data));
        }
    },[datastring]);
    
    //import/export/clear data
    React.useEffect(()=>{
        const removeListener=props.electronAPI.on(ipcToMainChannels.export,()=>{
            navigator.clipboard.writeText(JSON.stringify(data));
        });
        return removeListener;
    },[datastring]);

    React.useEffect(()=>{
        const removeListener=props.electronAPI.on(ipcToMainChannels.import,async ()=>{
            const newData=await navigator.clipboard.readText();
            if(newData){
                window.localStorage.setItem("Data",newData);
                setData(null);
            }
        });
        return removeListener;
    },[datastring]);

    React.useEffect(()=>{
        const removeListener=props.electronAPI.on(ipcToMainChannels.restoreDefaults,()=>{
            window.localStorage.removeItem("Data");
            setData(null);
        });
        return removeListener;
    },[datastring]);


    const theme: ITheme = {
        editBackColor:  "rgb(247, 217, 247)",
        appBackColor:"rgb(159, 109, 159)",
        sliderThumbBackColor: "rgb(78, 113, 85)",
        sliderThumbTextColor: "white",
        labelTextColor: "rgb(72,72,72)",
        selectedBorderColor: "rgb(72,255,10)",
      };

    return  data ? <ThemeProvider theme={theme}>
                <OuterDiv> 
                    <MainPane>
                        <TTSInputField electronAPI={props.electronAPI} voiceProfile={voiceProfile} setNeedToAssignFocus={setNeedToAssignFocus} takeFocus={needToAssignFocus} />
                        <VoiceOptions electronAPI={props.electronAPI} voiceProfile={voiceProfile} 
                            setvoiceProfile={updateVoiceProfile} setNeedToAssignFocus={setNeedToAssignFocus}/>
                    </MainPane>
                    <SidePane>
                        <VoiceProfileSelect data={data} setActiveVoiceProfile={setActiveVoiceProfile} 
                            removeVoiceProfile={removeVoiceProfile}/>
                    </SidePane>
                </OuterDiv>
            </ThemeProvider> : null;
    
};

const OuterDiv= styled.div`
    display: flex;
    width: 100%;
    height: calc(100vh - 16px);
    background-color: ${props => props.theme.appBackColor};
    padding: 8px;
    box-sizing: border-box;
`
const MainPane=styled.div`
      flex-grow: 0;
      flex-basis: 300px;
      margin-right: 10px;

`
const SidePane=styled.div`
    flex-grow: 1;
    overflow-y: auto;
    height: 100%;
`