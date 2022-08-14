import * as React from 'react';
import styled from 'styled-components';
import { IVoiceProfile } from '../../ICommonInterfaces';

interface ISaveAsButtonProps
{
    voiceProfile: IVoiceProfile;
    setvoiceProfile: (value: IVoiceProfile) =>void;
}

export const SaveAsButton:React.FC<ISaveAsButtonProps> = (props) => {
    const [startedSaving,setStartedSaving] = React.useState<boolean>(false);
    const [newName,SetNewName] = React.useState<string>("");
    
    const toggleSaving = React.useCallback(()=>
    {
        SetNewName("");
        setStartedSaving(!startedSaving);
    },[startedSaving]);

    const onSubmit:React.FormEventHandler = React.useCallback((e)=>{
        props.setvoiceProfile({...props.voiceProfile, key:newName });
        setStartedSaving(false);
        e.preventDefault();
    },[newName,props.setvoiceProfile,props.voiceProfile]);

    const onChange:React.ChangeEventHandler<HTMLInputElement> = React.useCallback((e)=>{
        SetNewName(e.target.value);
    },[SetNewName])

    if(startedSaving)
    {
        return <>
        <form onSubmit={onSubmit}>
            <input type="text" value={newName} onChange={onChange} autoFocus />
        </form>
        <Button onClick={toggleSaving}>Cancel</Button></>
    }
    else{
        return <>
            <Button onClick={toggleSaving}>Save As</Button>
        </>
    }
}

const Button = styled.button`

`;