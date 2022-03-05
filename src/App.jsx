import React, {useState, useRef} from 'react';
import './App.css';
import DrawPad128 from './components/DrawPad128/DrawPad128.jsx';
import Console from './components/Console/Console';
import serde from './message/request';
import deserde from './message/responde';
import {MsgSetColorOk} from './components/Console/MsgTemplates.jsx'
// import ChatBox from './components/ChatBox/ChatBox.jsx';
function App() {
    const [color, setColor] = useState('#ff3333');
    const [ws, setWs] = useState(undefined);

    const [cmdHistory, setCmdHistory] = useState([]);
    const [consoleItems, setConsoleItems] = useState([]);


    /**
     * 
     * @param {string} message 
     */
    function consoleEnter(message) {
        let consoleItemsBuffer = [];
        if(message.startsWith('/')) {
            consoleItemsBuffer.push('console> ' + message);
            let paras = message.split(/\s+/);
            switch(paras[0]) {
                case '/sc':{
                    let color = paras[1];
                    if(/#[0-9|a-f|A-F]{6}/.test(color)) {
                        setColor(color);
                        consoleItemsBuffer.push(<MsgSetColorOk color={color}/>);
                    } else {
                        consoleItemsBuffer.push('sc> unrecognized color');
                    }
                    break;
                }
                case '/help': {
                    break;
                }
                case '/con': {
                    let url = paras[1];
                    let ws = new WebSocket(url);
                    ws.binaryType = 'arraybuffer';
                    ws.onopen = (evt) => {
                        let localConsoleItemsBuffer = [];
                        let msg = ('con> connected to ' + ws.url);
                        setConsoleItems((consoleItems)=> [...consoleItems, msg]);
                    }
                    
                    ws.onmessage = (evt) => {
                        console.log(evt.data);
                        let resp = deserde(evt.data);
                        console.log(resp);
                        switch (resp.tag) {
                            case 'loginSuccess':
                                let msg = 'server> loginsuccess, your index is' + resp.body.idx;
                                setConsoleItems((consoleItems)=> [...consoleItems, msg]);
                                break;
                            case 'chat': {
                                let msg = resp.body.sender + ': ' + resp.body.msg;
                                setConsoleItems((consoleItems)=> [...consoleItems, msg]);
                                break;
                            }
                            default:
                                break;
                        }
                    }

                    setWs(ws);
                    break;
                }
                case '/login': {
                    if (paras[1]===undefined) {
                        break;
                    }
                    if (ws) {
                        const key = new Uint8Array(8);
                        key[0] = 0xbf;
                        key[7] = 0xbf;
                        let bin = serde({
                            tag: 'login',
                            key: key,
                            body: {
                                name: paras[1]
                            }
                        });
                        console.log(new Uint8Array(bin));
                        ws.send(bin);
                        consoleItemsBuffer.push('login> your name is ' + paras[1]);
                    }

                    break;
                }
                case '/logout': {
                    if (ws) {
                        ws.close();
                        consoleItemsBuffer.push('logout> connect closed');
                    } else {
                        consoleItemsBuffer.push('logout> warn: no connection');
                    }
                    break;
                }
                default: {
                    consoleItemsBuffer.push('console> unknown command: ' + paras[0]);
                    break;
                }
            }
        } else {
            const key = new Uint8Array(8);
            key[0] = 0xbf;
            key[7] = 0xbf;
            const req_bin = serde({
                tag: 'chat',
                key: key,
                body: {
                    msg: message,
                }
            });
            console.log(new Uint8Array(req_bin));
            if (ws) {
                ws.send(req_bin);
                consoleItemsBuffer.push('me: ' + message);
            }
        }
        setConsoleItems(consoleItems.concat(consoleItemsBuffer));
    }

    
    return (
        <div className="App">
            <DrawPad128 color = {color}/>
            <Console
            items = {consoleItems}
            onConsoleEnter = {consoleEnter}
            ></Console>
        </div>
    )
    
}

export default App; 
