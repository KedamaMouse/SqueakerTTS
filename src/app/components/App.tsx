
import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { IElectrionAPI, ipcToMainChannels, IVoiceProfile } from "../../ICommonInterfaces";
import { ITheme } from '../theme';
import { DataManager } from './DataManager';
import { TTSInputField } from './inputField/TTSInputField';
import { Instructions } from './instructions';
import { VoiceOptions } from './voiceOptions/VoiceOptions';
import { VoiceProfileSelect } from './VoiceProfileSelect';

interface IAppProps
{
    electronAPI : IElectrionAPI;
}

export const App:React.FC<IAppProps> = (props) => {
   
    const dataManager=React.useState<DataManager>(new DataManager())[0];

    //State that's saved, keep up to date references in datamanager object.
    const [activeVoiceKey, setActiveVoiceKey] = React.useState<string>();
    dataManager.activeVoiceKey=activeVoiceKey; 
    dataManager.setActiveVoiceKey=setActiveVoiceKey;
    const [voiceProfiles, setVoiceProfiles] = React.useState<{[key: string]: IVoiceProfile}>();
    dataManager.voiceProfiles=voiceProfiles;
    dataManager.setVoiceProfiles=setVoiceProfiles;

    //Transient state
    const [needToAssignFocus,setNeedToAssignFocus] = React.useState<boolean>(false);

    //Load and save data
    React.useEffect(()=>{
        if(!activeVoiceKey){
            dataManager.LoadData();
        }
        else{
            //data exists and changed, save
            dataManager.SaveData();
        }
    },[activeVoiceKey, JSON.stringify(voiceProfiles)]);
    
    //import/export/clear data
    React.useEffect(()=>{
        const removeListener=props.electronAPI.on(ipcToMainChannels.export,dataManager.ExportToClipboard.bind(dataManager));
        return removeListener;
    },[]);
    React.useEffect(()=>{
        const removeListener=props.electronAPI.on(ipcToMainChannels.import,dataManager.ImportFromClipboard.bind(dataManager));
        return removeListener;
    },[]);
    React.useEffect(()=>{
        const removeListener=props.electronAPI.on(ipcToMainChannels.restoreDefaults,dataManager.RestoreDefaults.bind(dataManager));
        return removeListener;
    },[]);


    const theme: ITheme = {
        editBackColor:  "rgb(247, 217, 247)",
        appBackTextColor: "white",
        appBackColor:"rgb(159, 109, 159)",
        sliderThumbBackColor: "rgb(78, 113, 85)",
        sliderThumbTextColor: "white",
        labelTextColor: "rgb(72,72,72)",
        selectedBorderColor: "rgb(72,255,10)",
        errorColor: "#f1ff3b"
      };

    const voiceProfile= voiceProfiles ? voiceProfiles[activeVoiceKey] : null;

    return  voiceProfiles ? <ThemeProvider theme={theme}>
                <OuterDiv> 
                    <MainPane>
                        <TTSInputField electronAPI={props.electronAPI} voiceProfile={voiceProfile} setNeedToAssignFocus={setNeedToAssignFocus} takeFocus={needToAssignFocus} />
                        <VoiceOptions electronAPI={props.electronAPI} voiceProfile={voiceProfile} 
                            setvoiceProfile={dataManager.updateVoiceProfile.bind(dataManager)} setNeedToAssignFocus={setNeedToAssignFocus}/>
                        <Instructions electronAPI={props.electronAPI}/>
                    </MainPane>
                    <SidePane>
                        <VoiceProfileSelect activeVoiceKey={activeVoiceKey} voiceProfiles={voiceProfiles} setActiveVoiceProfile={setActiveVoiceKey} 
                            removeVoiceProfile={dataManager.removeVoiceProfile.bind(dataManager)}/>
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
      flex-grow: 0;
      flex-basis: 300px;
      margin-right: 10px;

`
const SidePane=styled.div`
    flex-grow: 1;
    overflow-y: auto;
    height: 100%;
`