import { BrowserWindow, MenuItem, MenuItemConstructorOptions } from "electron";

export function GetMenuTemplate(window: BrowserWindow): Array<(MenuItemConstructorOptions) | (MenuItem)> 
{
    return [
        {
            label: 'File',
            submenu: [
                {label: 'Import from clipboard', click: ()=>{window.webContents.send("import")}},
                {label: 'Export to clipboard', click: ()=>{window.webContents.send("export")}},
                {label: 'Reset all to default', click: ()=>{window.webContents.send("restoreDefaults")}},
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
