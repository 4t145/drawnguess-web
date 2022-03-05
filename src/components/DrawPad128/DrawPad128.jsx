import React from 'react';
import './DrawPad128.css';
export default class DrawPad128 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            figure: new Uint32Array(128*128),
            shall_update: false,
            drawing: false,
            path_unsaved: {
                buf: []
            },
            path_redo: [],
            path_done: [],
        }
        this.canvas = React.createRef()
    }
    
    componentDidMount = () => {
        const cvs = this.canvas.current;
        cvs.width = 512;
        cvs.height = 512;
        setInterval(this.draw, 1000/60);
    }

    handleOnMouseDown = (e) => {
        const rect = this.canvas.current.getBoundingClientRect();
        const x = Math.round((e.clientX - rect.left)/4);
        const y = Math.round((e.clientY - rect.top)/4);
        this.setState((state) => {
            state.path_unsaved = {
                buf:[{x:x,y:y}],
                color: this.props.color,
            };
            state.drawing = true;
            state.shall_update = true;
        });
    }

    handleOnMouseMove = (e) => {
        if (this.state.drawing) {
            const rect = this.canvas.current.getBoundingClientRect();
            let x = Math.round((e.clientX - rect.left)/4);
            let y = Math.round((e.clientY - rect.top)/4);
            if(x>127) {x=127;}
            if(x<0) {x=0;}
            if(y>127) {y=127;}
            if(y<0) {y=0;}
            this.setState((state) => {
                state.path_unsaved.buf.push({x:x,y:y});
                state.shall_update = true;
            });
        }
    }

    handleOnMouseUp = () => {
        this.setState((state) => {
            state.path_redo = [];
            state.path_done.push(state.path_unsaved);
            state.path_unsaved = {
                buf:[],
            }
            state.drawing = false;
            state.shall_update = true;
        });
    }

    drawPath = (ctx, path) => {
        ctx.fillStyle = path.color;
        let line = [];
        if( path.buf.length === 0 ) {
            // do nothing
        } else if (path.buf.length === 1) {
            line.push(path.buf[0]);
        } else if (path.buf.length>1) {
            for (let idx = 0; idx < path.buf.length-1; idx++) {
                let x0 = path.buf[idx].x;
                let y0 = path.buf[idx].y;
                let x1 = path.buf[idx+1].x;
                let y1 = path.buf[idx+1].y;
                let dx = x1-x0;
                let dy = y1-y0;
                if(dx===0&&dy===0) {
                    line.push({x:x0,y:y0});
                } else if (dx===0) {
                    if (dy>0) {
                        for (let y = y0; y < y1; y+=1) {
                            line.push({x:x0,y:y});
                        }
                    } else {
                        for (let y = y0; y > y1; y-=1) {
                            line.push({x:x0,y:y});
                        }
                    }
                } else if (dy===0) {
                    if (dx>0) {
                        for (let x = x0; x < x1; x+=1) {
                            line.push({x:x,y:y0});
                        }
                    } else {
                        for (let x = x0; x > x1; x-=1) {
                            line.push({x:x,y:y0});
                        }
                    }
                } else if (Math.abs(dy)>Math.abs(dx)) {
                    const k = dx/dy;
                    if (dy>0) {
                        for (let y = y0; y < y1; y+=1) {
                            const x = Math.round((y-y0)*k+x0);
                            line.push({x:x,y:y});
                        }
                    } else {
                        for (let y = y0; y > y1; y-=1) {
                            const x = Math.round((y-y0)*k+x0);
                            line.push({x:x,y:y});
                        }
                    }
                } else if (Math.abs(dy)<=Math.abs(dx)) {
                    const k = dy/dx;
                    if (dx>0) {
                        for (let x = x0; x < x1; x+=1) {
                            const y = Math.round((x-x0)*k+y0);
                            line.push({x:x,y:y});
                        }
                    } else {
                        for (let x = x0; x > x1; x-=1) {
                            const y = Math.round((x-x0)*k+y0);
                            line.push({x:x,y:y});
                        }
                    }
                }
            }
        }
        line.forEach((point) => {
            const x = point.x;
            const y = point.y;
            ctx.fillRect(4*x, 4*y, 4, 4);
        })       

        
    }

    drawAll  = () => {
        const cvs = this.canvas.current;
        if(cvs) {
            const ctx = cvs.getContext("2d");
            this.state.path_done.forEach(path => {
                this.drawPath(ctx, path);
            });
        }
    };

    drawUnsaved = () => {
        const cvs = this.canvas.current;
        const ctx = cvs.getContext("2d");
        this.drawPath(ctx, this.state.path_unsaved);
    };

    clearAll = () => {
        const cvs = this.canvas.current;
        const ctx = cvs.getContext("2d");
        ctx.clearRect(0, 0, 512, 512)
    }

    draw = () => {
        if(this.state.shall_update) {
            this.clearAll();
            this.drawAll();
            this.drawUnsaved();
            this.setState((state) => {
                state.shall_update = false;
            });
        }
    }

    handleOnKeyUp = (e) => {
        if (this.state.drawing) {
            return;
        }
        if (e.ctrlKey) {
            switch (e.keyCode) {
                case 90: {
                    this.setState((state) => {
                        const undo = state.path_done.pop();
                        if(undo){
                            state.path_redo.push(undo);
                        }
                        state.shall_update = true;
                    });
                    break;
                }
                case 89: {
                    this.setState((state) => {
                        const redo = state.path_redo.pop();
                        if(redo){
                            state.path_done.push(redo);
                        }
                        state.shall_update = true;
                    });
                    break;
                }
                default:
                    break;
            }
        }
    }

    render = () => {
        return (
            <div className = "DrawPad128">
                <canvas 
                ref = {this.canvas}
                onMouseDown = {this.handleOnMouseDown}
                onMouseMove = {this.handleOnMouseMove}
                onMouseUp = {this.handleOnMouseUp}
                onKeyUp = {this.handleOnKeyUp}
                tabIndex = "0"
                >
                    
                </canvas>
            </div>
        )
    }
}