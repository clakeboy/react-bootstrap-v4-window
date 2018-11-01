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
    }

    componentDidMount() {
        console.log(this.window);
        console.log(this.manage);
        console.log(this.params);
        this.window.on(Window.EVT_SHOW,this.showHandler);
        this.window.on(Window.EVT_CLOSE,this.closeHandler);
        this.modal.loading('loading');
        setTimeout(()=>{
            let data = [];
            for (let i=0;i<5;i++) {
                data.push({'id': i+1, 'name': 'Clake'+i});
            }
            this.setState({
                table_data:data,
                page:1,
                data_count:data.length
            });
            this.modal.alert('loading ssussce');
        },1000)
    }

    showHandler = ()=>{
        this.modal.alert('打开窗口');
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
    };

    render() {
        return (
            <React.Fragment>
                <Button absolute y='10px' x='10px' size='sm' onClick={this.clickHandler}>Alert</Button>
                <CTable position={{
                    right:'10px',
                    left:'10px',
                    bottom:'10px'
                }} absolute={true} y={'100px'} x={'10px'} width='250px' height='300px' bordered={true}
                        onSelectPage={(page)=>{
                            console.log(page);
                        }}
                        page={this.state.page}
                        dataCount={this.state.data_count}
                        data={this.state.table_data}>
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