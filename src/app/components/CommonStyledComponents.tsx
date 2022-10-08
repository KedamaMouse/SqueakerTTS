import styled from "styled-components";

export const Label= styled.label`
    color: ${props => props.theme.appBackTextColor};
`

export const Checkbox = styled.input`
    accent-color:${props => props.theme.editBackColor};
    vertical-align: middle;
`

export const SectionDiv= styled.div`
    margin-top: 10px;
    color: ${props => props.theme.appBackTextColor};
    border-width: 2px;
    border-style: solid;
    border-radius: 10px;
    border-color: ${props => props.theme.editBackColor};
    padding: 4px;
    font-size: 12px;
`

export const Button = styled.button`
    float: right;
    font-size: 10px;
`
export const LinkButton = styled.button`
    background-color: transparent;
    border: none;
    color: ${props => props.theme.appBackTextColor};
    font-size: inherit;
    &:hover, &:focus
    {
        text-decoration: underline;
    }
`