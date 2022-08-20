import { createRoot } from 'react-dom/client';
import * as React from 'react';
import {App} from "./components/App";
import { IElectrionAPI } from "../ICommonInterfaces";
import {configure} from 'react-hotkeys';

const electronAPI = (window as any).electronAPI as IElectrionAPI;
configure({ignoreTags:[]});

const root = createRoot(document.getElementById('renderer'));
root.render(<App electronAPI={electronAPI}/>);