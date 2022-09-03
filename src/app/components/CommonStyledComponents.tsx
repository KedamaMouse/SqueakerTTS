import styled from "styled-components";

export const Label= styled.label`
    color: ${props => props.theme.appBackTextColor};
`

export const Checkbox = styled.input`
    accent-color:${props => props.theme.editBackColor};
    vertical-align: middle;
`