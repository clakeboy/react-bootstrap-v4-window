import React from 'react';
import * as ReactDOM from "react-dom";
import classNames from 'classnames/bind';
import {
    Combo,
    Common
// } from "../../../git_project/react-bootstrap-v4/src/index";
} from '@clake/react-bootstrap4';
import './css/WCombo.less';

class WCombo extends React.PureComponent {
    constructor(props) {
        super(props);

        this.event = null;
        this.calDom = null;
    }

    componentDidMount() {
        this.calDom = ReactDOM.findDOMNode(this.combo);
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown',this.hide,false);
    }

    show(search,e) {
        let xy = Common.GetDomXY(e.currentTarget);
        // let fixed = this.calculatePosition(e.currentTarget);
        // console.log(fixed);
        let positionTop = (xy.top+xy.height);
        this.dom.style.left = (xy.left)+'px';
        this.dom.classList.remove('d-none');
        this.event = e;
        this.combo.show(search,e.currentTarget);
        if (positionTop + this.calDom.offsetHeight >
            document.documentElement.scrollTop + document.documentElement.clientHeight) {
        } else {
            positionTop += 5;
        }
        this.dom.style.top = (positionTop)+'px';
    }

    hide = ()=>{
        this.dom.classList.add('d-none');
    };

    filter(val) {
        this.combo.filter(val);
    }

    getClasses() {
        let base = 'ck-wcombo d-none';

        return classNames(base,this.props.className);
    }

    selectHandler = (val,row)=>{
        if (typeof this.props.onSelect === 'function') {
            this.props.onSelect(val,row,this.event);
        }
    };

    render() {
        let content = (
            <div ref={c=>this.dom=c} className={this.getClasses()}>
                <Combo ref={c => this.combo = c} {...this.props.combo} sm
                       data={this.props.data} noSearch={this.props.noSearch}
                       onSelect={this.selectHandler} onClose={this.hide}/>
            </div>
        );

        let mainDom = document.getElementById('wcombo');
        if (!mainDom) {
            mainDom = document.createElement("DIV");
            mainDom.id = 'wcombo';
            mainDom.className = 'ck-wcombo-container';
            document.body.appendChild(mainDom);
        }

        return ReactDOM.createPortal(
            content,mainDom
        );
    }
}

WCombo.propTypes = {

};

WCombo.defaultProps = {

};

export default WCombo;