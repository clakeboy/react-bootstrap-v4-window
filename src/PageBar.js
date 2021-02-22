import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import './css/PageBar.less';
import {
    Icon
} from '@clake/react-bootstrap4';
class PageBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page:this.props.page,
            dataCount: this.props.dataCount,
            pages: this.calPage(this.props.dataCount,this.props.showNumbers),
        };
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps !== this.props) {
            this.setState({
                page:nextProps.page,
                dataCount: nextProps.dataCount,
                pages: this.calPage(nextProps.dataCount,nextProps.showNumbers),
            })
        }
    }

    calPage(count,number) {
        let pages = parseInt(count / number);
        if (count % number !== 0) {
            pages += 1;
        }
        return pages;
    }

    getClasses() {
        let base = 'ck-pagebar-main d-flex align-items-center';

        return classNames(base,this.props.className);
    }

    changePage(page) {
        if (page < 1) {
            page = 1;
        }

        if (page > this.state.pages) {
            page = this.state.pages;
        }
        if (typeof this.props.onSelect === 'function') {
            this.props.onSelect(page);
        }
    }

    render() {
        return (
            <div className={this.getClasses()}>
                <div className='total'>
                    {this.props.dataCount}
                </div>
                {!this.props.noPage?<div className='page d-flex align-items-center align-self-center'>
                    <div className='icon-btn' onClick={()=>{
                        this.changePage(this.state.page-1);
                    }}><Icon icon='angle-double-left'/></div>
                    <div className='page-show'>
                        <input onChange={(e)=>{
                            this.setState({
                                page:e.value
                            })
                        }} onKeyUp={(e)=>{
                            if (e.keyCode === 13) {
                                this.changePage(parseInt(e.target.value));
                            }
                        }} type="number" min="1" max={this.state.pages} value={this.state.page}/> / {this.state.pages}
                    </div>
                    <div className='icon-btn' onClick={()=>{
                        this.changePage(this.state.page+1);
                    }}><Icon icon='angle-double-right'/></div>
                </div>:null}
            </div>
        );
    }
}

PageBar.propTypes = {
    dataCount   : PropTypes.number,
    page        : PropTypes.number,
    showNumbers  : PropTypes.number,
    showPages   : PropTypes.number,
    onSelect: PropTypes.func,
    noPage: PropTypes.bool,
};

PageBar.defaultProps = {

};

export default PageBar;