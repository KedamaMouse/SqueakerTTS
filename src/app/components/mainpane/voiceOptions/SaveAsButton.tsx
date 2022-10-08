import * as React from 'react';
import styled from 'styled-components';
import { IVoiceProfile } from '../../../../ICommonInterfaces';

interface ISaveAsButtonProps
{
    voiceProfile: IVoiceProfile;
    setvoiceProfile: (value: IVoiceProfile) =>void;
    setNeedToAssignFocus : (value: boolean)=> void;
}

export const SaveAsButton:React.FC<ISaveAsButtonProps> = (props) => {
    const [startedSaving,setStartedSaving] = React.useState<boolean>(false);
    const [newName,SetNewName] = React.useState<string>("");
    
    const toggleSaving = React.useCallback(()=>
    {
        SetNewName("");
        setStartedSaving(!startedSaving);
        if(startedSaving)
        {
            props.setNeedToAssignFocus(true);
        }
        
    },[startedSaving]);

    const onSubmit:React.FormEventHandler = React.useCallback((e)=>{
        props.setvoiceProfile({...props.voiceProfile, key:newName });
        setStartedSaving(false);
        e.preventDefault();
        props.setNeedToAssignFocus(true);
    },[newName,props.setvoiceProfile,props.voiceProfile]);

    const onChange:React.ChangeEventHandler<HTMLInputElement> = React.useCallback((e)=>{
        SetNewName(e.target.value);
    },[SetNewName])

    if(startedSaving)
    {
        return <OuterDiv>
            <NameForm onSubmit={onSubmit}>
                <input type="text" value={newName} onChange={onChange} autoFocus />
            </NameForm>
            <Button onClick={toggleSaving}>Cancel</Button>
        </OuterDiv>
    }
    else{
        return <OuterDiv>
            <Button onClick={toggleSaving} accessKey="a">Save <UnderLine>A</UnderLine>s</Button>
        </OuterDiv>
    }
}

const OuterDiv= styled.div`
    margin-top: 4px;
`

const Button = styled.button`
`;

const UnderLine = styled.span`
    text-decoration: underline;
`


const NameForm = styled.form`
    display: inline;
`