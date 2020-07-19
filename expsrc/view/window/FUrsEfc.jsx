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
class FUrsEfc extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'f_urs_efc';
		this.title = 'User Reporting System - EFC';
        if (!this.props.width) {
            this.width = '740px';
        }
        if (!this.props.height) {
            this.height = '516px';
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
                <Input jsxId={'urs_log_no'} field={'urs_log_no'} absolute={true} size={'xs'} x={'100px'} y={'40px'} width={'100px'} tabIndex={'0'} align={'left'}/>
                <Label jsxId={'Label719'} sm={true} absolute={true} text={'Log No.'} x={'24px'} y={'40px'} width={'68px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'branch_code'} field={'branch_code'} absolute={true} size={'xs'} x={'272px'} y={'124px'} width={'112px'} tabIndex={'2'} align={'left'} readOnly={true}/>
                <Input jsxId={'efc_group_code'} field={'efc_group_code'} absolute={true} size={'xs'} x={'176px'} y={'124px'} width={'88px'} tabIndex={'3'} align={'left'} readOnly={true}/>
                <Label jsxId={'Label728'} sm={true} absolute={true} text={'EFC Group - Branch'} x={'40px'} y={'124px'} width={'128px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Box jsxId={'box_00_11'} absolute={true} x={'20px'} y={'108px'} width={'384px'} height={'184px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                <Box jsxId={'Box729'} absolute={true} x={'532px'} y={'412px'} width={'188px'} height={'84px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                <Box jsxId={'Box732'} absolute={true} x={'404px'} y={'108px'} width={'316px'} height={'184px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                <Input jsxId={'est_complete_date'} field={'est_complete_date'} absolute={true} size={'xs'} x={'588px'} y={'252px'} width={'112px'} tabIndex={'4'} align={'left'} calendar={{format:'YYYY-MM-DD'}}/>
                <Label jsxId={'Label734'} sm={true} absolute={true} text={'Estimate Finish Date'} x={'424px'} y={'252px'} width={'152px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'urs_type_code'} field={'urs_type_code'} size={'xs'} absolute={true} x={'588px'} y={'220px'} width={'112px'} align={'left'} combo={{
                    onSearch:ComboSearch('urs_type_desc','q_urs_tb_type'),
                    searchColumn:'urs_type_desc',
                    width:'112px',
                    filterColumns:[
                        {field:'urs_type_desc',width:'75px'}
                    ]
                }}/>
                <CCheckbox jsxId={'no_work_id_sw'} field={''} absolute={true} x={'552px'} y={'128px'}/>
                <Label jsxId={'Label170'} sm={true} absolute={true} text={'No Work Needed'} x={'424px'} y={'124px'} width={'116px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'urs_subject'} field={'urs_subject'} absolute={true} size={'xs'} x={'100px'} y={'72px'} width={'304px'} tabIndex={'7'} align={'left'}/>
                <Label jsxId={'Label741'} sm={true} absolute={true} text={'Subject'} x={'24px'} y={'72px'} width={'68px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'sys_type_code'} field={'sys_type_code'} absolute={true} size={'xs'} x={'652px'} y={'156px'} width={'48px'} tabIndex={'1'} align={'left'}/>
                <Label jsxId={'Label22'} sm={true} absolute={true} text={'System'} x={'588px'} y={'156px'} width={'56px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <CCheckbox jsxId={'multi_wrok_id_sw'} field={''} absolute={true} x={'552px'} y={'188px'}/>
                <Label jsxId={'Label756'} sm={true} absolute={true} text={'Multi Wrok List'} x={'424px'} y={'188px'} width={'116px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <CCheckbox jsxId={'public_view_sw'} field={''} absolute={true} x={'552px'} y={'160px'}/>
                <Label jsxId={'Label758'} sm={true} absolute={true} text={'Alow Public View'} x={'424px'} y={'156px'} width={'116px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'efc_release_id'} field={'efc_release_id'} absolute={true} size={'xs'} x={'176px'} y={'252px'} width={'88px'} tabIndex={'11'} align={'left'}/>
                <Label jsxId={'Label761'} sm={true} absolute={true} text={'Release ID - Date'} x={'40px'} y={'252px'} width={'128px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'release_date'} field={'release_date'} absolute={true} size={'xs'} x={'272px'} y={'252px'} width={'112px'} tabIndex={'12'} align={'left'} readOnly={true} calendar={{format:'YYYY-MM-DD'}}/>
                <Input jsxId={'eft_service_code'} field={'eft_service_code'} absolute={true} size={'xs'} x={'652px'} y={'188px'} width={'48px'} tabIndex={'13'} align={'left'}/>
                <Label jsxId={'Label765'} sm={true} absolute={true} text={'Service'} x={'588px'} y={'188px'} width={'56px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'created_by_code'} field={'created_by_code'} absolute={true} size={'xs'} x={'548px'} y={'424px'} width={'60px'} tabIndex={'14'} align={'left'}/>
                <Input jsxId={'created_date'} field={'created_date'} absolute={true} size={'xs'} x={'616px'} y={'424px'} width={'92px'} tabIndex={'15'} align={'left'} calendar={{format:'YYYY-MM-DD'}}/>
                <Input jsxId={'modified_by_code'} field={'modified_by_code'} absolute={true} size={'xs'} x={'548px'} y={'456px'} width={'60px'} tabIndex={'16'} align={'left'}/>
                <Input jsxId={'modified_date'} field={'modified_date'} absolute={true} size={'xs'} x={'616px'} y={'456px'} width={'92px'} tabIndex={'17'} align={'left'} calendar={{format:'YYYY-MM-DD'}}/>
                <Input jsxId={'urs_date'} field={'urs_date'} absolute={true} size={'xs'} x={'272px'} y={'156px'} width={'112px'} tabIndex={'18'} align={'left'} readOnly={true} calendar={{format:'YYYY-MM-DD'}}/>
                <Label jsxId={'Label724'} sm={true} absolute={true} text={'Report By - Date'} x={'40px'} y={'156px'} width={'128px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'urs_by_code'} field={'urs_by_code'} absolute={true} size={'xs'} x={'176px'} y={'156px'} width={'88px'} tabIndex={'19'} align={'left'} readOnly={true}/>
                <Input jsxId={'review_date'} field={'review_date'} absolute={true} size={'xs'} x={'272px'} y={'188px'} width={'112px'} tabIndex={'20'} align={'left'} readOnly={true} calendar={{format:'YYYY-MM-DD'}}/>
                <Input jsxId={'Text775'} field={'review_by_code'} absolute={true} size={'xs'} x={'176px'} y={'188px'} width={'88px'} tabIndex={'21'} align={'left'} readOnly={true}/>
                <Label jsxId={'Label752'} sm={true} absolute={true} text={'- Date'} x={'100px'} y={'188px'} width={'68px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'close_by_code'} field={'close_by_code'} absolute={true} size={'xs'} x={'176px'} y={'220px'} width={'88px'} tabIndex={'22'} align={'left'} readOnly={true}/>
                <Label jsxId={'Label777'} sm={true} absolute={true} text={'Close By - Date'} x={'40px'} y={'220px'} width={'128px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Input jsxId={'close_date'} field={'close_date'} absolute={true} size={'xs'} x={'272px'} y={'220px'} width={'112px'} tabIndex={'23'} align={'left'} readOnly={true} calendar={{format:'YYYY-MM-DD'}}/>
                <Input jsxId={'priority_id'} field={'priority_id'} absolute={true} size={'xs'} x={'652px'} y={'124px'} width={'48px'} tabIndex={'8'} align={'left'}/>
                <Label jsxId={'Label743'} sm={true} absolute={true} text={'Priority'} x={'588px'} y={'124px'} width={'56px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <TextArea jsxId={'urs_attachment'} field={'urs_attachment'} absolute={true} size={'xs'} x={'20px'} y={'320px'} width={'504px'} tabIndex={'24'} height={'176px'}/>
                <Label jsxId={'Label706'} sm={true} absolute={true} text={'Report Detail'} x={'20px'} y={'300px'} width={'448px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'}/>
                <TextArea jsxId={'close_note'} field={'close_note'} absolute={true} size={'xs'} x={'532px'} y={'320px'} width={'188px'} tabIndex={'25'} height={'72px'}/>
                <Label jsxId={'Label776'} sm={true} absolute={true} text={'Close Remark'} x={'532px'} y={'300px'} width={'188px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'}/>
                <Button jsxId={'btn1PostLog'} absolute={true} size={'xs'} x={'660px'} y={'44px'} width={'52px'} height={'40px'} outline={true} theme={'danger'}>
                    Post URS
                </Button>
                <Button jsxId={'btn1UndoPost'} absolute={true} size={'xs'} x={'608px'} y={'44px'} width={'52px'} height={'40px'} outline={true} theme={'info'}>
                    Undo <br/>Post
                </Button>
                <Label jsxId={'Label767'} sm={true} absolute={true} text={'Created - Modified By'} x={'532px'} y={'392px'} width={'188px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'}/>
                <Button jsxId={'btn1CreateWorkID'} absolute={true} size={'xs'} x={'544px'} y={'44px'} width={'64px'} height={'40px'} outline={true} theme={'danger'}>
                    Create Work ID
                </Button>
                <Input jsxId={'efc_work_id'} field={'efc_work_id'} absolute={true} size={'xs'} x={'532px'} y={'220px'} width={'48px'} tabIndex={'29'} align={'center'}/>
                <Label jsxId={'Label786'} sm={true} absolute={true} text={'Work ID - Type'} x={'424px'} y={'220px'} width={'100px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                <Button jsxId={'btn1ReviewByDate'} absolute={true} size={'xs'} x={'40px'} y={'188px'} width={'56px'} height={'24px'} outline={true}>
                    Review
                </Button>
                <Box jsxId={'Box1137'} absolute={true} x={'0px'} y={'0px'} width={'596px'} height={'27px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'} backColor={'rgb(37,62,82)'}/>
                <Label jsxId={'urs_seq_no'} sm={true} absolute={true} text={''} x={'80px'} y={'4px'} width={'52px'} height={'19px'} align={'left'} color={'rgb(255,255,255)'} field={'urs_seq_no'}/>
                <Label jsxId={'lbl_efc_branch_id'} sm={true} absolute={true} text={'Seq No.'} x={'16px'} y={'4px'} width={'60px'} height={'19px'} align={'left'} color={'rgb(255,255,255)'}/>
                <Button jsxId={'btn0Add'} absolute={true} size={'xs'} x={'680px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'folder-plus'} theme={'dark'}>
                    
                </Button>
                <Button jsxId={'btn0Delete'} absolute={true} size={'xs'} x={'652px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'times-circle'} theme={'danger'}>
                    
                </Button>
                <Button jsxId={'btn0Clone'} absolute={true} size={'xs'} x={'624px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'clone'} theme={'dark'}>
                    
                </Button>
                <Button jsxId={'btn0Reload'} absolute={true} size={'xs'} x={'596px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'sync-alt'} theme={'success'}>
                    
                </Button>
                <Button jsxId={'btn0Edit'} absolute={true} size={'xs'} x={'708px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'edit'} theme={'success'}>
                    
                </Button>
                <Button jsxId={'btn0Save'} absolute={true} size={'xs'} x={'708px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'save'} theme={'success'}>
                    
                </Button>
                <Box jsxId={'Box1142'} absolute={true} x={'596px'} y={'0px'} width={'140px'} height={'27px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                <Label jsxId={'status_desc'} sm={true} absolute={true} text={''} x={'220px'} y={'4px'} width={'96px'} height={'19px'} align={'left'} color={'rgb(255,255,255)'} field={'status_desc'}/>
                <Label jsxId={'Label789'} sm={true} absolute={true} text={'Status'} x={'164px'} y={'4px'} width={'52px'} height={'19px'} align={'left'} color={'rgb(255,255,255)'}/>
                <Button jsxId={'btn1Upload'} absolute={true} size={'xs'} x={'468px'} y={'300px'} width={'28px'} height={'20px'} outline={true} icon={'upload'} theme={'success'}>
                    
                </Button>
                <Button jsxId={'btn0Expand'} absolute={true} size={'xs'} x={'496px'} y={'300px'} width={'28px'} height={'20px'} outline={true} icon={'expand-arrows-alt'} theme={'dark'}>
                    
                </Button>
            </Form>
        );
    }
}

export default FUrsEfc;
