import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import {
    Calendar,
    Common,
    i18n
// } from "../../../git_project/react-bootstrap-v4/src/index";
} from '@clake/react-bootstrap4';
import * as ReactDOM from "react-dom";
class WCalendar extends React.PureComponent {
    constructor(props) {
        super(props);
        this.event = null;
        this.calDom = null;
    }

    componentDidMount() {
        this.calDom = ReactDOM.findDOMNode(this.calendar);
    }

    show(e) {
        let xy = Common.GetDomXY(e.currentTarget);
        // let fixed = this.calculatePosition(e.currentTarget);
        let positionTop = (xy.top+xy.height);

        this.dom.style.left = (xy.left)+'px';

        this.dom.classList.remove('d-none');
        this.event = e;
        this.calendar.show(e.currentTarget);
        if (positionTop + this.calDom.offsetHeight >
            document.documentElement.scrollTop + document.documentElement.clientHeight) {

        } else {
            positionTop += 5;
        }
        this.dom.style.top = positionTop+'px';
    }

    hide = ()=>{
        this.dom.classList.add('d-none');
    };

    calculatePosition(e) {
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

    selectHandler = (val)=>{
        if (typeof this.props.onSelect === 'function') {
            this.props.onSelect(val,this.event);
        }
    };

    getClasses() {
        let base = 'ck-wcombo d-none';

        return classNames(base,this.props.className);
    }

    render() {
        let lang = i18n.getLang();
        let content = (
            <div ref={c=>this.dom=c} className={this.getClasses()}>
                <Calendar ref={c => this.calendar = c} onSelect={this.selectHandler}
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

WCalendar.propTypes = {
    onSelect: PropTypes.func
};

WCalendar.defaultProps = {

};

export default WCalendar;