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
    Button,
    Common
} from '@clake/react-bootstrap4';
// } from '@clake/react-bootstrap4';
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

        this.combo_data = [{
            "id"             : 3,
            "task_name"      : "测试通知",
            "time_rule"      : "0 * * * * *",
            "source"         : "System"
        }, {
            "id"             : 2,
            "task_name"      : "测试一次通知",
            "time_rule"      : "* */1 * * * *",
            "source"         : "System",
        }, {
            "id"             : 1,
            "task_name"      : "测试任务",
            "time_rule"      : "0 * * * * *",
            "source"         : "",
        }]

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
                data.push({'id': i+1, 'name': `${this.id}-${Common.RandomString(32)}`});
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
        console.log('关闭窗体');
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

    testHandler = ()=>{
        console.log(this.edit_table.getEditRows());
    };

    render() {
        return (
            <React.Fragment>
                <Button absolute y='10px' x='10px' size='sm' onClick={this.clickHandler}>Alert</Button>
                <Button absolute y='10px' x='110px' size='sm' onClick={this.testHandler}>Get Edit Data</Button>
                <CTable position={{
                    right:'10px',
                    left:'10px',
                    top:'50px',
                }} move absolute={true} y={'100px'} x={'10px'} width='250px' height='200px' bordered={true}
                        onSelectPage={(page)=>{
                            console.log(page);
                        }}
                        page={this.state.page}
                        dataCount={this.state.data_count}
                        data={this.state.table_data}
                        onFilter={this.filterHandler}
                        onSort={this.sortHandler}
                        total={{id:10}}
                        customMenu={[{field:'test',text:'测试自定义菜单',click:(e,field,data)=>{
                                console.log(e);
                                console.log(field);
                                console.log(data);
                            }}]}
                >
                    <TableHeader field='id' text='ID' width='100px' onDoubleClick={(row)=>{
                        console.log(row);
                    }}/>
                    <TableHeader field='name' text='Name' width='200px'/>
                </CTable>
                <CTable ref={c=>this.edit_table=c} position={{
                    right:'10px',
                    left:'10px',
                    top:'260px',
                    bottom:'10px',
                }} move absolute={true} y={'100px'} x={'10px'} width='250px' height='200px' bordered={true}
                        edit
                        foot={false}
                >
                    <TableHeader field='id' text='ID' width='100px' align='right' disabled={true} onDoubleClick={(row)=>{
                        console.log(row);
                    }}/>
                    <TableHeader field='price' text='Price' width='100px' align='right' />
                    <TableHeader field='name' text='Name' width='200px' combo={{
                        searchColumn:'task_name',
                        width:'600px'
                    }} comboData={this.combo_data} type='combo'/>
                    <TableHeader field='date' text='Date' width='100px' type='calendar' />
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