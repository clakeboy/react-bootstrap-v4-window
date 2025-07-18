/** @module react-bootstrap-v4-window/WModal */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    Button,
    Load,
    Common,
    ButtonGroup,
    ComponentProps,
    StrObject,
    AnyObject
} from '@clake/react-bootstrap4';
import Drag from './Drag';
import './css/WModal.less';

// const ModalAlert = 0;
// const ModalConfirm = 1;
// const ModalLoading = 2;
// const ModalView = 3;
//基础INDEX值
const BaseModal = 950;

enum ModalTypes {
    ModalAlert, 
    ModalConfirm, 
    ModalLoading, 
    ModalView
}

const defBtns:StrObject = {
    ok:'Ok',
    cancel:'Cancel',
};

export interface ModalOptions {
    content?: any
    title?: any
    isCloseBtn?: boolean
    type?:number
    callback?:()=>void
    center?: boolean
    fade?: boolean
    header?: boolean
    btns?: StrObject
}

interface Props extends ComponentProps {
    onOpen: ()=>void,
    onClose: ()=>void,
    center: boolean,
    fade: boolean,
    blurSelector: string,
    width: string
}

interface State {
    content:string,
    title:string,
    isCloseBtn:boolean,
    type:number,
    center:boolean,
    fade:boolean,
    show:boolean,
    header:boolean,
    btns:StrObject,
    width:string
}

export class WModal extends React.Component<Props,State> {
    domId: string
    offsetIndex:number
    is_open:boolean
    fadeTime:AnyObject
    modalType:number
    callback?:(flag?:any)=>void
    _main: HTMLDivElement
    _shadow: HTMLDivElement
    _dialog: HTMLDivElement
    _content: HTMLDivElement
    drag?: Drag
    defaultProps = {
        center:false,
        width: '300px',
        fade:true,
    };

    constructor(props:any) {
        super(props);
        this.state = {
            content:'',
            title:'',
            isCloseBtn:true,
            type:ModalTypes.ModalAlert,
            center:this.props.center,
            fade:this.props.fade,
            show:false,
            header:true,
            btns:defBtns,
            width:''
        };
        //modal type
        this.modalType = ModalTypes.ModalAlert;
        //alert confirm callback function
        this.callback = undefined;

        this.domId = 'modal-'+Common.RandomString(16);
        if (this.props.id) {
            this.domId = this.props.id;
        }
        this.offsetIndex = document.querySelectorAll(".modal").length * 10;
        this.is_open = false;
        this.fadeTime = {
            open:0,
            close:0
        };
    }

    shouldComponentUpdate(nextProps:Props, nextState:State) {
        return this.state.content !== nextState.content
    }

    componentDidMount() {
        this.drag = new Drag(this._content,this._content,{

        });
    }

    componentWillUnmount() {
        this.drag?.unbind();
        this.drag = undefined;
    }

    open() {
        if (this.is_open) {
            clearTimeout(this.fadeTime.open);
            clearTimeout(this.fadeTime.close);
        }

        this._main.classList.add('d-block');
        this.is_open = true;
        if (this.state.fade) {
            this.fadeTime.open = setTimeout(()=>{
                this._shadow.classList.add('modal-show');
                this._dialog.style.opacity = '1';
                this._dialog.style.marginTop = '1.75rem';
            },150);
        }
    }

    close() {
        if (this.state.fade) {
            this._dialog.style.opacity = '0';
            this._dialog.style.marginTop = '-1rem';
            this._shadow.classList.remove('modal-show');
        }
        
        this.fadeTime.close = setTimeout(()=>{
            if (this?._main) {
                this._main.classList.remove('d-block');
                this.is_open = false;
                this._content.style.top = '0';
                this._content.style.left = '0';
            }
        },150);
    }

    closeHandler = ()=>{
        if (typeof this.props.onClose === 'function') {
            this.props.onClose();
        }
    };

    openHandler = () =>{
        if (typeof this.props.onOpen === 'function') {
            this.props.onOpen();
        }
    };

    /**
     * modal alert method
     * opt example
     * {
     *      title: '',
     *      content: ''
     *      [,callback: func]
     * }
     * @param opt object
     */
    alert(args:ModalOptions|string,cb?:()=>void):void {
        let opt:ModalOptions
        if (typeof args === 'string') {
            opt = {
                content:args
            }
        } else {
            opt = args
        }
        this.callback = opt.callback||cb||undefined;
        this.modalType = ModalTypes.ModalAlert;
        this.setState({
            title:opt.title||'Prompt',
            content:opt.content||opt||'',
            isCloseBtn:true,
            type:ModalTypes.ModalAlert,
            center:opt.center||this.props.center,
            fade:opt.fade||this.props.fade,
            header: typeof opt.header === 'undefined' ? true:opt.header,
            btns: typeof opt.btns != 'undefined' ? opt.btns:defBtns,
        },()=>{
            this.open();
        });
    }

    /**
     * modal confirm method
     * opt example
     * {
     *      title:'',
     *      content:'',
     *      [callback: func]
     * }
     * @param opt
     */
    confirm(args:ModalOptions|string,cb?:()=>void) {
        let opt:ModalOptions
        if (typeof args === 'string') {
            opt = {
                content:args
            }
        } else {
            opt = args
        }
        this.callback = opt.callback||cb||undefined;
        this.modalType = ModalTypes.ModalConfirm;
        this.setState({
            title:opt.title||'Prompt',
            content:opt.content||'',
            isCloseBtn:true,
            type:ModalTypes.ModalConfirm,
            center:opt.center||this.props.center,
            fade:opt.fade||this.props.fade,
            header: typeof opt.header === 'undefined' ? true:opt.header,
            btns: typeof opt.btns != 'undefined' ? opt.btns:defBtns,
        },()=>{
            this.open();
        });
    }

    /**
     * modal loading method
     * @param opt
     */
    loading(args:ModalOptions|string) {
        let opt:ModalOptions
        if (typeof args === 'string') {
            opt = {
                content:args
            }
        } else {
            opt = args
        }
        this.modalType = ModalTypes.ModalLoading;
        this.setState({
            title:opt.title||'Prompt',
            // content:(
            //     <React.Fragment>
            //         <Icon icon='spinner'/>&nbsp;&nbsp;&nbsp;{content}
            //     </React.Fragment>
            // ),
            content:opt.content||opt||'',
            isCloseBtn:false,
            type:ModalTypes.ModalLoading,
            center:opt.center||this.props.center,
            fade:this.props.fade,
            header: opt.header||false,
        },()=>{
            this.open();
        });
    }

    /**
     * modal view method
     * opt example
     * {
     *      title:'',
     *      content:flex,
     *      [callback:func]
     * }
     * @param opt
     */
    view(opt:ModalOptions) {
        this.callback = opt.callback||undefined;
        this.modalType = ModalTypes.ModalView;
        this.setState({
            title:opt.title||'Prompt',
            content:opt.content||'',
            isCloseBtn:true,
            type:ModalTypes.ModalView,
            center:opt.center||this.props.center,
            fade:opt.fade||this.props.fade,
            header: typeof opt.header === 'undefined' ? true:opt.header
        },()=>{
            this.open();
        });
    }

    getMainClasses() {
        let base = 'wmodal-main';

        if (this.state.fade) {
            base = classNames(base,'wmodal-fade');
        }

        return classNames(base,this.props.className);
    }

    getClasses() {
        let base = 'modal wmodal-sm d-block';
        if (this.modalType === ModalTypes.ModalView) {
            base = classNames(base,"bd-example-modal-lg");
        }

        if (this.state.fade) {
            base = classNames(base,'wmodal-fade');
        }

        return classNames(base,this.props.className);
    }

    getDialogStyles() {
        let base:any = {};
        if (this.state.width) {
            base.maxWidth = this.state.width;
        } else if (this.props.width) {
            base.maxWidth = this.props.width;
        }
        return base;
    }

    getDialogClasses() {
        let base = 'modal-dialog';
        if (this.modalType === ModalTypes.ModalView) {
            base = classNames(base,"modal-lg");
        }
        if (this.state.center) {
            base = classNames(base,"modal-dialog-centered");
        }

        return classNames(base,this.props.className);
    }

    getShadowClasses() {
        let base = 'modal-backdrop ck-modal-shadow show';

        return classNames(base,this.props.className);
    }

    renderFooter() {
        let content = null;
        switch (this.state.type) {
            case ModalTypes.ModalAlert:
                content = (
                    <Button className="w-100" size='sm' data-dismiss="modal" onClick={e=>{
                        this.close();
                        if (typeof this.callback === 'function') {
                            this.callback(1);
                        }
                    }}>{this.state.btns['ok']}</Button>
                );
                break;
            case ModalTypes.ModalConfirm:
                content = (
                    <div className='row flex-grow-1 g-1 btn'>
                        <ButtonGroup>
                        <Button className='col-6' size='sm' onClick={()=>{
                            this.close();
                            if (typeof this.callback === 'function') {
                                this.callback(1);
                            }
                        }}>{this.state.btns['ok']}</Button>
                        <Button className='col-6' size='sm' onClick={()=>{
                            this.close();
                            if (typeof this.callback === 'function') {
                                this.callback(0);
                            }
                        }} theme='secondary'>{this.state.btns['cancel']}</Button>
                        </ButtonGroup>
                    </div>
                );
                break;
            default:
                return null;
        }

        return (
            <div className="modal-footer">
                {content}
            </div>
        )
    }

    render() {
        let modalIndex = {zIndex:BaseModal+this.offsetIndex+2};
        let shadowIndex = {zIndex:BaseModal+this.offsetIndex+1};
        return (
            <div ref={(c:any)=>this._main=c} className={this.getMainClasses()}>
                <div ref={(c:any)=>this._shadow=c} className={this.getShadowClasses()} style={shadowIndex} id={`${this.domId}-shadow`}/>
                <div className={this.getClasses()} style={modalIndex} tabIndex={-1} id={this.domId} role="dialog">
                    <div ref={(c:any)=>this._dialog=c} className={this.getDialogClasses()} style={this.getDialogStyles()} role="document">
                        <div className="modal-content" ref={(c:any)=>this._content=c}> 
                            {this.state.header?<div className="modal-header">
                                <h6 className="modal-title">{this.state.title}</h6>
                                {this.state.isCloseBtn?<button type="button" className="btn-close" onClick={()=>{
                                    this.close();
                                }}>
                                </button>:null}
                            </div>:null}
                            <div className="modal-body">
                                {this.state.type === ModalTypes.ModalLoading?<React.Fragment>
                                    <Load/>&nbsp;&nbsp;&nbsp;{this.state.content}
                                </React.Fragment>:this.state.content}
                            </div>
                            {this.renderFooter()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default WModal;