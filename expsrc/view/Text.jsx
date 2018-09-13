/**
 * Created by clakeboy on 2018/8/28.
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

class Text extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    getClasses() {
        let base = '';

        return classNames(base,this.props.className);
    }

    render() {
        return (
            <div className={this.getClasses()}>

            </div>
        );
    }
}

Text.propTypes = {

};

Text.defaultProps = {

};

export default Text;