// import React from 'react';
// import ReactDOM from 'react-dom';

// import './ColorBar.css'
// export default class ColorBar extends React.Component {


//     constructor(props) {
//         super(props);
//         this.state = {
//             value: props.value|0,
//             button_style: {
//                 width: 60,
//                 height: 15,
//                 top: 0
//             },
            
//         };
//     }

//     max = () => {
//         return this.props.max || "1";
//     }

//     min = () => {
//         return this.props.min || "0";
//     }

//     position = (value) => {
//         let scale = ReactDOM.findDOMNode(this.refs["scale"]);
//         let cursor = ReactDOM.findDOMNode(this.refs["cursor"]);
//         let scaleValue = ReactDOM.findDOMNode(this.refs["scaleValue"]);

//         let rate = (value - this.min())/(this.max() - this.min()); // 比率
//         let top = - (scale.offsetHeight - cursor.offsetHeight) / 100 * rate * 100 + 660;
//         cursor.style.top = top + "px";
//         var height = top -7.5;
//         scaleValue.style.height = height + "px";
//     }

//     handlerChange = (e) => {
//         var value = parseInt(e.currentTarget.value);
//         console.log("input value: " + value);
//         this.setState({value:value});
//         if(typeof this.props.fnFeedback === "function"){
//             this.props.fnFeedback(value);
//         }

//     }

//     componentDidUpdate = () => {
//         var value = typeof this.state.value !== "undefined" && this.oldPropValue === this.props.value ? this.state.value : this.props.value;
//         this.oldPropValue = this.props.value;
//         this.state.value = value;
//         this.position(value);
//     }

//     componentDidMount() {
//         this.componentDidUpdate();
//     }

//     render() {
//         var value = typeof this.state.value !== "undefined" && this.oldPropValue === this.props.value ? this.state.value : this.props.value;
//         console.log(this.props.color);
//         return (
//             <div className = "ColorBar" style = {{'backgroundColor': '#'+this.props.color}} ref = "scale">
//                 <input type="range" orient="vertical" min={this.min()} max={this.max()} onChange={this.handlerChange} value={value}  />
//                 <span 
//                 className = "colorbar-button" 
//                 style = {this.state.button_style}
//                 ref="cursor"
//                 >
//                 </span>
//                 <div ref="scaleValue"></div>
//             </div>
//         )
//     }
// }