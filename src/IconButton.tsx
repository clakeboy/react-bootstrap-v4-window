import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './css/IconButton.less';
import { ComponentProps } from '@clake/react-bootstrap4';

interface Props extends ComponentProps {
    onClick?:(evt:any)=>void
    iconType?:string //['solid', 'regular', 'light', 'brands']
    icon?:string
    color?:string
}


class IconButton extends React.PureComponent<Props,any> {
    dom:HTMLElement
    constructor(props:any) {
        super(props);
    }

    componentDidMount() {
        this.dom.addEventListener('mousedown',(e)=>{
            e.preventDefault();e.stopPropagation();
        },false);
        this.dom.addEventListener('click',(e)=>{
            if (typeof this.props.onClick === 'function') {
                this.props.onClick(e);
            }
        },false);
    }

    getClasses() {
        let base = 'ck-icon-button';
        let iconType;
        switch (this.props.iconType) {
            case 'regular':
                iconType = 'far';
                break;
            case 'light':
                iconType = 'fal';
                break;
            case 'brands':
                iconType = 'fab';
                break;
            default:
                iconType = 'fas';
        }

        base = classNames(base, iconType, `fa-${this.props.icon}`);

        return classNames(base, this.props.className);
    }

    getStyles() {
        let base:any = {};
        if (this.props.color) {
            base.color = this.props.color;
        }
        return base;
    }

    render() {
        return (
            <span ref={(c:any)=>this.dom=c} className={this.getClasses()} style={this.getStyles()}>

            </span>
        );
    }
}

export default IconButton;