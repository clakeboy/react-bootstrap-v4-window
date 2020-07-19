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
class FEfcReleaseNew extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'f_efc_release_new';
		this.title = 'EFC New Release';
        if (!this.props.width) {
            this.width = '760px';
        }
        if (!this.props.height) {
            this.height = '532px';
        }
		this.source = 's_efc_release_new';
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
                <Tabs jsxId={'TabCtl774'} sm={true} border={true} absolute={true} x={'0px'} y={'28px'} width={'760px'} height={'504px'}>
                    <TabsContent jsxId={'Release Info'} id={'Release Info'} text={'Release Info'} active={true}>
                        <Input jsxId={'efc_release_no'} field={'efc_release_no'} absolute={true} size={'xs'} x={'136px'} y={'5px'} width={'104px'} tabIndex={'0'} align={'left'}/>
                        <Label jsxId={'Label719'} sm={true} absolute={true} text={'EFC Release No.'} x={'20px'} y={'5px'} width={'108px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                        <Input jsxId={'sub_version_no'} field={'sub_version_no'} absolute={true} size={'xs'} x={'368px'} y={'33px'} width={'56px'} tabIndex={'1'} align={'left'}/>
                        <Label jsxId={'Label724'} sm={true} absolute={true} text={'Sub Version No.'} x={'256px'} y={'33px'} width={'104px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                        <Input jsxId={'est_release_date'} field={'est_release_date'} absolute={true} size={'xs'} x={'136px'} y={'33px'} width={'104px'} tabIndex={'2'} align={'left'} calendar={{format:'YYYY-MM-DD'}}/>
                        <Label jsxId={'Label728'} sm={true} absolute={true} text={'Release Date'} x={'20px'} y={'33px'} width={'108px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                        <Button jsxId={'btn1Post'} absolute={true} size={'xs'} x={'684px'} y={'17px'} width={'52px'} height={'32px'} outline={true} theme={'danger'}>
                            Post
                        </Button>
                        <Button jsxId={'btn1Undo'} absolute={true} size={'xs'} x={'632px'} y={'17px'} width={'52px'} height={'32px'} outline={true} theme={'info'}>
                            Undo
                        </Button>
                        <CTable jsxId={'sub_efc_release_list_work_sel'} absolute={true} x={'20px'} y={'69px'} width={'716px'} height={'384px'} scroll={true} headerTheme={'light'} hover={true} select={false} sm={true} fontSm={true} source={'v_efc_release_new_list_work'}>
                            <Table.Header field={'sel_sw'} text={'Sel'} width={'32px'}/>
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
                    </TabsContent>
                    <TabsContent jsxId={' Note'} id={' Note'} text={' Note'}>
                        <Box jsxId={'box_00_11'} absolute={true} x={'20px'} y={'89px'} width={'720px'} height={'368px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                        <TextArea jsxId={'release_note'} field={'release_note'} absolute={true} size={'xs'} x={'36px'} y={'125px'} width={'688px'} tabIndex={'0'} height={'312px'}/>
                        <Label jsxId={'Label706'} sm={true} absolute={true} text={'Release Note'} x={'36px'} y={'101px'} width={'132px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                        <Input jsxId={'created_by_code'} field={'created_by_code'} absolute={true} size={'xs'} x={'180px'} y={'21px'} width={'124px'} tabIndex={'1'} align={'left'}/>
                        <Label jsxId={'Label803'} sm={true} absolute={true} text={'Created By - Date'} x={'40px'} y={'21px'} width={'132px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                        <Input jsxId={'created_date'} field={'created_date'} absolute={true} size={'xs'} x={'312px'} y={'21px'} width={'124px'} tabIndex={'2'} align={'left'} calendar={{format:'YYYY-MM-DD'}}/>
                        <Input jsxId={'modified_by_code'} field={'modified_by_code'} absolute={true} size={'xs'} x={'180px'} y={'53px'} width={'124px'} tabIndex={'3'} align={'left'}/>
                        <Label jsxId={'Label804'} sm={true} absolute={true} text={'Modified By - Date'} x={'40px'} y={'53px'} width={'132px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'}/>
                        <Input jsxId={'modified_date'} field={'modified_date'} absolute={true} size={'xs'} x={'312px'} y={'53px'} width={'124px'} tabIndex={'4'} align={'left'} calendar={{format:'YYYY-MM-DD'}}/>
                        <Box jsxId={'Box803'} absolute={true} x={'20px'} y={'9px'} width={'720px'} height={'80px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                    </TabsContent>
                </Tabs>
                <Box jsxId={'Box1137'} absolute={true} x={'0px'} y={'0px'} width={'616px'} height={'27px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'} backColor={'rgb(37,62,82)'}/>
                <Label jsxId={'efc_release_id'} sm={true} absolute={true} text={''} x={'80px'} y={'4px'} width={'52px'} height={'19px'} align={'left'} color={'rgb(255,255,255)'} field={'efc_release_id'}/>
                <Label jsxId={'lbl_efc_branch_id'} sm={true} absolute={true} text={'Seq No.'} x={'16px'} y={'4px'} width={'60px'} height={'19px'} align={'left'} color={'rgb(255,255,255)'}/>
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
                <Box jsxId={'Box1142'} absolute={true} x={'616px'} y={'0px'} width={'140px'} height={'27px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                <Label jsxId={'status_desc'} sm={true} absolute={true} text={''} x={'220px'} y={'4px'} width={'96px'} height={'19px'} align={'left'} color={'rgb(255,255,255)'} field={'status_desc'}/>
                <Label jsxId={'lbl_status_id'} sm={true} absolute={true} text={'Status'} x={'164px'} y={'4px'} width={'52px'} height={'19px'} align={'left'} color={'rgb(255,255,255)'}/>
            </Form>
        );
    }
}

export default FEfcReleaseNew;
