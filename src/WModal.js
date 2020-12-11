import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import {
    Button,
    Load,
    Common
} from '@clake/react-bootstrap4';
import './css/WModal.less';

const ModalAlert = 0;
const ModalConfirm = 1;
const ModalLoading = 2;
const ModalView = 3;
const BaseModal = 950;

const defBtns = {
    ok:'确定',
    cancel:'取消',
};

class WModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content:'',
            title:'',
            isCloseBtn:true,
            type:ModalAlert,
            center:this.props.center,
            fade:this.props.fade,
            show:false,
            header:true,
            btns:defBtns,
        };
        //modal type
        this.modalType = ModalAlert;
        //alert confirm callback function
        this.callback = null;

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

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.content !== nextState.content
    }

    componentDidMount() {

    }

    componentWillUnmount() {

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
            }
        },150);
    }

    closeHandler = (e)=>{
        if (typeof this.props.onClose === 'function') {
            this.props.onClose();
        }
    };

    openHandler = (e) =>{
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
    alert(opt,cb) {
        this.callback = opt.callback||cb||null;
        this.modalType = ModalAlert;
        this.setState({
            title:opt.title||'提示',
            content:opt.content||opt||'',
            isCloseBtn:true,
            type:ModalAlert,
            center:opt.center||this.props.center,
            fade:opt.fade||this.props.fade,
            header: typeof opt.header === 'undefined' ? true:opt.header,
            btns: typeof opt.btns != 'undefined' ? opt.btns:defBtns,
        },()=>{
            this.open({
                backdrop:'static',
                keyboard:false,
            });
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
    confirm(opt,cb) {
        this.callback = opt.callback||cb||null;
        this.modalType = ModalConfirm;
        this.setState({
            title:opt.title||'提示',
            content:opt.content||'',
            isCloseBtn:true,
            type:ModalConfirm,
            center:opt.center||this.props.center,
            fade:opt.fade||this.props.fade,
            header: typeof opt.header === 'undefined' ? true:opt.header,
            btns: typeof opt.btns != 'undefined' ? opt.btns:defBtns,
        },()=>{
            this.open({
                backdrop:'static',
                keyboard:false,
            });
        });
    }

    /**
     * modal loading method
     * @param opt
     */
    loading(opt) {
        this.modalType = ModalLoading;
        this.setState({
            title:opt.title||'提示',
            // content:(
            //     <React.Fragment>
            //         <Icon icon='spinner'/>&nbsp;&nbsp;&nbsp;{content}
            //     </React.Fragment>
            // ),
            content:opt.content||opt||'',
            isCloseBtn:false,
            type:ModalLoading,
            center:opt.center||this.props.center,
            fade:this.props.fade,
            header: opt.header||false,
        },()=>{
            this.open({
                backdrop:'static',
                keyboard:false,
            });
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
    view(opt) {
        this.callback = opt.callback||null;
        this.modalType = ModalView;
        this.setState({
            title:opt.title||'提示',
            content:opt.content||'',
            isCloseBtn:true,
            type:ModalView,
            center:opt.center||this.props.center,
            fade:opt.fade||this.props.fade,
            header: typeof opt.header === 'undefined' ? true:opt.header
        },()=>{
            this.open({
                backdrop:'static',
                keyboard:false,
            });
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
        if (this.modalType === ModalView) {
            base = classNames(base,"bd-example-modal-lg");
        }

        if (this.state.fade) {
            base = classNames(base,'wmodal-fade');
        }

        return classNames(base,this.props.className);
    }

    getDialogStyles() {
        let base = {};
        if (this.state.width) {
            base['maxWidth'] = this.state.width;
        } else if (this.props.width) {
            base['maxWidth'] = this.props.width;
        }
        return base;
    }

    getDialogClasses() {
        let base = 'modal-dialog';
        if (this.modalType === ModalView) {
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
            case ModalAlert:
                content = (
                    <Button size='sm' data-dismiss="modal" onClick={e=>{
                        this.close();
                        if (typeof this.callback === 'function') {
                            this.callback(1);
                        }
                    }}>{this.state.btns['ok']}</Button>
                );
                break;
            case ModalConfirm:
                content = (
                    <React.Fragment>
                        <Button size='sm' onClick={()=>{
                            this.close();
                            if (typeof this.callback === 'function') {
                                this.callback(1);
                            }
                        }}>{this.state.btns['ok']}</Button>
                        <Button size='sm' onClick={()=>{
                            this.close();
                            if (typeof this.callback === 'function') {
                                this.callback(0);
                            }
                        }} theme='secondary'>{this.state.btns['cancel']}</Button>
                    </React.Fragment>
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
            <div ref={c=>this._main=c} className={this.getMainClasses()}>
                <div ref={c=>this._shadow=c} className={this.getShadowClasses()} style={shadowIndex} id={`${this.domId}-shadow`}/>
                <div className={this.getClasses()} style={modalIndex} tabIndex="-1" id={this.domId} role="dialog">
                    <div ref={c=>this._dialog=c} className={this.getDialogClasses()} style={this.getDialogStyles()} role="document">
                        <div className="modal-content">
                            {this.state.header?<div className="modal-header">
                                <h5 className="modal-title">{this.state.title}</h5>
                                {this.state.isCloseBtn?<button type="button" className="close" onClick={()=>{
                                    this.close();
                                }}>
                                    <span aria-hidden="true">&times;</span>
                                </button>:null}
                            </div>:null}
                            <div className="modal-body">
                                {this.state.type === ModalLoading?<React.Fragment>
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

WModal.propTypes = {
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    center: PropTypes.bool,
    fade: PropTypes.bool,
    blurSelector: PropTypes.string,
    width: PropTypes.string
};

WModal.defaultProps = {
    center:false,
    width: '300px',
    fade:true,
};

export default WModal;