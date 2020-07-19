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
class FEfcWork extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'f_efc_work';
		this.title = 'EFC Work Log';
        if (!this.props.width) {
            this.width = '760px';
        }
        if (!this.props.height) {
            this.height = '584px';
        }
		this.source = 's_efc_work';
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
                <Input jsxId={'efc_work_id-1'} field={'efc_work_id'} absolute={true} size={'xs'} x={'108px'} y={'40px'} width={'64px'} tabIndex={'0'} align={'left'} readOnly={true}/>
                <Label jsxId={'Label719'} sm={true} absolute={true} text={'Work ID'} x={'36px'} y={'40px'} width={'64px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Box jsxId={'box_00_11'} absolute={true} x={'20px'} y={'108px'} width={'388px'} height={'184px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                <Input jsxId={'coder_start_date'} field={'code_start_date'} absolute={true} size={'xs'} x={'176px'} y={'188px'} width={'100px'} tabIndex={'2'} align={'left'} calendar={{format:'YYYY-MM-DD'}}/>
                <Label jsxId={'Label734'} sm={true} absolute={true} text={'Code Start - Finish'} x={'40px'} y={'188px'} width={'128px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'urs_type_code'} field={'urs_type_code'} size={'xs'} absolute={true} x={'496px'} y={'156px'} width={'88px'} align={'left'} combo={{
                    onSearch:ComboSearch('urs_type_desc','q_urs_tb_type'),
                    searchColumn:'urs_type_desc',
                    width:'88px',
                    filterColumns:[
                        {field:'urs_type_desc',width:'75px'}
                    ]
                }}/>
                <Label jsxId={'Label743'} sm={true} absolute={true} text={'Type'} x={'428px'} y={'156px'} width={'64px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'assign_to_code'} field={'assign_to_code'} absolute={true} size={'xs'} x={'176px'} y={'156px'} width={'100px'} tabIndex={'4'} align={'left'}/>
                <Label jsxId={'Label739'} sm={true} absolute={true} text={'Assign To - Date  '} x={'40px'} y={'156px'} width={'128px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'work_subject'} field={'work_subject'} absolute={true} size={'xs'} x={'108px'} y={'72px'} width={'304px'} tabIndex={'5'} align={'left'}/>
                <Label jsxId={'Label741'} sm={true} absolute={true} text={'Subject'} x={'36px'} y={'72px'} width={'64px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'sys_type_code'} field={'sys_type_code'} absolute={true} size={'xs'} x={'648px'} y={'156px'} width={'72px'} tabIndex={'1'} align={'left'}/>
                <Label jsxId={'Label803'} sm={true} absolute={true} text={'efc-sys'} x={'592px'} y={'156px'} width={'48px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'review_by_code'} field={'review_by_code'} absolute={true} size={'xs'} x={'176px'} y={'124px'} width={'100px'} tabIndex={'6'} align={'left'} readOnly={true}/>
                <Label jsxId={'Label748'} sm={true} absolute={true} text={'Review By - Date'} x={'40px'} y={'124px'} width={'128px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'created_by_code'} field={'created_by_code'} absolute={true} size={'xs'} x={'496px'} y={'220px'} width={'88px'} tabIndex={'7'} align={'left'} readOnly={true}/>
                <Label jsxId={'Label22'} sm={true} absolute={true} text={'Created'} x={'428px'} y={'220px'} width={'64px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'created_date'} field={'created_date'} absolute={true} size={'xs'} x={'592px'} y={'220px'} width={'128px'} tabIndex={'8'} align={'left'} readOnly={true} calendar={{format:'YYYY-MM-DD'}}/>
                <Input jsxId={'modified_by_code'} field={'modified_by_code'} absolute={true} size={'xs'} x={'496px'} y={'252px'} width={'88px'} tabIndex={'9'} align={'left'} readOnly={true}/>
                <Label jsxId={'Label806'} sm={true} absolute={true} text={'Modified'} x={'428px'} y={'252px'} width={'64px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'modified_date'} field={'modified_date'} absolute={true} size={'xs'} x={'592px'} y={'252px'} width={'128px'} tabIndex={'10'} align={'left'} readOnly={true} calendar={{format:'YYYY-MM-DD'}}/>
                <Input jsxId={'coder_finish_date'} field={'code_finish_date'} absolute={true} size={'xs'} x={'284px'} y={'188px'} width={'100px'} tabIndex={'11'} align={'left'} calendar={{format:'YYYY-MM-DD'}}/>
                <Box jsxId={'Box776'} absolute={true} x={'408px'} y={'108px'} width={'332px'} height={'184px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                <Input jsxId={'test_by_code'} field={'test_by_code'} absolute={true} size={'xs'} x={'176px'} y={'220px'} width={'100px'} tabIndex={'12'} align={'left'}/>
                <Label jsxId={'Label778'} sm={true} absolute={true} text={'Test by - Complete'} x={'40px'} y={'220px'} width={'128px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'complete_date'} field={'complete_date'} absolute={true} size={'xs'} x={'284px'} y={'220px'} width={'100px'} tabIndex={'13'} align={'left'} readOnly={true} calendar={{format:'YYYY-MM-DD'}}/>
                <Input jsxId={'implement_date'} field={'implement_date'} absolute={true} size={'xs'} x={'284px'} y={'252px'} width={'100px'} tabIndex={'14'} align={'left'} calendar={{format:'YYYY-MM-DD'}}/>
                <Input jsxId={'Text783'} field={'assign_date'} absolute={true} size={'xs'} x={'284px'} y={'156px'} width={'100px'} tabIndex={'15'} align={'left'} calendar={{format:'YYYY-MM-DD'}}/>
                <TextArea jsxId={'urs_attachment'} field={'urs_attachment'} absolute={true} size={'xs'} x={'20px'} y={'320px'} width={'468px'} tabIndex={'16'} height={'244px'}/>
                <Label jsxId={'Label706'} sm={true} absolute={true} text={'URS Log Attachment'} x={'20px'} y={'300px'} width={'412px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'}/>
                <Input jsxId={'Text787'} field={'review_date'} absolute={true} size={'xs'} x={'284px'} y={'124px'} width={'100px'} tabIndex={'17'} align={'left'} readOnly={true} calendar={{format:'YYYY-MM-DD'}}/>
                <Input jsxId={'efc_release_id'} field={'efc_release_id'} absolute={true} size={'xs'} x={'204px'} y={'252px'} width={'64px'} tabIndex={'18'} align={'center'}/>
                <Label jsxId={'Label782'} sm={true} absolute={true} text={'Release ID - Date'} x={'40px'} y={'252px'} width={'128px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'Text791'} field={'urs_log_no'} absolute={true} size={'xs'} x={'496px'} y={'124px'} width={'88px'} tabIndex={'19'} align={'left'}/>
                <Label jsxId={'Label792'} sm={true} absolute={true} text={'URS No.'} x={'428px'} y={'124px'} width={'64px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <TextArea jsxId={'work_attachment'} field={'work_attachment'} absolute={true} size={'xs'} x={'496px'} y={'320px'} width={'244px'} tabIndex={'20'} height={'244px'}/>
                <Label jsxId={'Label807'} sm={true} absolute={true} text={'Work ID Attachment'} x={'496px'} y={'300px'} width={'244px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'}/>
                <Input jsxId={'efc_group_code'} field={'efc_group_code'} absolute={true} size={'xs'} x={'496px'} y={'188px'} width={'88px'} tabIndex={'21'} align={'left'} readOnly={true}/>
                <Label jsxId={'Label796'} sm={true} absolute={true} text={'URS By'} x={'428px'} y={'188px'} width={'64px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <CCheckbox jsxId={'sel_sw'} field={''} absolute={true} x={'180px'} y={'256px'}/>
                <Input jsxId={'priority_id'} field={'priority_id'} size={'xs'} absolute={true} x={'648px'} y={'124px'} width={'72px'} align={'left'} combo={{
                    onSearch:ComboSearch('priority_desc','q_urs_tb_priority'),
                    searchColumn:'priority_desc',
                    width:'75px',
                    filterColumns:[
                        {field:'priority_desc',width:'75px'}
                    ]
                }}/>
                <Label jsxId={'Label808'} sm={true} absolute={true} text={'Priority'} x={'592px'} y={'124px'} width={'48px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'urs_by_code'} field={'urs_by_code'} absolute={true} size={'xs'} x={'648px'} y={'188px'} width={'72px'} tabIndex={'24'} align={'left'} readOnly={true}/>
                <Input jsxId={'branch_code'} field={'branch_code'} absolute={true} size={'xs'} x={'592px'} y={'188px'} width={'44px'} tabIndex={'25'} align={'center'} readOnly={true}/>
                <Button jsxId={'btn1PostWork'} absolute={true} size={'xs'} x={'684px'} y={'44px'} width={'52px'} height={'40px'} outline={true} theme={'danger'}>
                    Post Work
                </Button>
                <Button jsxId={'btn1UndoPost'} absolute={true} size={'xs'} x={'632px'} y={'44px'} width={'52px'} height={'40px'} outline={true} theme={'info'}>
                    Undo <br/>Post
                </Button>
                <Box jsxId={'Box1137'} absolute={true} x={'0px'} y={'0px'} width={'616px'} height={'28px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'} backColor={'rgb(37,62,82)'}/>
                <Label jsxId={'efc_work_id'} sm={true} absolute={true} text={''} x={'80px'} y={'4px'} width={'52px'} height={'20px'} align={'left'} color={'rgb(255,255,255)'} field={'efc_work_id'}/>
                <Label jsxId={'lbl_efc_branch_id'} sm={true} absolute={true} text={'Seq No.'} x={'16px'} y={'4px'} width={'60px'} height={'20px'} align={'left'} color={'rgb(255,255,255)'}/>
                <Button jsxId={'btn0Add'} absolute={true} size={'xs'} x={'700px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'folder-plus'} theme={'dark'}>
                    
                </Button>
                <Button jsxId={'btn0Delete'} absolute={true} size={'xs'} x={'672px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'times-circle'} theme={'danger'}>
                    
                </Button>
                <Button jsxId={'btn0Clone'} absolute={true} size={'xs'} x={'644px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'clone'} theme={'dark'}>
                    
                </Button>
                <Button jsxId={'btn0Reload'} absolute={true} size={'xs'} x={'616px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'sync-alt'} theme={'success'}>
                    
                </Button>
                <Button jsxId={'btn0Edit'} absolute={true} size={'xs'} x={'728px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'edit'} theme={'success'}>
                    
                </Button>
                <Button jsxId={'btn0Save'} absolute={true} size={'xs'} x={'728px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'save'} theme={'success'}>
                    
                </Button>
                <Box jsxId={'Box1142'} absolute={true} x={'616px'} y={'0px'} width={'140px'} height={'28px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                <Label jsxId={'status_desc'} sm={true} absolute={true} text={''} x={'220px'} y={'4px'} width={'96px'} height={'20px'} align={'left'} color={'rgb(255,255,255)'} field={'status_desc'}/>
                <Label jsxId={'Label810'} sm={true} absolute={true} text={'Status'} x={'164px'} y={'4px'} width={'52px'} height={'20px'} align={'left'} color={'rgb(255,255,255)'}/>
                <Button jsxId={'btn1Upload'} absolute={true} size={'xs'} x={'432px'} y={'300px'} width={'28px'} height={'20px'} outline={true} icon={'upload'} theme={'success'}>
                    
                </Button>
                <Button jsxId={'btn0Expand'} absolute={true} size={'xs'} x={'460px'} y={'300px'} width={'28px'} height={'20px'} outline={true} icon={'expand-arrows-alt'} theme={'dark'}>
                    
                </Button>
            </Form>
        );
    }
}

export default FEfcWork;
