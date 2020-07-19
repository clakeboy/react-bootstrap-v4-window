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
class FEfcWorkQuery extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'f_efc_work_query';
		this.title = 'Query EFC Work Log';
        if (!this.props.width) {
            this.width = '816px';
        }
        if (!this.props.height) {
            this.height = '540px';
        }
		this.source = 'v_efc_work_query_general';
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
                <Box jsxId={'Box1137'} absolute={true} x={'96px'} y={'0px'} width={'720px'} height={'28px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'} backColor={'rgb(37,62,82)'}/>
                <CTable jsxId={'sub_efc_work_query_general'} absolute={true} x={'20px'} y={'76px'} width={'776px'} height={'444px'} scroll={true} headerTheme={'light'} hover={true} select={false} sm={true} fontSm={true} source={'v_efc_work_query_general'}>
                    <Table.Header field={'efc_work_id'} text={'Seq No.'} width={'60px'}/>
                    <Table.Header field={'status_desc'} text={'Status'} width={'104px'}/>
                    <Table.Header field={'urs_type_desc'} text={'Type'} width={'80px'}/>
                    <Table.Header field={'work_subject'} text={'Work Subject'} width={'164px'}/>
                    <Table.Header field={'urs_log_no'} text={'Log No.'} width={'76px'}/>
                    <Table.Header field={'review_by_code'} text={'Review By'} width={'72px'}/>
                    <Table.Header field={'priority_desc'} text={'Priority'} width={'72px'}/>
                    <Table.Header field={'sys_type_code'} text={'Sys'} width={'64px'}/>
                    <Table.Header field={'assign_to_code'} text={'Assign'} width={'60px'}/>
                    <Table.Header field={'coder_start_date'} text={'Coder Start'} width={'84px'}/>
                    <Table.Header field={'coder_finish_date'} text={'Coder Finish'} width={'88px'}/>
                    <Table.Header field={'test_by_code'} text={'Test By'} width={'60px'}/>
                    <Table.Header field={'complete_date'} text={'Complete Date'} width={'84px'}/>
                    <Table.Header field={'implement_date'} text={'Implement Date'} width={'88px'}/>
                    <Table.Header field={'work_note'} text={'Work Note'} width={'208px'}/>
                    <Table.Header field={'created_by_code'} text={'Created By'} width={'72px'}/>
                    <Table.Header field={'created_date'} text={'Created Date'} width={'84px'}/>
                    <Table.Header field={'modified_by_code'} text={'Modified By'} width={'76px'}/>
                    <Table.Header field={'modified_date'} text={'Modified Date'} width={'84px'}/>
                </CTable>
                <Input jsxId={'status_id'} field={'status_id'} size={'xs'} absolute={true} x={'96px'} y={'40px'} width={'108px'} align={'left'} combo={{
                    onSearch:ComboSearch('status_desc','q_efc_work_tb_status'),
                    searchColumn:'status_desc',
                    width:'113px',
                    filterColumns:[
                        {field:'status_desc',width:'113px'}
                    ]
                }}/>
                <Label jsxId={'lbl_status_id'} sm={true} absolute={true} text={'Status'} x={'16px'} y={'40px'} width={'72px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'assign_to_code'} field={'assign_to_code'} absolute={true} size={'xs'} x={'468px'} y={'40px'} width={'92px'} tabIndex={'3'} align={'left'}/>
                <Label jsxId={'Label24'} sm={true} absolute={true} text={'Assign to'} x={'384px'} y={'40px'} width={'80px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Button jsxId={'btn1Open'} absolute={true} size={'xs'} x={'684px'} y={'36px'} width={'52px'} height={'28px'} outline={true} theme={'dark'}>
                    Open
                </Button>
                <Input jsxId={'urs_type_code'} field={'urs_type_code'} size={'xs'} absolute={true} x={'272px'} y={'40px'} width={'92px'} align={'left'} combo={{
                    onSearch:ComboSearch('urs_type_desc','q_urs_tb_type'),
                    searchColumn:'urs_type_desc',
                    width:'92px',
                    filterColumns:[
                        {field:'urs_type_desc',width:'75px'}
                    ]
                }}/>
                <Label jsxId={'Label22'} sm={true} absolute={true} text={'Type'} x={'220px'} y={'40px'} width={'44px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Button jsxId={'btn1Close'} absolute={true} size={'xs'} x={'736px'} y={'36px'} width={'52px'} height={'28px'} outline={true} theme={'info'}>
                    Close
                </Button>
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

export default FEfcWorkQuery;
