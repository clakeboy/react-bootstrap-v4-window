/**
 * Created by clakeboy on 2018/10/25.
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import {
    CTable
} from '../../../src/index';
import {
    TableHeader
} from '@clake/react-bootstrap4';

class CTableTest extends React.Component {
    constructor(props) {
        super(props);
        this.table_data = [];

        for (let i=0;i<5;i++) {
            this.table_data.push({'id': i+1, 'name': 'Clake'});
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <React.Fragment>
                <CTable absolute={true} y={'100px'} x={'10px'} width='250px' height='300px' bordered={true} data={this.table_data}>
                    <TableHeader field='id' text='ID' width='100px'/>
                    <TableHeader field='name' text='Name' width='200px'/>
                </CTable>
            </React.Fragment>
        );
    }
}

CTableTest.propTypes = {

};

CTableTest.defaultProps = {

};

export default CTableTest;