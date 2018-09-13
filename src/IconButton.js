import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import './css/IconButton.less';

class IconButton extends React.PureComponent {
    constructor(props) {
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
        let base = {};
        if (this.props.color) {
            base.color = this.props.color;
        }
        return base;
    }

    render() {
        return (
            <span ref={c=>this.dom=c} className={this.getClasses()} style={this.getStyles()}>

            </span>
        );
    }
}

IconButton.propTypes = {
    iconType: PropTypes.oneOf(['solid', 'regular', 'light', 'brands']),
    icon    : PropTypes.string,
    color   : PropTypes.string,
    onClick: PropTypes.func
};

IconButton.defaultProps = {};

export default IconButton;