import {useState} from 'react';

function WsConnect(props) {
    const [ws, setWs] = useState();
    function connect(url) {
        const ws = new WebSocket(url);
        return ws;
    }
    return (
        <div className='WsConnect'></div>
    )
}