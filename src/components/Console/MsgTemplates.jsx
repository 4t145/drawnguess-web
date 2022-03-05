export function MsgSetColorOk(props) {
    return (
        <div className = "MsgSetColorOk">
            <span>sc&gt; set color </span><span style={{color: props.color, backgroundColor: 'white'}}>■{props.color}</span>
        </div>
    )
}


export const Help = (
    <div className = "CmdHelp">
        help&gt; <br />
        /sc &lt;color&gt;: set brush's color <br />
        example: /sc #ff3333 <br />
    </div>
);