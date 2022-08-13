
import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { IData, IElectrionAPI, ipcToMainChannels, IVoiceProfile } from "../../ICommonInterfaces";
import { ITheme } from '../theme';
import { TTSInputField } from './TTSInputField';
import { VoiceOptions } from './VoiceOptions';
import { VoiceProfileSelect } from './VoiceProfileSelect';

interface IAppProps
{
    electronAPI : IElectrionAPI;
}

export const App:React.FC<IAppProps> = (props) => {
   
    const [data,setData]= React.useState<IData>(null);

    const voiceProfile= data?.voiceProfiles[data.activeVoiceKey];

    const updateVoiceProfile: (value: IVoiceProfile) => void = React.useCallback((value)=>
    {
        setData({...data,voiceProfiles:{...data?.voiceProfiles,[value.key]: value}, activeVoiceKey: value.key});

    },[data]);

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
    },[data]);
    
    //import/export/clear data
    React.useEffect(()=>{
        const removeListener=props.electronAPI.on(ipcToMainChannels.export,()=>{
            navigator.clipboard.writeText(JSON.stringify(data));
        });
        return removeListener;
    },[data]);

    React.useEffect(()=>{
        const removeListener=props.electronAPI.on(ipcToMainChannels.import,async ()=>{
            const newData=await navigator.clipboard.readText();
            if(newData){
                window.localStorage.setItem("Data",newData);
                setData(null);
            }
        });
        return removeListener;
    },[data]);

    React.useEffect(()=>{
        const removeListener=props.electronAPI.on(ipcToMainChannels.restoreDefaults,()=>{
            window.localStorage.removeItem("Data");
            setData(null);
        });
        return removeListener;
    },[data]);


    const theme: ITheme = {
        editBackColor:  "rgb(247, 217, 247)",
        appBackColor:"rgb(159, 109, 159)",
        sliderThumbBackColor: " rgb(78, 113, 85)",
        sliderThumbTextColor: "white",
      };

    return  data ? <ThemeProvider theme={theme}>
                <OuterDiv> 
                    <MainPane>
                        <TTSInputField electronAPI={props.electronAPI} voiceProfile={voiceProfile} />
                        <VoiceOptions electronAPI={props.electronAPI} voiceProfile={voiceProfile} setvoiceProfile={updateVoiceProfile}/>
                    </MainPane>
                    <SidePane>
                        <VoiceProfileSelect data={data}></VoiceProfileSelect>
                    </SidePane>
                </OuterDiv>
            </ThemeProvider> : null;
    
};

const OuterDiv= styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    background-color: ${props => props.theme.appBackColor};
    padding: 8px;
    box-sizing: border-box;
`
const MainPane=styled.div`
      flex-grow: 1;
`
const SidePane=styled.div`
    flex-shrink: 1;
`