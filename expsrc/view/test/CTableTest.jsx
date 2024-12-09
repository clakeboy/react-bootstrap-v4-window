/**
 * Created by clakeboy on 2018/10/25.
 */
import React from 'react';
import ReactDOM from 'react-dom';
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
    RImage
} from '@clake/react-bootstrap4';
// } from '@clake/react-bootstrap4';
import html2canvas from 'html2canvas';
class CTableTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            table_data:[],
            data_count:0,
            page:1,
            editDisabled:false,
            editData:[
                {
                    "id":1,
                    "price":500,
                    "name":1,
                    "date":"asdfasdf",
                    "rule":"1aaasdf",
                    "is_chk":1
                },
                {
                    "id":1,
                    "price":33.44,
                    "name":1,
                    "date":"2022-01-02",
                    "rule":Common.RandomString(16),
                    "is_chk":0
                }
            ],
            total:{}
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
        /**
         * @type {CTable}
         */
        this.edit_table = null;
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
            let total = {'id':0}
            for (let i=0;i<5;i++) {
                data.push({
                    'id': "用地址格式就是modules by path ./node_modules/ 1.39 MiB 270 modulesmodule"+i+1, 
                    'name': `${Common.RandomString(32*(i+1))}`,
                    'is_chk':i%2===0,
                    'set_chk':true,
                });
                total.id += i+1
            }
            this.org_data = data.slice(0);
            console.log(total)
            this.setState({
                table_data:data,
                page:1,
                data_count:data.length,
                total:total
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
        // this.modal.alert({
        //     title:'Tips',
        //     content:'Alert message',
        //     fade:true
        // });
        // this.id ++;
        // this.manage.open('test-empty',{id:this.id});
        // let mainDom = ReactDOM.findDOMNode(this.window)
        
        // html2canvas(mainDom).then((canvas)=>{
        //     let dataURL = canvas.toDataURL("image/png")
        //     this.modal.view({
        //         content: <RImage  src={dataURL}/>
        //     })
        // })

        let data = this.edit_table.getEditRows();
        this.modal.alert(JSON.stringify(data))
    };

    sortHandler = (field,sort_type)=>{
        // let desc = sort_type === 'desc';
        // let data = this.state.table_data.slice(0);
        // data.sort((a,b)=>{
        //     if (a[field] > b[field]) return desc?-1:1;
        //     if (a[field] < b[field]) return desc?1:-1;
        //     if (a[field] === b[field]) return 0;
        // });
        // this.setState({table_data:data})
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
        let list = this.table.getSelectRows();
        this.modal.alert(JSON.stringify(list));
    }

    render() {
        return (
            <React.Fragment>
                <Button absolute y='10px' x='10px' size='sm' onClick={this.clickHandler}>Alert</Button>
                <Button absolute y='10px' x='110px' size='sm' onClick={this.testHandler}>Get Edit Data</Button>
                <Button absolute y='10px' x='250px' size='sm' onClick={()=>{
                    this.edit_table.reset();
                }}>Reset</Button>
                <Button absolute y='10px' x='320px' size='sm' onClick={()=>{
                    this.setState({
                        editDisabled:!this.state.editDisabled
                    })
                }}>Disabled edit</Button>
                <CTable ref={c=>this.table=c} noWrap={false} position={{
                    right:'10px',
                    left:'10px',
                    top:'50px',
                }} move absolute={true} y={'100px'} x={'10px'} width='250px' height='200px' bordered={true} select={true}
                        onSelectPage={(page)=>{
                            console.log(page);
                        }}
                        onCheck={(chk,row)=>{
                            console.log(chk,row)
                        }}
                        onCheckAll={(checked,list)=>{
                            console.log(checked,list);
                        }}
                        page={this.state.page}
                        dataCount={this.state.data_count}
                        data={this.state.table_data}
                        onFilter={this.filterHandler}
                        onSort={this.sortHandler}
                        total={this.state.total}
                        customMenu={[{field:'test',text:'测试自定义菜单',click:(e,field,data)=>{
                                console.log(e);
                                console.log(field);
                                console.log(data);
                            }}]}
                >
                    <TableHeader field='id' text='ID' width='100px' dataType='number' onDoubleClick={(row)=>{
                        console.log(row);
                    }} />
                    <TableHeader field='name' text='Name' width='200px' color="white" bgColor="blue" onFormat={(val,row,key)=>{
                        return <span>{val}</span>
                    }}/>
                    <TableHeader field='is_chk' text='Chk' width='100px' type='checkbox' align='center' />
                </CTable>
                <CTable ref={c=>this.edit_table=c} move absolute={true} y={'100px'} x={'10px'} width='250px' height='100px' bordered={true} select={false}
                        edit nodel={false} data={this.state.editData} disabled={this.state.editDisabled}
                        position={{
                            right:'10px',
                            left:'10px',
                            top:'260px',
                            // bottom:'10px',
                        }}
                >
                    <TableHeader field='id' text='ID' width='100px' align='right' disabled={true} onDoubleClick={(row)=>{
                        console.log(row);
                    }} noClone/>
                    <TableHeader field='desc' text='Desc' width='200px' align='right' def="1.56" type="textarea"/>
                    <TableHeader field='price' text='Price' width='100px' align='right' def="1.56" dataType='number'/>
                    <TableHeader field='name' text='Name' width='200px' combo={{
                        header:true,
                        searchColumn:'task_name',
                        filterColumns: [{field:'task_name',text:'Task Name'},{field:'time_rule',text:'Rule'},{field:'source',text:'Source'}],
                        width:'600px'
                    }} comboData={this.combo_data} type='combo'
                        onEdit={(index,val,row,callback)=>{
                            console.log(index,val,row,callback);
                        }} />
                    <TableHeader field='date' text='Date' width='100px' type='calendar' />
                    <TableHeader field='rule' text='Rule' width='100px' type='text' />
                    <TableHeader field='is_chk' text='Chk' width='100px' type='checkbox' align='center'/>
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