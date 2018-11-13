import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import './css/TopMenu.less';
import common from "./Common";

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
                    return item;
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
        this.domId = 'topmenu-item-' + common.RandomString(16);
    }

    componentDidMount() {

    }

    clickHandler = (e)=>{
        if (typeof this.props.onClick === 'function') {
            this.props.onClick(this.props.name);
        } else {
            if (this.menu) {
                this.menu.show({evt:e,type:'dom-bottom',data:''});
            }
        }

    };

    getClasses() {
        let base = 'ck-top-menu-item';

        return classNames(base,this.props.className);
    }

    changeActive = (e) => {
        if (this.parent.is_active) {
            this.clickHandler(e);
        }
    };

    render() {
        return (
            <div id={this.domId} className={this.getClasses()}
                 onMouseOver={this.changeActive}
                 onClick={this.clickHandler}>
                {this.props.text}
                {React.Children.map(this.props.children,(item)=>{
                    item.props.parent = this;
                    item.props.ref = (c)=>{
                        this.menu = c;
                    };
                    return React.cloneElement(item,item.props,item.props.children);
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