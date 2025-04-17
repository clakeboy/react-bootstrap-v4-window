import React from 'react';
import classNames from 'classnames';
import './css/CTableText.less';
import {
    ComponentProps,
    TextArea,

} from '@clake/react-bootstrap4';

interface Props extends ComponentProps {
    data?: any
    align?: string
    disabled?: boolean
    onChange?: (evt:any,val:any,row?:any)=>void
    onSelect?: ()=>void
    onFocus?: (e:any)=>void
    onBlur?:(e:any)=>void
    readOnly?: boolean
    rows?: number
}

interface State {
    value: string
}

class CTableTextArea extends React.Component<Props,State> {
    input: TextArea
    constructor(props:any) {
        super(props);
        this.state={
            value:this.parseValue(this.props.data),
        };
    }

    componentDidMount(){
        // console.log('mount',this.input);
        this.input.input.addEventListener('wheel',this.scrollHandler,{passive:false});
    }

    componentWillUnmount(): void {
        this.input.input.removeEventListener('wheel',this.scrollHandler);
    }

    UNSAFE_componentWillReceiveProps(nextProps:Props) {
        this.setState({
            value: this.parseValue(nextProps.data),
        });
    }

    shouldComponentUpdate(nextProps:Props, nextState:State) {
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
        let base = 'ck-ctable-text';

        return classNames(base,this.props.className);
    }

    changeHandler = (val:any,row:any,obj:any) => {
        this.setState({
            value: val
        });
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(obj,val);
        }
    };

    scrollHandler = (e:WheelEvent) => {
        e.stopPropagation()
    };

    render() {
        return (
            <div className={this.getClasses()}>
                <TextArea size='sm' ref={(c:any)=>this.input=c} {...this.props} 
                    onChange={this.changeHandler} 
                    data={this.state.value}
                    rows={this.props.rows??1}
                    />
            </div>
        );
    }
}

export default CTableTextArea;