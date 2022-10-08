export interface ITheme
{
    editBackColor: string;
    appBackColor: string;
    appBackTextColor: string;
    sliderThumbBackColor: string;
    sliderThumbTextColor: string;
    labelTextColor: string;
    selectedBorderColor: string;
    errorColor: string;
    linkTextColor: string;
}

export const defaultTheme: ITheme = {
    editBackColor:  "#F7D9F7",
    appBackTextColor: "white",
    appBackColor:"#704870",
    sliderThumbBackColor: "rgb(78, 113, 85)",
    sliderThumbTextColor: "white",
    labelTextColor: "rgb(72,72,72)",
    selectedBorderColor: "rgb(72,255,10)",
    errorColor: "#f1ff3b",
    linkTextColor: "#F7D9F7",
  };