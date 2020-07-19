import React from 'react';
import ReactBootstrap4,{
    Container,
    Input,
    Button,
    CCheckbox,
    Table,
    Pagination,
    Dropdown,
    Select,
    Calendar,
    TextArea,
    Switch,
    Label,
    TabsContent,
    Tabs,
    Box,
	Form,
	Radio,
	RadioGroup
} from '@clake/react-bootstrap4';
import {
    CTable,
	Window,
	WModal
} from '../../../src/index'
import {GetData,ComboSearch} from '../../common/DataService';
class FEfcReleaseQuery extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'f_efc_release_query';
		this.title = 'Query EFC Release Log';
        if (!this.props.width) {
            this.width = '816px';
        }
        if (!this.props.height) {
            this.height = '536px';
        }
		this.source = 'v_efc_release_query_general';
		if (this.props.parent instanceof Window) {
            //window 窗体对像
            this.window = this.props.parent;
            //window 管理对像
            this.manage = this.window.parent;
            //传送的窗体参数
            this.params = this.window.params;
        }

		this.state = {
			data:{}
		};
    }

    componentDidMount() {
		this.window.on(Window.EVT_SHOW,this.showHandler);
        this.window.on(Window.EVT_CLOSE,this.closeHandler);
    }

    showHandler = ()=>{
        
    };

    closeHandler = ()=>{
        
    };


	fieldChangeHandler = (field,val,row)=>{
		let data = this.state.data;
		data[field] = val;
		this.setState({data:data});
	};

	clearField() {
		this.setState({data:this.form.getNew()});
	}

    render() {
        return (
            <Form ref={c=>this.form=c} onChange={this.fieldChangeHandler}>
                <CTable jsxId={'sub_efc_release_query_general'} absolute={true} x={'20px'} y={'76px'} width={'776px'} height={'440px'} scroll={true} headerTheme={'light'} hover={true} select={false} sm={true} fontSm={true} source={'v_efc_release_query_general'}>
                    <Table.Header field={'efc_release_id'} text={'Seq No.'} width={'60px'}/>
                    <Table.Header field={'status_desc'} text={'Status'} width={'80px'}/>
                    <Table.Header field={'efc_release_no'} text={'Release No.'} width={'92px'}/>
                    <Table.Header field={'sub_version_no'} text={'Sub Version'} width={'72px'}/>
                    <Table.Header field={'est_release_date'} text={'Rrelease Date'} width={'84px'}/>
                    <Table.Header field={'release_note'} text={'Release Note'} width={'284px'}/>
                    <Table.Header field={'created_by_code'} text={'Created By'} width={'72px'}/>
                    <Table.Header field={'created_date'} text={'Created Date'} width={'88px'}/>
                    <Table.Header field={'modified_by_code'} text={'Modified By'} width={'72px'}/>
                    <Table.Header field={'modified_date'} text={'Modified Date'} width={'84px'}/>
                </CTable>
                <Input jsxId={'status_id'} field={'status_id'} size={'xs'} absolute={true} x={'100px'} y={'40px'} width={'92px'} align={'left'} combo={{
                    onSearch:ComboSearch('status_desc','q_efc_release_tb_status'),
                    searchColumn:'status_desc',
                    width:'92px',
                    filterColumns:[
                        {field:'status_desc',width:'75px'}
                    ]
                }}/>
                <Label jsxId={'lbl_status_id'} sm={true} absolute={true} text={'Status'} x={'20px'} y={'40px'} width={'72px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Box jsxId={'Box1137'} absolute={true} x={'96px'} y={'0px'} width={'720px'} height={'28px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'} backColor={'rgb(37,62,82)'}/>
                <Button jsxId={'btn0Query'} absolute={true} size={'xs'} x={'0px'} y={'0px'} width={'48px'} height={'24px'} outline={true}>
                    Query
                </Button>
                <Button jsxId={'btn0Clear'} absolute={true} size={'xs'} x={'48px'} y={'0px'} width={'48px'} height={'24px'} outline={true}>
                    Clear
                </Button>
                <Box jsxId={'Box1142'} absolute={true} x={'0px'} y={'0px'} width={'96px'} height={'28px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
            </Form>
        );
    }
}

export default FEfcReleaseQuery;
