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
class FUrsLogQuery extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'f_urs_log_query';
		this.title = 'Query EFC Test Log';
        if (!this.props.width) {
            this.width = '820px';
        }
        if (!this.props.height) {
            this.height = '548px';
        }
		this.source = 'v_urs_log_query_general';
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
                <CTable jsxId={'sub_aec_query_general'} absolute={true} x={'20px'} y={'100px'} width={'780px'} height={'428px'} scroll={true} headerTheme={'light'} hover={true} select={false} sm={true} fontSm={true} source={'v_urs_log_query_general'}>
                    <Table.Header field={'urs_log_no'} text={'Report No.'} width={'92px'}/>
                    <Table.Header field={'status_desc'} text={'Status'} width={'72px'}/>
                    <Table.Header field={'urs_type_desc'} text={'Type'} width={'84px'}/>
                    <Table.Header field={'branch_code'} text={'Branch'} width={'52px'}/>
                    <Table.Header field={'urs_date'} text={'Report Date'} width={'84px'}/>
                    <Table.Header field={'urs_by_code'} text={'Report By'} width={'76px'}/>
                    <Table.Header field={'urs_subject'} text={'Report Subject'} width={'244px'}/>
                    <Table.Header field={'priority_desc'} text={'Priority'} width={'72px'}/>
                    <Table.Header field={'review_by_code'} text={'Review By'} width={'76px'}/>
                    <Table.Header field={'review_note'} text={'Review Note'} width={'120px'}/>
                    <Table.Header field={'close_date'} text={'Close Date'} width={'84px'}/>
                    <Table.Header field={'close_by_code'} text={'Close By'} width={'76px'}/>
                    <Table.Header field={'release_date'} text={'Release Date'} width={'88px'}/>
                    <Table.Header field={'close_note'} text={'Close Note'} width={'152px'}/>
                    <Table.Header field={'efc_work_id'} text={'Work ID'} width={'52px'}/>
                    <Table.Header field={'urs_seq_no'} text={'Seq No.'} width={'60px'}/>
                </CTable>
                <Input jsxId={'status_id'} field={'status_id'} size={'xs'} absolute={true} x={'128px'} y={'64px'} width={'92px'} align={'left'} combo={{
                    onSearch:ComboSearch('status_desc','q_urs_tb_status'),
                    searchColumn:'status_desc',
                    width:'92px',
                    filterColumns:[
                        {field:'status_desc',width:'75px'}
                    ]
                }}/>
                <Label jsxId={'lbl_status_id'} sm={true} absolute={true} text={'Report Status'} x={'20px'} y={'64px'} width={'100px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'urs_by_code'} field={'urs_by_code'} absolute={true} size={'xs'} x={'336px'} y={'64px'} width={'92px'} tabIndex={'3'} align={'left'}/>
                <Label jsxId={'Label24'} sm={true} absolute={true} text={'Repot By'} x={'252px'} y={'64px'} width={'80px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Button jsxId={'btn1Open'} absolute={true} size={'xs'} x={'688px'} y={'40px'} width={'52px'} height={'40px'} outline={true} theme={'dark'}>
                    Open Item
                </Button>
                <Button jsxId={'btn1Close'} absolute={true} size={'xs'} x={'740px'} y={'40px'} width={'52px'} height={'40px'} outline={true} theme={'info'}>
                    Close Item
                </Button>
                <Input jsxId={'urs_type_code'} field={'urs_type_code'} size={'xs'} absolute={true} x={'336px'} y={'36px'} width={'92px'} align={'left'} combo={{
                    onSearch:ComboSearch('urs_type_desc','q_urs_tb_type'),
                    searchColumn:'urs_type_desc',
                    width:'92px',
                    filterColumns:[
                        {field:'urs_type_desc',width:'75px'}
                    ]
                }}/>
                <Label jsxId={'Label22'} sm={true} absolute={true} text={'Report Type'} x={'252px'} y={'36px'} width={'80px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'export_agent_code'} field={'efc_group_code'} absolute={true} size={'xs'} x={'128px'} y={'36px'} width={'92px'} tabIndex={'6'} align={'left'}/>
                <Label jsxId={'lbl_company_name'} sm={true} absolute={true} text={'Company Code'} x={'20px'} y={'36px'} width={'104px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Box jsxId={'Box1137'} absolute={true} x={'96px'} y={'0px'} width={'724px'} height={'28px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'} backColor={'rgb(37,62,82)'}/>
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

export default FUrsLogQuery;
