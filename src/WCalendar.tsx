import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    Calendar,
    Common,
    ComponentProps,
    i18n
} from '@clake/react-bootstrap4';
import ReactDOM from "react-dom";

interface Props extends ComponentProps {
    value?:any
    combo?:any
    noSearch?:boolean
    format?:string
    onSelect?:(val:any,row:any)=>void
}

interface State {

}

class WCalendar extends React.PureComponent<Props,State> {
    event:any
    calDom:any
    calendar:any
    dom:HTMLDivElement
    constructor(props:any) {
        super(props);
        this.event = null;
        this.calDom = null;
    }

    componentDidMount() {
        this.calDom = ReactDOM.findDOMNode(this.calendar);
    }

    show(e:any) {
        let xy = Common.GetDomXY(e.currentTarget);
        // let fixed = this.calculatePosition(e.currentTarget);
        let positionTop = (xy.top+xy.height);
        this.dom.style.left = (xy.left)+'px';
        this.dom.classList.remove('d-none');
        this.event = e;
        this.calendar.show(e.currentTarget);
        if (positionTop + this.calDom.offsetHeight <
            document.documentElement.scrollTop + document.documentElement.clientHeight) {
                positionTop += 5;
        } 
        this.dom.style.top = positionTop+'px';
    }

    hide = ()=>{
        this.dom.classList.add('d-none');
    };

    calculatePosition(e:any) {
        let scroll = {
            top: e.scrollTop||0,
            left: e.scrollLeft||0
        };

        while((e=e.parentNode) && e !== document.body) {
            if (!e.scrollTop && !e.scrollLeft) continue;
            scroll.top += e.scrollTop;
            scroll.left += e.scrollLeft;
        }


        return scroll;
    }

    selectHandler = (val:any)=>{
        if (typeof this.props.onSelect === 'function') {
            this.props.onSelect(val,this.event);
        }
    };

    getClasses() {
        let base = 'ck-wcombo d-none';

        return classNames(base,this.props.className);
    }

    format() {
        return this.calendar?.format();
    }

    setCurrentDate(d:any) {
        return this.calendar?.setCurrentDate(d);
    }

    render() {
        let lang = i18n.getLang();
        let content = (
            <div ref={(c:any)=>this.dom=c} className={this.getClasses()}>
                <Calendar ref={(c:any)=> this.calendar = c} onSelect={this.selectHandler}
                          value={this.props.value}
                          format={this.props.format}
                          lang={lang.short} none shadow absolute triangular='up' sm/>
            </div>
        );

        let mainDom = document.getElementById('wcalendar');
        if (!mainDom) {
            mainDom = document.createElement("DIV");
            mainDom.id = 'wcalendar';
            document.body.appendChild(mainDom);
        }

        return ReactDOM.createPortal(
            content,mainDom
        );
    }
}

export default WCalendar;