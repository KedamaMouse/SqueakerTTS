import { createRoot } from 'react-dom/client';
import * as React from 'react';
import {App} from "./components/App";
import { IElectrionAPI } from "../ICommonInterfaces";

const electronAPI = (window as any).electronAPI as IElectrionAPI;
const root = createRoot(document.getElementById('renderer'));
root.render(<App electronAPI={electronAPI}/>);