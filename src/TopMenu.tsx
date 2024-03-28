import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './css/TopMenu.less';
import {
    Common,
    ComponentProps
} from '@clake/react-bootstrap4';

interface Props extends ComponentProps {
    top?: boolean
    onClick?: (key:string)=>void
}

interface State {

}

interface ItemProps extends ComponentProps {
    text?: string
    parent?: any
    onClick?: (key:string)=>void
    name: string
}

interface ItemState {

}

export class Item extends React.PureComponent<ItemProps,ItemState> {
    parent:any
    domId:string
    menu:any
    dom:any
    constructor(props:any) {
        super(props);
        this.parent = this.props.parent || null;
        this.domId = 'topmenu-item-' + Common.RandomString(16);
    }

    componentDidMount() {

    }

    clickHandler = (e:any)=>{
        if (typeof this.props.onClick === 'function') {
            this.props.onClick(this.props.name);
        } else {
            if (this.menu) {
                this.parent.is_active = true;
                this.parent.cur_active = this.dom;
                this.parent.cur_menu = this.menu;
                this.dom.classList.add('active');
                this.menu.show({
                    evt:e,
                    type:'dom-bottom',
                    data:'',
                    close:this.closeHandler
                });
            }
        }
    };

    getClasses() {
        let base = 'ck-top-menu-item';

        return classNames(base,this.props.className);
    }

    changeActive = (e:any) => {
        if (this.parent.is_active) {
            if (this.parent.cur_active === this.dom) return;
            if (this.parent.cur_active) {
                this.parent.cur_active.classList.remove('active');
                this.parent.cur_menu.hide();
            }
            this.clickHandler(e);
        }
    };

    closeHandler = (e:any)=>{
        // console.log(e);
        // // console.log('close');
        // console.log(this.props.text);
        if (e) {
            if (this.parent.cur_active) {
                this.parent.cur_active.classList.remove('active');
                this.parent.is_active = false;
                this.parent.cur_menu = null;
            }
        }
    };

    render() {
        return (
            <div ref={(c:any)=>this.dom=c} id={this.domId} className={this.getClasses()}
                 onMouseOver={this.changeActive}
                 onClick={this.clickHandler}>
                {this.props.text}
                {React.Children.map(this.props.children,(item)=>{
                    item.props.parent = this;
                    item.props.ref = (c:any)=>{
                        this.menu = c;
                    };
                    return React.cloneElement(item,item.props);
                    // return item;
                })}
            </div>
        );
    }
}

export class TopMenu extends React.PureComponent<Props,State> {
    static Item = Item
    
    cur_active:any
    is_active:boolean
    constructor(props:any) {
        super(props);
        this.cur_active = null;
        this.is_active = false;
    }

    componentDidMount() {

    }

    clickHandler = (key:any)=>{
        if (typeof this.props.onClick === 'function') {
            this.props.onClick(key);
        }
    };

    getClasses() {
        let base = 'ck-top-menu d-flex border-bottom shadow';

        if (this.props.top) {
            base = classNames(base,'ck-top-menu-top');
        }

        return classNames(base,this.props.className);
    }

    render() {
        return (
            <div className={this.getClasses()}>
                {React.Children.map(this.props.children,(item)=>{
                    item.props.parent = this;
                    return React.cloneElement(item,item.props);
                })}
            </div>
        );
    }
}

export default TopMenu;