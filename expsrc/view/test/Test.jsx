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
    Common,
    Table
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

        this.combo_data = [
            {
                "id"             : 3,
                "task_name"      : "测试通知",
                "time_rule"      : "0 * * * * *",
                "source"         : "System"
            },
            {
                "id"             : 2,
                "task_name"      : "测试一次通知",
                "time_rule"      : "* */1 * * * *",
                "source"         : "System",
            },
            {
                "id"             : 1,
                "task_name"      : "测试任务",
                "time_rule"      : "0 * * * * *",
                "source"         : "",
            },
            {
                "id"             : 3,
                "task_name"      : "测试通知",
                "time_rule"      : "0 * * * * *",
                "source"         : "System"
            },
            {
                "id"             : 2,
                "task_name"      : "测试一次通知",
                "time_rule"      : "* */1 * * * *",
                "source"         : "System",
            },
            {
                "id"             : 1,
                "task_name"      : "测试任务",
                "time_rule"      : "0 * * * * *",
                "source"         : "",
            },
            {
                "id"             : 3,
                "task_name"      : "测试通知",
                "time_rule"      : "0 * * * * *",
                "source"         : "System"
            },
            {
                "id"             : 2,
                "task_name"      : "测试一次通知",
                "time_rule"      : "* */1 * * * *",
                "source"         : "System",
            },
            {
                "id"             : 1,
                "task_name"      : "测试任务",
                "time_rule"      : "0 * * * * *",
                "source"         : "",
            }
        ];

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
            if (type === 'exclude') {
                if (!reg.test(item[field])) {
                    filter.push(item);
                }
            } else {
                if (reg.test(item[field])) {
                    filter.push(item);
                }
            }
        });

        this.setState({
            table_data: filter
        });
    };

    testHandler = ()=>{
        console.log(this.edit_table.getEditRows());
    };

    ComboSearch() {

    }

    render() {
        return (
            <React.Fragment>
                <Button absolute y='10px' x='10px' size='sm' onClick={this.clickHandler}>Alert</Button>
                <Button absolute y='10px' x='110px' size='sm' onClick={this.testHandler}>Get Edit Data</Button>
                <CTable jsxId={'sub_wrk_detail_item'} absolute={true} x={'20px'} y={'309px'} width={'703px'} height={'139px'} scroll={true} headerTheme={'light'} hover={true} select={false} sm={true} fontSm={true} foot={false} source={'v_wrk_item'} data={this.state.tableData} ref={c=>this.queryTable=c} page={this.state.page} dataCount={this.state.dataCount} onSelectPage={this.getData} showNumbers={50} edit={true}>
                    <Table.Header field={'item_seq_no'} text={'Seq'} width={'36px'} align={'center'} type={''}/>
                    <Table.Header field={'item_desc'} text={'Item Desc'} width={'204px'} align={'left'} type={''}/>
                    <Table.Header field={'item_by_code'} text={'Wrok By'} width={'68px'} align={'left'} type={''}/>
                    <Table.Header field={'item_type_code'} text={'Type'} width={'96px'} align={''} type={'combo'} combo={{
                        onSearch:this.ComboSearch('item_type_code','q_wrk_tb_item_type'),
                        searchColumn:'item_type_code',
                        width:'220px',
                        header:false,
                        filterColumns:[
                            {field:'item_type_code',width:'76px'},
                            {field:'item_type_desc',width:'144px'}
                        ]
                    }}/>
                    <Table.Header field={'item_status_code'} text={'Status'} width={'48px'} align={'center'} type={''}/>
                    <Table.Header field={'item_hour'} text={'A-Hour'} width={'48px'} align={'center'} type={''}/>
                    <Table.Header field={'item_start_date'} text={'Start Date'} width={'76px'} align={'center'} onFormat={val=>val?moment(val).format('YY-MM-DD'):''} type={'calendar'}/>
                    <Table.Header field={'item_start_date'} text={'Complete'} width={'76px'} align={'center'} onFormat={val=>val?moment(val).format('YY-MM-DD'):''} type={'calendar'}/>
                    <Table.Header field={'ask_by_code'} text={'Ask By'} width={'68px'} align={'left'} type={''}/>
                    <Table.Header field={'item_hour'} text={'E-Hour'} width={'48px'} align={'center'} type={''}/>
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