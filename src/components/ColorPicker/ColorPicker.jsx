// import React from 'react';
// import ColorBar from './ColorBar/ColorBar.jsx';

// import './ColorPicker.css'

// const hsl2rgb = (h, s, l) => {

//     h/=360;
//     s/=100;
//     l/=100;
//     var r = 0;
//     var g = 0;
//     var b = 0;
//     var p = 0;
//     var q = 0;

//     const rgb = (t, p, q) => {
//         if (t < 1.0 / 6.0) {
//             return p + (q - p) * 6.0 * t;
//         } else if (t >= 1.0 / 6.0 && t < 1.0 / 2.0) {
//             return q;
//         } else if (t >= 1.0 / 2.0 && t < 2.0 / 3.0) {
//             return p + (q - p) * (2.0 / 3.0 - t) * 6.0;
//         } else {
//             return p;
//         }
//     }

//     const _rgb = (t) => {
//         if (t < 0) {
//             return t + 1.0;
//         } else if (t > 1) {
//             return t - 1.0;
//         } else {
//             return t;
//         }
//     }

//     if (s === 0) {
//         r = g = b = l;
//     } else {
//         q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
//         p = 2.0 * l - q;
//         r = rgb(_rgb(h + 1.0 / 3.0), p, q);
//         g = rgb(_rgb(h), p, q);
//         b = rgb(_rgb(h - 1.0 / 3.0), p, q);
//     }

//     return Math.round(r * 255).toString(16).padStart(2,0) + Math.round(g * 255).toString(16).padStart(2,0) + Math.round(b * 255).toString(16).padStart(2,0)
// }

// export default class ColorPicker extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             hsl: {
//                 hue: 0,
//                 saturation: 100,
//                 lightness: 50,
//             },
//             color: hsl2rgb(0,100,50),
//         }
//     }

//     handleChange = () => {
//         this.getColor();
//         this.setState({
//             color: hsl2rgb(
//                 this.state.hsl.hue,
//                 this.state.hsl.saturation,
//                 this.state.hsl.lightness
//             ),
//         })
//     }

//     getColor = () => {
//         this.setState({
//             hsl: {
//                 hue: this.refs['hue'].state.value,
//                 saturation: this.refs['saturation'].state.value,
//                 lightness: this.refs['lightness'].state.value,
//             }
//         })
//     }

//     render() {
//         return (
//             <div className = "ColorPicker" onChange = {this.handleChange}>
//                 <ColorBar ref = "hue" color = {this.state.color} max = {360} min = {0} value = {this.state.hsl.hue} />
//                 <ColorBar ref = "saturation" color = {this.state.color} max = {100} min = {0} value = {this.state.hsl.saturation} />
//                 <ColorBar ref = "lightness" color = {this.state.color} max = {100} min = {0} value = {this.state.hsl.lightness} />
//             </div>
//         )
//     }
// }