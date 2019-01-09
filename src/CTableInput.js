import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import './css/CTableInput.less';

class CTableInput extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            value:this.props.data || '',
            comboData:this.props.comboData
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.data || '',
            comboData: nextProps.comboData
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.comboData !== this.props.comboData) {
            return true;
        }
        if (nextProps.disabled !== this.props.disabled) {
            return true
        }
        return nextState.value !== this.state.value;
    }

    getClasses() {
        let base = 'ck-ctable-input';

        return classNames(base,this.props.className);
    }

    changeHandler = (e) => {
        this.setState({
            value:e.target.value
        });
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(e,e.target.value);
        }
    };

    render() {
        let inputStyle = {};
        if (this.props.align) {
            inputStyle.textAlign = this.props.align;
        }
        return (
            <div className={this.getClasses()}>
                <input type='text' {...this.props} onChange={this.changeHandler} disabled={this.props.disabled} style={inputStyle} value={this.state.value}/>
            </div>
        );
    }

    renderCombo() {

    }

    renderCalendar() {

    }
}

CTableInput.propTypes = {
    data: PropTypes.any,
    align: PropTypes.string,
    disabled: PropTypes.bool,
    combo: PropTypes.object,
    comboData: PropTypes.any,
    calendar: PropTypes.object,
    onChange: PropTypes.func,
};

CTableInput.defaultProps = {

};

export default CTableInput;