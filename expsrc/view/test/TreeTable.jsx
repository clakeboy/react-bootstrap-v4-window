/**
 * Created by clakeboy on 2022/1/24.
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import {CTable, Window} from "../../../src";
import {TableHeader,Common} from "@clake/react-bootstrap4";

class TreeTable extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.parent instanceof Window) {
            //window 窗体对像
            this.window = this.props.parent;
            //window 管理对像
            this.manage = this.window.parent;
            //传送的窗体参数
            this.params = this.window.params;
        }

        this.state = {
            page:1,
            data_count:0,
            table_data:this.generateData(),
        };
    }

    componentDidMount() {
        this.window.on(Window.EVT_SHOW,this.showHandler);
        this.window.on(Window.EVT_CLOSE,this.closeHandler);
    }

    generateData(id) {
        let parent_id = id ?? 0;
        let data = [];
        for (let i=0;i<10;i++) {
            data.push({
                id:i+1+id,
                name: Common.RandomString(30),
                is_chk: i % 2
            });
        }
        return data
    }

    getClasses() {
        let base = '';

        return classNames(base,this.props.className);
    }

    render() {
        return (
            <>
                <CTable position={{
                    right:'10px',
                    left:'10px',
                    top:'50px',
                    bottom: '10px',
                }} move absolute={true} y={'100px'} x={'10px'} width='250px' height='200px' bordered={true} select={true} selectOnce={true}
                        onSelectPage={(page)=>{
                            console.log(page);
                        }}
                        page={this.state.page}
                        dataCount={this.state.data_count}
                        data={this.state.table_data}
                        total={{id:10}}
                        customMenu={[{field:'test',text:'测试自定义菜单',click:(e,field,data)=>{
                                console.log(e);
                                console.log(field);
                                console.log(data);
                            }}]}
                >
                    <TableHeader field='id' text='ID' width='100px' dataType='number' onDoubleClick={(row)=>{
                        console.log(row);
                    }}/>
                    <TableHeader field='name' text='Name' width='300px' onFormat={(val,row,key)=>{
                        return <span>{val}</span>
                    }}/>
                    <TableHeader field='is_chk' text='Chk' width='100px' type='checkbox' align='center' />
                </CTable>
            </>
        );
    }
}

TreeTable.propTypes = {

};

TreeTable.defaultProps = {

};

export default TreeTable;