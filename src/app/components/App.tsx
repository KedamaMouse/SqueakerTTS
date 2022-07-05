
import * as React from 'react';


import { ConnectionBuilder, Connection } from "electron-cgi";

export const App = () => {
    const [connection, setConnection] = React.useState<Connection>();

    if(!connection)
    {
        
        setConnection(new ConnectionBuilder().connectTo("dotnet", "run", "--project", "./core/Core").build());
    }

    return <div>Hello Mom!</div>;
};