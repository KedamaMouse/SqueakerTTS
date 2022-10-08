
import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { ipcFromMainChannels } from "../../ICommonInterfaces";
import { IElectrionAPI } from '../../mainElectronProcess/preload';
import { defaultTheme } from './UI/theme';
import { useDataManager } from './DataManager';
import { TTSInputField } from './mainpane/inputField/TTSInputField';
import { Instructions } from './mainpane/Instructions';
import { Settings } from './mainpane/Settings';
import { VoiceOptions } from './mainpane/voiceOptions/VoiceOptions';
import { VoiceProfileSelect } from './sidepane/VoiceProfileSelect';

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
                       <Settings startCommand={dm.startCommand} setStartCommand={dm.setStartCommand.bind(dm)} stopCommand={dm.stopCommand} setStopCommand={dm.setStopCommand.bind(dm)} electronAPI={props.electronAPI}/>
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