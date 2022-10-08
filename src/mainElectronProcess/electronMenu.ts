import { BrowserWindow, dialog, MenuItem, MenuItemConstructorOptions } from "electron";
import { ipcFromMainChannels } from "../ICommonInterfaces";
import { mainProcessBehavior } from "./mainProcessBehavior";

export function GetMenuTemplate(main: mainProcessBehavior): Array<(MenuItemConstructorOptions) | (MenuItem)> 
{
    return [
        {
            label: 'File',
            submenu: [
                {label: 'Import from clipboard', click: ()=>{main.send(ipcFromMainChannels.import)}},
                {label: 'Export to clipboard', click: ()=>{main.send(ipcFromMainChannels.export)}},
                {label: 'Reset all to default', click: ()=>{main.send(ipcFromMainChannels.restoreDefaults)}},
                       ]
        },
        {
            label: 'Settings',
            submenu: [
                {label: 'Set start speaking hook(executable)', click: ()=>{main.promptForStartCommand();}},
                {label: 'Set stop speaking hook(executable)', click: ()=>{main.promptForStopCommand();}}
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
    ];
}
