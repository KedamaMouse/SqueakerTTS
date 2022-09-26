import { BrowserWindow, dialog, MenuItem, MenuItemConstructorOptions } from "electron";
import { ipcFromMainChannels } from "./ICommonInterfaces";

export function GetMenuTemplate(window: BrowserWindow): Array<(MenuItemConstructorOptions) | (MenuItem)> 
{
    const send=(channel: ipcFromMainChannels, ...args: any[]) =>
    {
        window.webContents.send(channel,...args);
    }


    return [
        {
            label: 'File',
            submenu: [
                {label: 'Import from clipboard', click: ()=>{send(ipcFromMainChannels.import)}},
                {label: 'Export to clipboard', click: ()=>{send(ipcFromMainChannels.export)}},
                {label: 'Reset all to default', click: ()=>{send(ipcFromMainChannels.restoreDefaults)}},
            ]
        },
        {
            label: 'Settings',
            submenu: [
                {label: 'Set start speaking hook(executable)', click: ()=>{
                    const file=dialog.showOpenDialogSync(window,{properties: ['openFile']});
                    if(file.length >0){
                        send(ipcFromMainChannels.startCommandSet,file[0]);
                    }
                }},
                {label: 'Set stop speaking hook(executable)', click: ()=>{
                    const file=dialog.showOpenDialogSync(window,{properties: ['openFile']});
                    if(file.length >0){
                        send(ipcFromMainChannels.stopCommandSet,file[0]);
                    }
                }}
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
