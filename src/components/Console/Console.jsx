import React, {useState} from 'react';
import './Console.css';

function InputArea(props) {
    const [message, setMessage] = useState('');

    function handleOnInput(evt) {
        setMessage(evt.target.value);
    }

    function handleOnKeyUp(evt) {
        if(evt.key === 'Enter') {
            handleOnSend();
        }
    }

    function handleOnSend() {
        props.onConsoleEnter(message);
        setMessage('');
    }

    return (
        <div className = "InputArea" >
            <input value = {message} onChange = {handleOnInput} onKeyUp={handleOnKeyUp} type="text"/>
            {/* <button onClick={handleOnSend}>send</button> */}
        </div>
    )
}

export default function Console(props) {
    return (
        <div className = "Console" align="left">
            <Output items = {props.items}></Output>
            <InputArea onConsoleEnter = {props.onConsoleEnter}></InputArea>
        </div>
    )
    
}

function Output(props) {
    let contents = [];
    props.items.forEach((item, idx) => {
        contents.push(<ConsoleItem key = {idx} content = {item}></ConsoleItem>)
    })
    return (
        <div className = 'Output'>
            {contents}
        </div>
    );
}

function ConsoleItem(props) {
    return (
        <div className = "ConsoleItem">
            {props.content}
        </div>
    );
} 