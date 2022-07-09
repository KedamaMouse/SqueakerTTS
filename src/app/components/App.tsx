
import * as React from 'react';
import { IElectrionAPI } from '../../preload';

export const App = (props:{electronAPI : IElectrionAPI}) => {
    const [text,setText] = React.useState<string>("test");

    const handleChange:React.ChangeEventHandler<HTMLTextAreaElement> = React.useCallback((event)=>{
        setText(event.target.value);
    },[setText]);

    const buttonClick = React.useCallback(()=>
    {
        props.electronAPI.sendTTSCommand("speak",text);
        setText("");
    },[text]);  

    return <div><textarea value={text} onChange={handleChange} />
    <button onClick={buttonClick}>speak</button></div>;
};