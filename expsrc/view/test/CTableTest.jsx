/**
 * Created by clakeboy on 2018/10/25.
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import {
    CTable,
    Window
} from '../../../src/index';
import {
    TableHeader,
    CKModal,
} from '@clake/react-bootstrap4';

class CTableTest extends React.Component {
    constructor(props) {
        super(props);
        this.table_data = [];

        for (let i=0;i<5;i++) {
            this.table_data.push({'id': i+1, 'name': 'Clake'+i});
        }

        if (this.props.parent instanceof Window) {
            this.window = this.props.parent;
        }
    }

    componentDidMount() {
        console.log(this.window);
        this.window.on(Window.EVT_SHOW,this.showHandler);
        this.window.on(Window.EVT_CLOSE,this.closeHandler);
    }

    showHandler = ()=>{
        this.modal.alert('打开窗口');
    };

    closeHandler = ()=>{
        this.modal.alert('关闭窗口');
    };

    render() {
        return (
            <React.Fragment>
                <CTable position={{
                    right:'10px',
                    left:'10px',
                    bottom:'10px'
                }} absolute={true} y={'100px'} x={'10px'} width='250px' height='300px' bordered={true} data={this.table_data}>
                    <TableHeader field='id' text='ID' width='100px'/>
                    <TableHeader field='name' text='Name' width='200px'/>
                </CTable>
                <CKModal ref={c=>this.modal=c}/>
            </React.Fragment>
        );
    }
}

CTableTest.propTypes = {

};

CTableTest.defaultProps = {

};

CTableTest.contextTypes = {
    window:PropTypes.object
};

export default CTableTest;