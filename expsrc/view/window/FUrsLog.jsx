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
class FUrsLog extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'f_urs_log';
		this.title = 'User Reporting System';
        if (!this.props.width) {
            this.width = '636px';
        }
        if (!this.props.height) {
            this.height = '484px';
        }
		this.source = 's_urs';
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
                <Input jsxId={'urs_log_no'} field={'urs_log_no'} absolute={true} size={'xs'} x={'88px'} y={'36px'} width={'108px'} tabIndex={'0'} align={'left'} readOnly={true}/>
                <Label jsxId={'Label719'} sm={true} absolute={true} text={'URS No.'} x={'20px'} y={'36px'} width={'60px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'urs_date'} field={'urs_date'} absolute={true} size={'xs'} x={'260px'} y={'120px'} width={'112px'} tabIndex={'1'} align={'left'} calendar={{format:'YYYY-MM-DD'}}/>
                <Label jsxId={'Label724'} sm={true} absolute={true} text={'Priority - URS Date'} x={'36px'} y={'120px'} width={'124px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Box jsxId={'box_00_11'} absolute={true} x={'392px'} y={'104px'} width={'224px'} height={'128px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                <TextArea jsxId={'urs_attachment'} field={'urs_attachment'} absolute={true} size={'xs'} x={'20px'} y={'264px'} width={'596px'} tabIndex={'2'} height={'200px'}/>
                <Label jsxId={'Label774'} sm={true} absolute={true} text={'Attachment'} x={'20px'} y={'244px'} width={'540px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'}/>
                <Box jsxId={'Box732'} absolute={true} x={'20px'} y={'104px'} width={'372px'} height={'128px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                <Input jsxId={'urs_by_code'} field={'urs_by_code'} absolute={true} size={'xs'} x={'308px'} y={'184px'} width={'64px'} tabIndex={'3'} align={'left'} readOnly={true}/>
                <Input jsxId={'urs_subject'} field={'urs_subject'} absolute={true} size={'xs'} x={'88px'} y={'68px'} width={'296px'} tabIndex={'4'} align={'left'}/>
                <Label jsxId={'Label741'} sm={true} absolute={true} text={'Subject'} x={'20px'} y={'68px'} width={'60px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'priority_id'} field={'priority_id'} size={'xs'} absolute={true} x={'168px'} y={'120px'} width={'84px'} align={'left'} combo={{
                    onSearch:ComboSearch('priority_desc','q_urs_tb_priority'),
                    searchColumn:'priority_desc',
                    width:'84px',
                    filterColumns:[
                        {field:'priority_desc',width:'75px'}
                    ]
                }}/>
                <Input jsxId={'review_by_code'} field={'review_by_code'} absolute={true} size={'xs'} x={'524px'} y={'116px'} width={'72px'} tabIndex={'6'} align={'left'} readOnly={true}/>
                <Label jsxId={'Label748'} sm={true} absolute={true} text={'Reviewer - Note'} x={'408px'} y={'116px'} width={'108px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <TextArea jsxId={'close_note'} field={'close_note'} absolute={true} size={'xs'} x={'408px'} y={'148px'} width={'188px'} tabIndex={'7'} height={'68px'} readOnly={true}/>
                <Input jsxId={'close_by_code'} field={'close_by_code'} absolute={true} size={'xs'} x={'168px'} y={'152px'} width={'84px'} tabIndex={'8'} align={'left'} readOnly={true}/>
                <Input jsxId={'close_date'} field={'close_date'} absolute={true} size={'xs'} x={'260px'} y={'152px'} width={'112px'} tabIndex={'9'} align={'left'} readOnly={true} calendar={{format:'YYYY-MM-DD'}}/>
                <Label jsxId={'Label752'} sm={true} absolute={true} text={'Closed By - Date'} x={'36px'} y={'152px'} width={'124px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'release_date'} field={'release_date'} absolute={true} size={'xs'} x={'168px'} y={'184px'} width={'84px'} tabIndex={'10'} align={'left'} readOnly={true} calendar={{format:'YYYY-MM-DD'}}/>
                <Label jsxId={'Label778'} sm={true} absolute={true} text={'Implement -URS By'} x={'36px'} y={'184px'} width={'124px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Button jsxId={'btn1PostLog'} absolute={true} size={'xs'} x={'556px'} y={'40px'} width={'60px'} height={'40px'} outline={true} theme={'danger'}>
                    Post URS
                </Button>
                <Button jsxId={'btn1UndoPost'} absolute={true} size={'xs'} x={'496px'} y={'40px'} width={'60px'} height={'40px'} outline={true} theme={'info'}>
                    Undo <br/>Post
                </Button>
                <Input jsxId={'branch_code'} field={'branch_code'} absolute={true} size={'xs'} x={'260px'} y={'184px'} width={'44px'} tabIndex={'13'} align={'left'} readOnly={true}/>
                <Box jsxId={'Box1137'} absolute={true} x={'0px'} y={'0px'} width={'492px'} height={'24px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'} backColor={'rgb(37,62,82)'}/>
                <Label jsxId={'urs_seq_no'} sm={true} absolute={true} text={''} x={'80px'} y={'4px'} width={'52px'} height={'20px'} align={'left'} color={'rgb(255,255,255)'} field={'urs_seq_no'}/>
                <Label jsxId={'lbl_efc_branch_id'} sm={true} absolute={true} text={'Seq No.'} x={'16px'} y={'4px'} width={'60px'} height={'20px'} align={'left'} color={'rgb(255,255,255)'}/>
                <Button jsxId={'btn0Add'} absolute={true} size={'xs'} x={'576px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'folder-plus'} theme={'dark'}>
                    
                </Button>
                <Button jsxId={'btn0Delete'} absolute={true} size={'xs'} x={'548px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'times-circle'} theme={'danger'}>
                    
                </Button>
                <Button jsxId={'btn0Clone'} absolute={true} size={'xs'} x={'520px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'clone'} theme={'dark'}>
                    
                </Button>
                <Button jsxId={'btn0Reload'} absolute={true} size={'xs'} x={'492px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'sync-alt'} theme={'success'}>
                    
                </Button>
                <Button jsxId={'btn0Edit'} absolute={true} size={'xs'} x={'604px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'edit'} theme={'success'}>
                    
                </Button>
                <Button jsxId={'btn0Save'} absolute={true} size={'xs'} x={'604px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'save'} theme={'success'}>
                    
                </Button>
                <Box jsxId={'Box1142'} absolute={true} x={'492px'} y={'0px'} width={'140px'} height={'24px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                <Label jsxId={'status_desc'} sm={true} absolute={true} text={''} x={'220px'} y={'4px'} width={'96px'} height={'20px'} align={'left'} color={'rgb(255,255,255)'} field={'status_desc'}/>
                <Label jsxId={'Label789'} sm={true} absolute={true} text={'Status'} x={'164px'} y={'4px'} width={'52px'} height={'20px'} align={'left'} color={'rgb(255,255,255)'}/>
                <Button jsxId={'btn1Upload'} absolute={true} size={'xs'} x={'560px'} y={'244px'} width={'28px'} height={'20px'} outline={true} icon={'upload'} theme={'success'}>
                    
                </Button>
                <Button jsxId={'btn0Expand'} absolute={true} size={'xs'} x={'588px'} y={'244px'} width={'28px'} height={'20px'} outline={true} icon={'expand-arrows-alt'} theme={'dark'}>
                    
                </Button>
            </Form>
        );
    }
}

export default FUrsLog;
