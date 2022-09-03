import * as React from 'react';
import styled from 'styled-components';

export const Instructions:React.FC = () => {
    return <OuterDiv>
        w(text) to whipser <br/>
        ee(text) for strong emphasis <br/>
        e(text) for modorate emphasis <br/>
        r(text) for reduced emphasis <br/>
        s(text) for soft phonation <br/>


    </OuterDiv>
}

const OuterDiv= styled.div`
    margin-top: 10px;
    color: ${props => props.theme.appBackTextColor};
    border-width: 2px;
    border-style: solid;
    border-radius: 10px;
    border-color: ${props => props.theme.editBackColor};
    padding: 4px;
`
