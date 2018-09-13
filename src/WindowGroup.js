import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

const defIndex = 100;

class WindowGroup extends React.PureComponent {
    constructor(props) {
        super(props);
        this.windows = {};
        this.opens = [];
    }

    componentDidMount() {

    }

    /**
     * open window
     * @param name
     */
    open(name) {
        if (this.opens.indexOf(name) !== -1) {
            this.changeWindowIndex(name);
            return;
        }

        if (this.windows[name]) {
            let option = {
                x:this.opens.length*20+10,
                y:this.opens.length*20+10,
            };
            this.windows[name].show(option);
            this.windows[name].setIndex(defIndex+this.opens.length);
            this.opens.push(name);
        }
    }

    changeWindowIndex(name) {
        console.log(name,this.opens.indexOf(name));
        this.opens.splice(this.opens.indexOf(name),1);
        this.opens.push(name);
        this.opens.forEach((key,index)=>{
            this.windows[key].setIndex(defIndex+index);
        });
    }

    removeWindowOpens(name) {
        this.opens.splice(this.opens.indexOf(name),1);
        this.opens.forEach((key,index)=>{
            this.windows[key].setIndex(defIndex+index+1);
        });
    }

    close(name) {
        if (this.windows[name]) {
            this.windows[name].hide();
        }
    }

    render() {
        return React.Children.map(this.props.children,(item)=>{
            item.props.parent = this;
            item.props.ref = c=>this.windows[item.props.name]=c;
            return React.cloneElement(item,item.props,item.props.children);
        })
    }
}

WindowGroup.propTypes = {

};

WindowGroup.defaultProps = {

};

export default WindowGroup;