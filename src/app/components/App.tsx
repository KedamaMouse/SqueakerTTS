
import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { IElectrionAPI, ipcFromMainChannels } from "../../ICommonInterfaces";
import { defaultTheme } from '../theme';
import { useDataManager } from './DataManager';
import { TTSInputField } from './inputField/TTSInputField';
import { Instructions } from './instructions';
import { Settings } from './Settings';
import { VoiceOptions } from './voiceOptions/VoiceOptions';
import { VoiceProfileSelect } from './VoiceProfileSelect';

interface IAppProps
{
    electronAPI : IElectrionAPI;
}

export const App:React.FC<IAppProps> = (props) => {
   
    const dm=useDataManager(props.electronAPI);

    //Transient state
    const [needToAssignFocus,setNeedToAssignFocus] = React.useState<boolean>(false);

    //Load and save data
    React.useEffect(()=>{
        if(!dm.activeVoiceKey){
            dm.LoadData();
        }
        else{
            //data exists and changed, save
            dm.SaveData();
        }
    },[dm.activeVoiceKey, JSON.stringify(dm.voiceProfiles),dm.startCommand,dm.stopCommand]);
    
    //import/export/clear data
    React.useEffect(()=>{
        const removeListener=props.electronAPI.on(ipcFromMainChannels.export,dm.ExportToClipboard.bind(dm));
        return removeListener;
    },[]);
    React.useEffect(()=>{
        const removeListener=props.electronAPI.on(ipcFromMainChannels.import,dm.ImportFromClipboard.bind(dm));
        return removeListener;
    },[]);
    React.useEffect(()=>{
        const removeListener=props.electronAPI.on(ipcFromMainChannels.restoreDefaults,dm.RestoreDefaults.bind(dm));
        return removeListener;
    },[]);

    React.useEffect(()=>{
        const removeListener=props.electronAPI.on(ipcFromMainChannels.startCommandSet,(_event: Electron.IpcRendererEvent, value: string)=>{
            dm.setStartCommand(value);
        });
        return removeListener;
    },[]);

    React.useEffect(()=>{
        const removeListener=props.electronAPI.on(ipcFromMainChannels.stopCommandSet,(_event: Electron.IpcRendererEvent, value: string)=>{
            dm.setStopCommand(value);
        });
        return removeListener;
    },[]);

    const voiceProfile= dm.voiceProfiles ? dm.voiceProfiles[dm.activeVoiceKey] : null;

    return  dm.voiceProfiles ? <ThemeProvider theme={defaultTheme}>
                <OuterDiv> 
                    <MainPane>
                        <TTSInputField electronAPI={props.electronAPI} voiceProfile={voiceProfile} setNeedToAssignFocus={setNeedToAssignFocus} takeFocus={needToAssignFocus} />
                        <VoiceOptions electronAPI={props.electronAPI} voiceProfile={voiceProfile} 
                            setvoiceProfile={dm.updateVoiceProfile.bind(dm)} setNeedToAssignFocus={setNeedToAssignFocus}/>
                        <Instructions electronAPI={props.electronAPI}/>
                       <Settings dataManager={dm}/>
                    </MainPane>
                    <SidePane>
                        <VoiceProfileSelect activeVoiceKey={dm.activeVoiceKey} voiceProfiles={dm.voiceProfiles} setActiveVoiceProfile={dm.setActiveVoiceKey} 
                            removeVoiceProfile={dm.removeVoiceProfile.bind(dm)}/>
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