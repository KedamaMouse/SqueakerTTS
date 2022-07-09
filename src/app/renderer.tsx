import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {App} from "./components/App";
import { IElectrionAPI } from '../preload';

const electronAPI = (window as any).electronAPI as IElectrionAPI;
ReactDOM.render(<App electronAPI={electronAPI}/>, document.getElementById('renderer'));