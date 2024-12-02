import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './css/CTableInput.less';
import {
    Calendar,
    Combo,
    ComponentProps,
    i18n,
    Icon
} from '@clake/react-bootstrap4';
import WCombo from "./WCombo";
import WCalendar from './WCalendar';

interface Props extends ComponentProps {
    data?: any
    align?: string
    disabled?: boolean
    combo?: any
    comboData?: any
    calendar?: any
    onChange?: (evt:any,val:any,row?:any)=>void
    onSelect?: ()=>void
    onFocus?: (e:any)=>void
    onBlur?:(e:any)=>void
    readOnly?: boolean
    calendarFormat?: string
    number?: boolean //只能输入数字
}

interface State {
    value: string
    comboData:any
}

class CTableInput extends React.Component<Props,State> {
    input: HTMLInputElement
    calendar:Calendar
    combo: Combo
    constructor(props:any) {
        super(props);
        this.state={
            value:this.parseValue(this.props.data),
            // value: this.props.data || '',
            comboData:this.props.comboData
        };
    }

    componentDidMount(){
        if (this.props.calendar) {
            this.input.addEventListener('focus', (e:any) => {
                this.calendar.show(e);
            }, false);
            this.input.addEventListener('mousedown', (e:any) => {
                e.stopPropagation();
            }, false);
        }
        if (this.props.combo) {
            this.input.addEventListener('focus', (e:any) => {
                this.combo.show(this.state.value,e);
            }, false);
            this.input.addEventListener('mousedown', (e) => {
                e.stopPropagation();
            }, false);
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps:Props) {
        this.setState({
            value: this.parseValue(nextProps.data),
            // value: nextProps.value || '',
            comboData: nextProps.comboData
        });
    }

    shouldComponentUpdate(nextProps:Props, nextState:State) {
        if (nextProps.comboData !== this.props.comboData) {
            return true;
        }
        if (nextProps.disabled !== this.props.disabled) {
            return true
        }
        return nextState.value !== this.state.value;
    }

    parseValue(val:any) {
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

    changeHandler = (e:any) => {
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

    dblHandler = (e:any)=> {
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

    selectHandler = (val:any,row:any,e:any)=>{
        this.setState({
            value:val
        });
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(e,val,row);
        }
    };

    calendarSelectHandler = (val:any,e:any)=>{
        this.setState({
            value:val
        });
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(e,val);
        }
    };

    render() {
        let inputStyle:any = {};
        if (this.props.align) {
            inputStyle.textAlign = this.props.align;
        }
        let inputClasses = '';
        if (this.props.combo || this.props.calendar) {
            inputClasses = 'right-icon';
        }
        let tp:any = {
            type: this.props.number?'number':'text'
        }
        if (this.props.number) {
            tp['step'] = 'any'
        } 
        return (
            <div className={this.getClasses()}>
                <input ref={(c:any)=>this.input=c} {...tp} {...this.props} size={undefined}
                       onChange={this.changeHandler}
                       onDoubleClick={this.dblHandler}
                       disabled={this.props.disabled}
                       onFocus={this.props.onFocus}
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
                <WCombo ref={(c:any) => this.combo = c} combo={this.props.combo}
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
                <WCalendar ref={(c:any) => this.calendar = c} onSelect={this.calendarSelectHandler}
                           value={this.state.value}
                           format={this.props.calendarFormat}/>
                <div className={input_icon} onClick={() => {
                    this.input.focus();
                }}><Icon iconType='regular' icon='calendar-alt'/></div>
            </div>
        )
    }
}

export default CTableInput;