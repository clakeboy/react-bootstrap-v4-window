import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import './css/Window.less';
import ReactDOM from "react-dom";
import Drag from './Drag';
import IconButton from "./IconButton";
import {GetDomXY} from "./Common";

class Window extends React.PureComponent {
    constructor(props) {
        super(props);
        this.parent = this.props.parent || null;
        this.data = null;
        this.evts = {};
        this.is_before = false;
        this.is_max = false;
    }

    componentDidMount() {
        this.drag = new Drag(this.dragDom,this.domHeader,{
            start:()=>{
                if (this.is_max) return;
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
        this.drag.unbind();
        this.drag = null;
    }

    show(option) {
        option = option || {
            x:20,
            y:20
        };
        this.params = option.params || null;
        this.dom.style.top = (option.y+this.props.marginTop)+'px';
        this.dom.style.left = option.x+'px';
        this.dom.classList.remove('d-none');
        this.showHandler(null);
    }

    close = () => {
        if (this.is_before) {
            this.beforeCloseHandler(this.hide);
            return;
        }
        this.hide();
        this.closeHandler();
    };

    hide = ()=>{
        this.dom.style.top = 0;
        this.dom.style.left = 0;
        this.dom.classList.add('d-none');
        this.setActive(false);
        if (this.parent) {
            this.parent.removeWindowOpens(this.props.name);
        }
        this.is_max = false;
    };

    setIndex(index) {
        this.dom.style.zIndex = index;
    }

    setActive(active) {
        if (active) {
            this.dom.classList.add('ck-window-active');
        } else {
            this.dom.classList.remove('ck-window-active');
        }
    }

    getPosition() {
        return GetDomXY(this.dom);
    }

    maxHandler = (e)=>{
        this.trigger(EVT_MAX_WINDOW,e)
    };

    showHandler = (e)=>{
        this.trigger(EVT_SHOW,e);
    };

    closeHandler = (e)=>{
        this.trigger(EVT_CLOSE,e);
    };

    beforeCloseHandler = (e)=>{
        this.trigger(EVT_BEFORE_CLOSE,e);
    };

    on(fn_name,fn) {
        this.evts[fn_name] = fn;
    }

    off(fn_name) {
        this.evts[fn_name] = undefined;
    }

    trigger(fn_name,val) {
        if (typeof this.evts[fn_name] === 'function') {
            this.evts[fn_name](val);
        }
    }

    getClasses() {
        let base = 'card ck-window shadow d-none';
        return classNames(base,this.props.className);
    }

    getStyles(shadow) {
        let base = {
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
            base.height = (35+parseInt(match[1]))+match[2];
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
                <div ref={c=>this.dom=c} className={this.getClasses()} style={this.getStyles()}>
                    <div ref={c=>this.domHeader=c} className='card-header'>
                        {this.props.title}
                        <div className='window-btn'>
                            <IconButton className='mr-1' iconType='regular' icon='window-minimize'/>
                            <IconButton className='mr-1' iconType='regular' icon='window-maximize' onClick={this.maxHandler}/>
                            <IconButton icon='window-close' onClick={this.close}/>
                        </div>
                    </div>
                    <div className="card-body">
                        {/*{this.props.children}*/}
                        {this.renderContent()}
                    </div>
                </div>
                <div ref={c=>this.dragDom=c} className='ck-window-drag-box d-none border border-secondary' style={this.getStyles(true)}/>
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
}

Window.propTypes = {
    title: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    x: PropTypes.string,
    y: PropTypes.string,
    backColor: PropTypes.string,
    name: PropTypes.string,
    parent: PropTypes.any,
    marginTop: PropTypes.any
};

Window.defaultProps = {
    marginTop: 0
};

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