/**
 * Created by clakeboy on 2018/10/25.
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import {
    CTable,
    Window,
    WModal
} from '../../../src/index';
import {
    TableHeader,
    Button
} from '@clake/react-bootstrap4';
import {RandomString} from "../../../src/Common";

class CTableTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            table_data:[],
            data_count:0,
            page:1
        };

        if (this.props.parent instanceof Window) {
            //window 窗体对像
            this.window = this.props.parent;
            //window 管理对像
            this.manage = this.window.parent;
            //传送的窗体参数
            this.params = this.window.params;
        }

        this.org_data;

        this.id = 1;
    }

    componentDidMount() {
        console.log(this.window);
        console.log(this.manage);
        console.log(this.params);
        this.window.on(Window.EVT_SHOW,this.showHandler);
        this.window.on(Window.EVT_CLOSE,this.closeHandler);
        this.getData()
    }

    getData() {
        this.modal.loading('loading');
        this.id++;
        setTimeout(()=>{
            let data = [];
            for (let i=0;i<5;i++) {
                data.push({'id': i+1, 'name': `${this.id}-${RandomString(32)}`});
            }
            this.org_data = data.slice(0);
            this.setState({
                table_data:data,
                page:1,
                data_count:data.length
            });
            this.modal.alert('loading ssussce');
        },200)
    }

    showHandler = ()=>{
        this.getData();
    };

    closeHandler = ()=>{
        this.modal.alert('关闭窗口');
    };

    clickHandler = ()=>{
        this.modal.alert({
            title:'Tips',
            content:'Alert message',
            fade:true
        });
        this.id ++;
        this.manage.open('f_abha_house_review',{id:this.id});
    };

    sortHandler = (field,sort_type)=>{
        let desc = sort_type === 'desc';
        let data = this.state.table_data.slice(0);
        data.sort((a,b)=>{
            if (a[field] > b[field]) return desc?-1:1;
            if (a[field] < b[field]) return desc?1:-1;
            if (a[field] === b[field]) return 0;
        });
        this.setState({table_data:data})
    };

    filterHandler = (text,field,type)=>{
        console.log(text,field,type);
        let reg;
        switch (type) {
            case "start":
                reg = new RegExp(`^${text}`);
                break;
            case "end":
                reg = new RegExp(`${text}$`);
                break;
            case "clear":
                this.setState({
                    table_data:this.org_data.slice(0)
                });
                return;
            default:
                reg = new RegExp(`${text}`);
        }
        let data = this.state.table_data.slice(0);
        let filter = [];
        data.forEach((item)=>{
            if (reg.test(item[field])) {
                filter.push(item);
            }
        });

        this.setState({
            table_data: filter
        });
    };

    render() {
        return (
            <React.Fragment>
                <Button absolute y='10px' x='10px' size='sm' onClick={this.clickHandler}>Alert</Button>
                <CTable position={{
                    right:'10px',
                    left:'10px',
                    bottom:'10px'
                }} move absolute={true} y={'100px'} x={'10px'} width='250px' height='300px' bordered={true}
                        onSelectPage={(page)=>{
                            console.log(page);
                        }}
                        page={this.state.page}
                        dataCount={this.state.data_count}
                        data={this.state.table_data}
                        onFilter={this.filterHandler}
                        onSort={this.sortHandler}
                        total={{id:10}}
                >
                    <TableHeader field='id' text='ID' width='100px'/>
                    <TableHeader field='name' text='Name' width='200px'/>
                </CTable>
                <WModal ref={c=>this.modal=c} fade/>
            </React.Fragment>
        );
    }
}

CTableTest.propTypes = {

};

CTableTest.defaultProps = {

};


export default CTableTest;