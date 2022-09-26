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
}

export const defaultTheme: ITheme = {
    editBackColor:  "rgb(247, 217, 247)",
    appBackTextColor: "white",
    appBackColor:"rgb(159, 109, 159)",
    sliderThumbBackColor: "rgb(78, 113, 85)",
    sliderThumbTextColor: "white",
    labelTextColor: "rgb(72,72,72)",
    selectedBorderColor: "rgb(72,255,10)",
    errorColor: "#f1ff3b"
  };