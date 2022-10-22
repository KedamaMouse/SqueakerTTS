import styled,{ css } from "styled-components";

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

interface IButtonProps
{
    floatRight?: boolean;
    compactMode?: boolean;
}
export const Button = styled.button<IButtonProps>`
    font-size: 10px;
    ${props => props.floatRight && css`
        float: right;
    `}
    ${props => props.compactMode && css`
        padding: 0px;
        font-size: 8px;
    `}
`
export const LinkButton = styled.button`
    background-color: transparent;
    border: none;
    color: ${props => props.theme.linkTextColor};
    box-shadow: 1px 1px;
    font-size: inherit;
    &:hover, &:focus
    {
        filter: brightness(120%);
    }
`