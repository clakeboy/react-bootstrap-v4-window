import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import './css/CTableInput.less';
import {
    i18n,
    Icon
} from '@clake/react-bootstrap4';
import WCombo from "./WCombo";
import WCalendar from './WCalendar';
class CTableInput extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            value:this.parseValue(this.props.data),
            // value: this.props.data || '',
            comboData:this.props.comboData
        };
    }

    componentDidMount(){
        if (this.props.calendar) {
            this.input.addEventListener('focus', (e) => {
                this.calendar.show(e);
            }, false);
            this.input.addEventListener('mousedown', (e) => {
                e.stopPropagation();
            }, false);
        }
        if (this.props.combo) {
            this.input.addEventListener('focus', (e) => {
                this.combo.show(this.state.value,e);
            }, false);
            this.input.addEventListener('mousedown', (e) => {
                e.stopPropagation();
            }, false);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: this.parseValue(nextProps.data),
            // value: nextProps.value || '',
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

    parseValue(val) {
        if (val === null || val === undefined) {
            return "";
        } else {
            return '' + val;
        }
    }

    getClasses() {
        let base = 'ck-ctable-input';

        return classNames(base,this.props.className);
    }

    changeHandler = (e) => {
        this.setState({
            value: e.target.value
        });
        // console.log(e.target,e.currentTarget)
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(e,e.target.value);
        }
        if (this.combo) {
            this.combo.filter(e.target.value);
        }
    };

    dblHandler = (e)=> {
        if (this.calendar && !this.state.value) {
            this.calendar.setCurrentDate(new Date());
            let val = this.calendar.format()
            this.setState({value:val})
            if (typeof this.props.onChange === 'function') {
                this.props.onChange(e,val);
            }
            this.calendar.hide();
        }
    };

    selectHandler = (val,row,e)=>{
        this.setState({
            value:val
        });
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(e,val,row);
        }
    };

    calendarSelectHandler = (val,e)=>{
        this.setState({
            value:val
        });
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(e,val);
        }
    };

    render() {
        let inputStyle = {};
        if (this.props.align) {
            inputStyle.textAlign = this.props.align;
        }
        let inputClasses = '';
        if (this.props.combo || this.props.calendar) {
            inputClasses = 'right-icon';
        }
        return (
            <div className={this.getClasses()}>
                <input ref={c=>this.input=c} type='text' {...this.props}
                       onChange={this.changeHandler}
                       onDoubleClick={this.dblHandler}
                       disabled={this.props.disabled}
                       style={inputStyle}
                       className={inputClasses}
                       value={this.state.value}/>
                {this.renderCombo()}
                {this.renderCalendar()}
            </div>
        );
    }

    renderCombo() {
        if (!this.props.combo) {
            return null;
        }
        let input_icon = 'ck-wcombo-icon';
        return (
            <div className='ck-input-calendar'>
                <WCombo ref={c => this.combo = c} combo={this.props.combo}
                       data={this.state.comboData} noSearch={this.props.readOnly}
                       onSelect={this.selectHandler}/>
                <div className={input_icon} onClick={() => {
                    this.input.focus();
                }}><Icon icon='angle-down'/></div>
            </div>
        )
    }

    renderCalendar() {
        if (!this.props.calendar) {
            return null;
        }
        let input_icon = 'ck-wcalendar-icon';
        return (
            <div className='ck-input-calendar'>
                <WCalendar ref={c => this.calendar = c} onSelect={this.calendarSelectHandler}
                           value={this.state.value}
                           format={this.props.calendarFormat}/>
                <div className={input_icon} onClick={() => {
                    this.input.focus();
                }}><Icon iconType='regular' icon='calendar-alt'/></div>
            </div>
        )
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
    onSelect: PropTypes.func,
};

CTableInput.defaultProps = {

};

export default CTableInput;