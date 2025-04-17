import React from 'react';
import classNames from 'classnames';
import './css/PageBar.less';
import {
    ComponentProps,
    Icon
} from '@clake/react-bootstrap4';

interface Props extends ComponentProps {
    page: number
    dataCount: number
    showNumbers: number
    onSelect: (page:number)=>void
    showPages: number
    noPage: boolean
}

interface State {
    page: number
    dataCount: number
    pages: number
}

class PageBar extends React.Component<Props,State> {
    constructor(props:any) {
        super(props);
        this.state = {
            page:this.props.page,
            dataCount: this.props.dataCount,
            pages: this.calPage(this.props.dataCount,this.props.showNumbers),
        };
    }

    componentDidMount() {

    }

    UNSAFE_componentWillReceiveProps(nextProps:Props, nextContext:any) {
        if (nextProps !== this.props) {
            this.setState({
                page:nextProps.page,
                dataCount: nextProps.dataCount,
                pages: this.calPage(nextProps.dataCount,nextProps.showNumbers),
            })
        }
    }

    calPage(count:number,number:number) {
        let pages = Math.floor(count / number);
        if (count % number !== 0) {
            pages += 1;
        }
        return pages;
    }

    getClasses() {
        let base = 'ck-pagebar-main d-flex align-items-center';

        return classNames(base,this.props.className);
    }

    changePage(page:number) {
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
                                page:parseInt(e.target.value)
                            })
                        }} onKeyUp={(e)=>{
                            if (e.keyCode === 13) {
                                this.changePage(parseInt((e.target as HTMLInputElement).value));
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

export default PageBar;