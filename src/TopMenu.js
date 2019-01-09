import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import './css/TopMenu.less';
import {
    Common
} from '@clake/react-bootstrap4';
class TopMenu extends React.PureComponent {
    constructor(props) {
        super(props);
        this.cur_active = null;
        this.is_active = false;
    }

    componentDidMount() {

    }

    clickHandler = (key)=>{
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

TopMenu.propTypes = {
    top: PropTypes.bool,
    onClick: PropTypes.func
};

TopMenu.defaultProps = {

};

class Item extends React.PureComponent {
    constructor(props) {
        super(props);
        this.parent = this.props.parent || null;
        this.domId = 'topmenu-item-' + Common.RandomString(16);
    }

    componentDidMount() {

    }

    clickHandler = (e)=>{
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

    changeActive = (e) => {
        if (this.parent.is_active) {
            if (this.parent.cur_active === this.dom) return;
            if (this.parent.cur_active) {
                this.parent.cur_active.classList.remove('active');
                this.parent.cur_menu.hide();
            }
            this.clickHandler(e);
        }
    };

    closeHandler = (e)=>{
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
            <div ref={c=>this.dom=c} id={this.domId} className={this.getClasses()}
                 onMouseOver={this.changeActive}
                 onClick={this.clickHandler}>
                {this.props.text}
                {React.Children.map(this.props.children,(item)=>{
                    item.props.parent = this;
                    item.props.ref = (c)=>{
                        this.menu = c;
                    };
                    return React.cloneElement(item,item.props);
                    // return item;
                })}
            </div>
        );
    }
}

Item.propTypes = {
    text: PropTypes.string,
    parent: PropTypes.any,
    onClick: PropTypes.func,
    name: PropTypes.string
};

Item.defaultProps = {

};

TopMenu.Item = Item;

export default TopMenu;