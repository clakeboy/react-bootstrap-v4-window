import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './css/Window.less';
import ReactDOM from "react-dom";
import Drag from './Drag';
import IconButton from "./IconButton";
import {
    Common,
    ComponentProps
} from '@clake/react-bootstrap4';

interface Props extends ComponentProps {
    title?: string
    width?: string
    height?: string
    x?: string
    y?: string
    backColor?: string
    name?: string
    parent?: any
    marginTop?: any
    isMaxBtn?: boolean
    isCloseBtn?: boolean
    isMinBtn?: boolean
}

interface State {
    close:boolean
}

export interface ShowOptions {
    params?: any
    x?:number
    y?:number
}

export class Window extends React.PureComponent<Props,State> {
    static EVT_RESIZE:string
    static EVT_MAXWINDOW:string
    static EVT_SHOW:string
    static EVT_CLOSE:string
    static EVT_BEFORE_CLOSE:string

    static defaultProps = {
        isCloseBtn:true,
        isMaxBtn: true
    }

    parent:any
    data:any
    evts:any
    is_before:boolean
    is_max:boolean
    max_position:any
    drag:Drag|undefined
    dragDom:HTMLElement
    domHeader:HTMLElement
    dom:HTMLElement
    params:any
    constructor(props:any) {
        super(props);
        this.state = {
            close:true
        };
        this.parent = this.props.parent || null;
        this.data = null;
        this.evts = {};
        this.is_before = false;
        this.is_max = false;
        this.max_position = {};
    }

    componentDidMount() {
        this.drag = new Drag(this.dragDom,this.domHeader,{
            start:()=>{
                if (this.is_max) return false;
                this.dragDom.style.top = this.dom.style.top;
                this.dragDom.style.left = this.dom.style.left;
                this.dragDom.classList.remove('d-none');
                this.dom.classList.add('ck-window-opacity');
                return true;
            },
            move:(move)=> {
                if (move.y < this.props.marginTop) {
                    move.y = this.props.marginTop;
                }
            },
            end:()=>{
                this.dragDom.classList.add('d-none');
                this.dom.classList.remove('ck-window-opacity');
                this.dom.style.top = this.dragDom.style.top;
                this.dom.style.left = this.dragDom.style.left;
                return true;
            }
        });
        if (this.parent) {
            this.dom.addEventListener('mousedown',(e)=>{
                this.parent.changeWindowIndex(this.props.name);
            },false);
        }
    }

    componentWillUnmount() {
        this.drag?.unbind();
        this.drag = undefined;
    }

    show(option:ShowOptions) {
        option = option || {
            x:20,
            y:20
        };
        this.params = option.params || null;
        this.dom.classList.remove('d-none');
        this.move(option.x??0,option.y??0);
        this.setState({
            close:false
        },()=>{
            this.showHandler(this.params);
        });
    }

    close = () => {
        if (this.is_before) {
            this.beforeCloseHandler(this.hide);
            return;
        }
        this.hide();
    };

    hide = ()=>{
        this.max(false);
        this.dom.style.top = "0";
        this.dom.style.left = "0";
        this.dom.classList.add('d-none');
        this.setActive(false);
        this.is_max = false;
        if (this.parent) {
            this.parent.removeWindowOpens(this.props.name);
        }
        this.setState({
            close:true
        },()=>{
            this.closeHandler();
        });
    };

    move(x:number,y:number) {
        this.dom.style.top = (y+this.props.marginTop)+'px';
        this.dom.style.left = x+'px';
    }

    max(flag:boolean) {
        if (flag) {
            this.max_position.y = this.dom.style.top;
            this.max_position.x = this.dom.style.left;
            this.max_position.width = this.dom.style.width;
            this.max_position.height = this.dom.style.height;
            this.dom.style.top = this.props.marginTop+'px';
            this.dom.style.left = '0';
            this.dom.style.right = '0';
            this.dom.style.bottom = '0';
            this.dom.style.width = 'unset';
            this.dom.style.height = 'unset';
            this.is_max = true;
        } else {
            this.dom.style.width = this.max_position.width;
            this.dom.style.height = this.max_position.height;
            this.dom.style.top = this.max_position.y;
            this.dom.style.left = this.max_position.x;
            this.dom.style.right = 'unset';
            this.dom.style.bottom = 'unset';
            this.is_max = false;
        }
    }

    setIndex(index:any) {
        this.dom.style.zIndex = index;
    }

    setActive(active:boolean) {
        if (active) {
            this.dom.classList.add('ck-window-active');
        } else {
            this.dom.classList.remove('ck-window-active');
        }
    }

    getPosition() {
        return Common.GetDomXY(this.dom);
    }

    maxHandler = (e:any)=>{
        if (!this.props.isMaxBtn) {
            return
        }
        this.trigger(EVT_MAX_WINDOW,e);
        this.max(!this.is_max);
    };

    showHandler = (e:any)=>{
        this.trigger(EVT_SHOW,e);
    };

    closeHandler = (e?:any)=>{
        this.trigger(EVT_CLOSE,e);
        this.clearEvent();
    };

    beforeCloseHandler = (e:any)=>{
        this.trigger(EVT_BEFORE_CLOSE,e);
    };

    on(fn_name:string,fn:any) {
        this.evts[fn_name] = fn;
    }

    off(fn_name:string) {
        this.evts[fn_name] = undefined;
    }

    trigger(fn_name:string,val:any) {
        if (typeof this.evts[fn_name] === 'function') {
            this.evts[fn_name](val);
        }
    }

    clearEvent() {
        this.evts = {};
    }

    getClasses() {
        let base = 'card ck-window shadow d-none';
        return classNames(base,this.props.className);
    }

    getStyles(shadow?:boolean) {
        let base:any = {
            width: "600px",
            height: "400px",
            top: '20px',
            left: '20px'
        };
        if (this.props.width) {
            base.width = this.props.width;
        }
        if (this.props.height) {
            let reg = /(\d+)(px|rem|pt|cm|mm)/;
            let match = this.props.height.match(reg);
            if (match) {
                base.height = (35+parseInt(match[1]))+match[2];
            }
        }
        if (this.props.x) {
            base.left = this.props.x;
        }
        if (this.props.y) {
            base.top = this.props.y;
        }
        if (this.props.backColor && !shadow ) {
            base.backgroundColor = this.props.backColor;
        }
        return base;
    }

    render() {
        let content = (
            <React.Fragment>
                <div ref={(c:any)=>this.dom=c} className={this.getClasses()} style={this.getStyles()}>
                    <div ref={(c:any)=>this.domHeader=c} onDoubleClick={this.maxHandler} className='card-header'>
                        {this.props.title}
                        <div className='window-btn'>
                            {/*<IconButton className='mr-1' iconType='regular' icon='window-minimize'/>*/}
                            {this.props.isMaxBtn?<IconButton className='mr-1' iconType='regular' icon='window-maximize' onClick={this.maxHandler}/>:null}
                            {this.props.isCloseBtn?<IconButton icon='window-close' onClick={this.close}/>:null}
                        </div>
                    </div>
                    <div className="card-body">
                        {/*{this.props.children}*/}
                        {!this.state.close?this.renderContent():null}
                    </div>
                </div>
                <div ref={(c:any)=>this.dragDom=c} className='ck-window-drag-box d-none border border-secondary' style={this.getStyles(true)}/>
            </React.Fragment>
        );

        return ReactDOM.createPortal(
            content,document.body
        );
    }

    renderContent() {
        return React.Children.map(this.props.children,(child)=>{
            return React.cloneElement(child,{...child.props,parent:this});
        })
    }

    renderEmpty() {
        return null;
    }
}

const EVT_RESIZE = 'resize';
const EVT_MAX_WINDOW = 'max_window';
const EVT_SHOW = 'show';
const EVT_CLOSE = 'close';
const EVT_BEFORE_CLOSE = 'before_close';

Window.EVT_RESIZE = EVT_RESIZE;
Window.EVT_MAXWINDOW = EVT_MAX_WINDOW;
Window.EVT_SHOW = EVT_SHOW;
Window.EVT_CLOSE = EVT_CLOSE;
Window.EVT_BEFORE_CLOSE = EVT_BEFORE_CLOSE;

export default Window;