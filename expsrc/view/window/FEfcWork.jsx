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
    Radio,
    RadioGroup,
    Common,
    Form
} from '@clake/react-bootstrap4';
import {
    CTable,
    Window,
    WModal
} from '../../../src/index'
import {GetData,ComboSearch,ProcessData} from '../../common/DataService';
class FEfcWork extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'f_wrk';
        this.title = 'Enter Work';
        if (!this.props.width) {
            this.width = '756px';
        }
        if (!this.props.height) {
            this.height = '568px';
        }
        this.source = 's_wrk';
        this.process = 't_wrk';
        if (this.props.parent instanceof Window) {
            //window 窗体对像
            this.window = this.props.parent;
            //window 管理对像
            this.manage = this.window.parent;
            //传送的窗体参数
            this.params = this.window.params;
        }

        this.state = {
            data:{},
            isEdit:!!this.window?.params?.id
        };
    }

    componentDidMount() {
        this.window.on(Window.EVT_SHOW,this.showHandler);
        this.window.on(Window.EVT_CLOSE,this.closeHandler);
        this.getData(this.window?.params?.id)
    }

    showHandler = ()=>{
        this.getData(this.window?.params?.id)
    };

    closeHandler = ()=>{

    };


    getData = (id) => {
        if (!id) {
            return;
        }
        let condition = {
            field:'wrk_id',
            value: id + '',
            flag:  'eq'
        };
        this.modal.loading('Loading...');
        GetData('s_wrk',1,1, [condition],null,(res)=>{
            this.modal.close();
            if (res.status) {
                if (res.data.list && res.data.list[0]) {
                    this.setState({
                        data:res.data.list[0],
                        isEdit:true
                    });
                } else {
                    this.modal.alert('not found data');
                }
            } else {
                this.setState({
                    data:{},
                    isEdit:false,
                });
            }
        });
    };

    newData = () => {
        this.window.params = {};
        let data = this.form.getNew();
        Common.map(data,(item,key)=>{
            if (typeof item === 'object') {
                data[item.text_key] = "";
                data[key] = "";
            }
        });
        this.setState({
            data:data,
            isEdit:false,
        })
    };

    cloneData = ()=>{
        let data = Common.Clone(this.state.data);
        delete data.wrk_id;
        this.setState({
            data:data,
            isEdit:false,
        })
    };

    saveData = () => {
        ProcessData(this.process,this.state.isEdit?'edit':'new',this.state.data,(res)=>{
            if (res.status) {
                if (!this.state.isEdit) {
                    this.window.params.id = res.data.new_id;
                }
                this.setState({
                    isEdit:true,
                },()=>{
                    this.modal.alert('save success',()=>{
                        this.showHandler();
                    });
                });
            } else {
                this.modal.alert('save data error:'+res.msg);
            }
        })
    };

    deleteData = ()=>{
        ProcessData(this.process,'delete',{'wrk_id':this.window.params.id},(res)=>{
            if (res.status) {
                this.modal.alert({
                    content: 'delete success',
                    callback: ()=>{
                        this.window.close();
                    }
                });
            } else {
                this.modal.alert('save data error:'+res.msg);
            }
        })
    };

    fieldChangeHandler = (field,val,row,type,textField)=>{
        let data = this.state.data;
        if (type==='combo') {
            data[field] = row?row[field]??row[textField]:'';
            data[textField] = val;
        } else {
            data[field] = val;
        }
        this.setState({data:data},()=>{
            console.log(this.state)
        });
    };

    sortHandler() {}

    filterHandler() {}

    open() {}

    render() {
        return (
            <Form ref={c=>this.form=c} onChange={this.fieldChangeHandler}>
                <Tabs jsxId={'TabCtl774'} sm={true} border={true} absolute={true} x={'0px'} y={'28px'} width={'756px'} height={'540px'}>
                    <TabsContent jsxId={'WorkInfo'} id={'WorkInfo'} text={'Work Info'} active={true}>
                        <Input jsxId={'work_subject'} field={'work_subject'} absolute={true} size={'xs'} x={'96px'} y={'33px'} width={'296px'} tabIndex={'0'} align={'left'} data={this.state.data?.work_subject} maxlength={100}/>
                        <Label jsxId={'Label741'} sm={true} absolute={true} x={'20px'} y={'33px'} width={'68px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Subject'}/>
                        <Input jsxId={'init_from_code'} field={'init_from_code'} absolute={true} size={'xs'} x={'88px'} y={'105px'} width={'48px'} tabIndex={'1'} align={'center'} disabled={true} data={this.state.data?.init_from_code} maxlength={4}/>
                        <Label jsxId={'Label836'} sm={true} absolute={true} x={'36px'} y={'105px'} width={'44px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'From'}/>
                        <Input jsxId={'product_code'} field={{key:'product_code',text_key:'product_code'}} size={'xs'} absolute={true} x={'96px'} y={'5px'} width={'76px'} align={'left'} combo={{
                            onSearch:ComboSearch('product_code','q_eft_product'),
                            searchColumn:'product_code',
                            width:'229px',
                            header:false,
                            filterColumns:[
                                {field:'product_code',width:'57px'},
                                {field:'product_name',width:'172px'}
                            ]
                        }} data={this.state.data?.product_code}/>
                        <Label jsxId={'Label743'} sm={true} absolute={true} x={'20px'} y={'5px'} width={'68px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Product'}/>
                        <Button jsxId={'btn3CloseWork'} absolute={true} size={'xs'} x={'679px'} y={'9px'} width={'52px'} height={'36px'} outline={true} theme={'danger'} tip={'Post URS Log'}>
                            Close Work
                        </Button>
                        <Box jsxId={'Box804'} absolute={true} x={'20px'} y={'89px'} width={'466px'} height={'216px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'start_date'} field={'start_date'} absolute={true} size={'xs'} x={'148px'} y={'201px'} width={'108px'} tabIndex={'4'} align={'left'} calendar={{format:'YYYY-MM-DD'}} data={this.state.data?.start_date?moment(this.state.data?.start_date).format('YYYY-MM-DD'):''} maxlength={8}/>
                        <Label jsxId={'Label805'} sm={true} absolute={true} x={'36px'} y={'201px'} width={'104px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Start Date'}/>
                        <Input jsxId={'request_by'} field={'request_by'} absolute={true} size={'xs'} x={'148px'} y={'169px'} width={'108px'} tabIndex={'5'} align={'left'} data={this.state.data?.request_by} maxlength={25}/>
                        <Label jsxId={'Label808'} sm={true} absolute={true} x={'36px'} y={'169px'} width={'104px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Request By'}/>
                        <Input jsxId={'urs_id'} field={'urs_id'} absolute={true} size={'xs'} x={'376px'} y={'137px'} width={'40px'} tabIndex={'6'} align={'center'} data={this.state.data?.urs_id}/>
                        <Label jsxId={'Label807'} sm={true} absolute={true} x={'267px'} y={'137px'} width={'96px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'URS - Proj ID'}/>
                        <Input jsxId={'work_priority_id'} field={'work_priority_id'} absolute={true} size={'xs'} x={'377px'} y={'169px'} width={'40px'} tabIndex={'7'} align={'center'} data={this.state.data?.work_priority_id}/>
                        <Input jsxId={'prj_id'} field={'prj_id'} absolute={true} size={'xs'} x={'423px'} y={'137px'} width={'45px'} tabIndex={'8'} align={'center'} data={this.state.data?.prj_id}/>
                        <Input jsxId={'close_date'} field={'close_date'} absolute={true} size={'xs'} x={'148px'} y={'233px'} width={'108px'} tabIndex={'9'} align={'left'} calendar={{format:'YYYY-MM-DD'}} data={this.state.data?.close_date} maxlength={8}/>
                        <Label jsxId={'Label810'} sm={true} absolute={true} x={'36px'} y={'233px'} width={'104px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Complete Date'}/>
                        <Input jsxId={'release_date'} field={'release_date'} absolute={true} size={'xs'} x={'148px'} y={'265px'} width={'80px'} tabIndex={'10'} align={'left'} calendar={{format:'YYYY-MM-DD'}} data={this.state.data?.release_date} maxlength={8}/>
                        <Label jsxId={'Label852'} sm={true} absolute={true} x={'36px'} y={'265px'} width={'104px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Release-ID-Doc'}/>
                        <Input jsxId={'rls_id'} field={'rls_id'} absolute={true} size={'xs'} x={'232px'} y={'265px'} width={'25px'} tabIndex={'11'} align={'center'} disabled={true} data={this.state.data?.rls_id}/>
                        <Box jsxId={'Box815'} absolute={true} x={'486px'} y={'85px'} width={'248px'} height={'220px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <TextArea jsxId={'work_desc'} field={'work_list'} absolute={true} size={'xs'} x={'506px'} y={'105px'} width={'212px'} tabIndex={'12'} height={'56px'} data={this.state.data?.work_list} maxlength={200}/>
                        <Label jsxId={'Label825'} sm={true} absolute={true} x={'486px'} y={'69px'} width={'248px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Work Item Desc - Logic / Note'}/>
                        <TextArea jsxId={'logic_note'} field={'logic_note'} absolute={true} size={'xs'} x={'506px'} y={'173px'} width={'212px'} tabIndex={'13'} height={'112px'} data={this.state.data?.logic_note}/>
                        <CTable jsxId={'sub_wrk_detail_item'} absolute={true} x={'20px'} y={'309px'} width={'714px'} height={'181px'} scroll={true} headerTheme={'light'} hover={true} select={false} sm={true} fontSm={true} source={'v_wrk_detail_item'} data={this.state.tableData} ref={c=>this.sub_wrk_detail_item=c} page={this.state.page} dataCount={this.state.dataCount} onSelectPage={this.getData} showNumbers={50} edit={true}>
                            <Table.Header jsxId={'sub_wrk_detail_item-work_item_id'} field={'work_item_id'} text={'Item ID'} width={'40px'} align={'center'} onFormat={val=><u className='text-primary print-default'>{val}</u>} onDoubleClick={this.open('f_wrk_item','work_item_id')} foot={false} type={''} disabled={true}/>
                            <Table.Header jsxId={'sub_wrk_detail_item-item_desc'} field={'item_desc'} text={'Item Desc'} width={'204px'} align={'left'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_wrk_detail_item-item_by_code'} field={'item_by_code'} text={'Item By'} width={'80px'} align={''} foot={false} type={'combo'} combo={{
                                onSearch:ComboSearch('user_code','q_eft_user'),
                                searchColumn:'user_code',
                                width:'172px',
                                header:false,
                                filterColumns:[
                                    {field:'user_code',width:'67px'},
                                    {field:'user_name',width:'105px'}
                                ]
                            }}/>
                            <Table.Header jsxId={'sub_wrk_detail_item-item_status_code'} field={'item_status_code'} text={'Status'} width={'48px'} align={'center'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_wrk_detail_item-item_hour'} field={'item_hour'} text={'A-Hour'} width={'48px'} align={'center'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_wrk_detail_item-item_complete_date'} field={'item_complete_date'} text={'Complete'} width={'96px'} align={'center'} onFormat={val=>val?moment(val).format('YY-MM-DD'):''} foot={false} type={'calendar'}/>
                            <Table.Header jsxId={'sub_wrk_detail_item-ask_by_code'} field={'ask_by_code'} text={'Ask By'} width={'68px'} align={'left'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_wrk_detail_item-item_type_code'} field={'item_type_code'} text={'Type'} width={'96px'} align={''} foot={false} type={'combo'} combo={{
                                onSearch:ComboSearch('item_type_code','q_wrk_tb_item_type'),
                                searchColumn:'item_type_code',
                                width:'220px',
                                header:false,
                                filterColumns:[
                                    {field:'item_type_code',width:'76px'},
                                    {field:'item_type_desc',width:'144px'}
                                ]
                            }}/>
                            <Table.Header jsxId={'sub_wrk_detail_item-item_start_date'} field={'item_start_date'} text={'Start Date'} width={'92px'} align={'center'} onFormat={val=>val?moment(val).format('YY-MM-DD'):''} foot={false} type={'calendar'}/>
                            <Table.Header jsxId={'sub_wrk_detail_item-est_hour'} field={'est_hour'} text={'E-Hour'} width={'48px'} align={'center'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_wrk_detail_item-item_seq_no'} field={'item_seq_no'} text={'Seq'} width={'40px'} align={'center'} foot={false} type={''}/>
                        </CTable>
                        <Label jsxId={'Label832'} sm={true} absolute={true} x={'20px'} y={'69px'} width={'466px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Work / Task Information'}/>
                        <Input jsxId={'total_work_hour'} field={'total_work_hour'} absolute={true} size={'xs'} x={'423px'} y={'169px'} width={'45px'} tabIndex={'15'} align={'center'} disabled={true} data={this.state.data?.total_work_hour}/>
                        <Label jsxId={'Label792'} sm={true} absolute={true} x={'267px'} y={'169px'} width={'97px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Priority - Hour'}/>
                        <Input jsxId={'work_type_code'} field={{key:'work_type_code',text_key:'work_type_code'}} size={'xs'} absolute={true} x={'192px'} y={'105px'} width={'63px'} align={'left'} combo={{
                            onSearch:ComboSearch('work_type_code','q_wrk_tb_work_type'),
                            searchColumn:'work_type_code',
                            width:'192px',
                            header:false,
                            filterColumns:[
                                {field:'work_type_code',width:'48px'},
                                {field:'work_type_desc',width:'144px'}
                            ]
                        }} data={this.state.data?.work_type_code}/>
                        <Label jsxId={'Label809'} sm={true} absolute={true} x={'148px'} y={'105px'} width={'40px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Type'}/>
                        <Input jsxId={'status_code'} field={'status_code'} absolute={true} size={'xs'} x={'324px'} y={'5px'} width={'44px'} tabIndex={'17'} align={'center'} data={this.state.data?.status_code}/>
                        <Label jsxId={'Label839'} sm={true} absolute={true} x={'208px'} y={'5px'} width={'108px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Progress Status'}/>
                        <Button jsxId={'btn3UndoClose'} absolute={true} size={'xs'} x={'627px'} y={'9px'} width={'52px'} height={'36px'} outline={true} theme={'info'} tip={'Post URS Log'}>
                            Undo Close
                        </Button>
                        <Button jsxId={'btn1QueryDoc'} absolute={true} size={'xs'} x={'523px'} y={'9px'} width={'52px'} height={'36px'} outline={true} theme={'dark'} tip={'Undo Post'}>
                            Query Doc
                        </Button>
                        <Button jsxId={'btn3UploadDoc'} absolute={true} size={'xs'} x={'575px'} y={'9px'} width={'52px'} height={'36px'} outline={true} theme={'dark'} tip={'Undo Post'}>
                            Upload Doc
                        </Button>
                        <Input jsxId={'work_by_code'} field={{key:'work_by_code',text_key:'user_code'}} size={'xs'} absolute={true} x={'148px'} y={'137px'} width={'108px'} align={'left'} combo={{
                            onSearch:ComboSearch('user_code','q_eft_user'),
                            searchColumn:'user_code',
                            width:'172px',
                            header:false,
                            filterColumns:[
                                {field:'user_code',width:'67px'},
                                {field:'user_name',width:'105px'}
                            ]
                        }} data={this.state.data?.user_code}/>
                        <Label jsxId={'Label806'} sm={true} absolute={true} x={'36px'} y={'138px'} width={'104px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Coordinator'}/>
                        <Input jsxId={'created_by_code'} field={'created_by_code'} absolute={true} size={'xs'} x={'302px'} y={'233px'} width={'52px'} tabIndex={'22'} align={'left'} data={this.state.data?.created_by_code} maxlength={15}/>
                        <Label jsxId={'Label843'} sm={true} absolute={true} x={'267px'} y={'233px'} width={'30px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Cr'}/>
                        <Input jsxId={'created_date'} field={'created_date'} absolute={true} size={'xs'} x={'359px'} y={'233px'} width={'111px'} tabIndex={'23'} align={'left'} calendar={{format:'YYYY-MM-DD'}} data={this.state.data?.created_date?moment(this.state.data?.created_date).format('YYYY-MM-DD HH:NN'):''} maxlength={8}/>
                        <Input jsxId={'modified_by_code'} field={'modified_by_code'} absolute={true} size={'xs'} x={'302px'} y={'265px'} width={'52px'} tabIndex={'24'} align={'left'} data={this.state.data?.modified_by_code} maxlength={15}/>
                        <Label jsxId={'Label844'} sm={true} absolute={true} x={'267px'} y={'265px'} width={'31px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Mod'}/>
                        <Input jsxId={'modified_date'} field={'modified_date'} absolute={true} size={'xs'} x={'359px'} y={'265px'} width={'111px'} tabIndex={'25'} align={'left'} calendar={{format:'YYYY-MM-DD'}} data={this.state.data?.modified_date?moment(this.state.data?.modified_date).format('YYYY-MM-DD HH:NN'):''} maxlength={8}/>
                        <Button jsxId={'btn1SelStaff'} absolute={true} size={'xs'} x={'464px'} y={'9px'} width={'60px'} height={'36px'} outline={true} tip={'Post URS Log'}>
                            EFT Meeting
                        </Button>
                    </TabsContent>
                    <TabsContent jsxId={'Attachment'} id={'Attachment'} text={'Attachment/eDoc'}>
                        <TextArea jsxId={'work_attachment'} field={'work_attachment'} absolute={true} size={'xs'} x={'20px'} y={'29px'} width={'713px'} tabIndex={'0'} height={'448px'} htmlMode={true} data={this.state.data?.work_attachment}/>
                        <Label jsxId={'Label706'} sm={true} absolute={true} x={'20px'} y={'9px'} width={'713px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Attachment'}/>
                    </TabsContent>
                </Tabs>
                <Box jsxId={'Boxheadline'} absolute={true} x={'0px'} y={'0px'} width={'604px'} height={'28px'} backColor={'rgb(53,88,117)'} borderColor={'rgb(0,0,0)'} borderWidth={'1px'}/>
                <Button jsxId={'btn0Add'} absolute={true} size={'xs'} x={'688px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'folder-plus'} onClick={this.newData} theme={'dark'} tip={'Add'}>

                </Button>
                <Button jsxId={'btn0Delete'} absolute={true} size={'xs'} x={'660px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'times-circle'} onClick={this.deleteData} theme={'danger'} tip={'Delete'}>

                </Button>
                <Button jsxId={'btn0Clone'} absolute={true} size={'xs'} x={'632px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'clone'} onClick={this.cloneData} theme={'dark'} tip={'Clone'}>

                </Button>
                <Button jsxId={'btn0Reload'} absolute={true} size={'xs'} x={'604px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'sync-alt'} onClick={this.showHandler} theme={'success'} tip={'Refresh'}>

                </Button>
                <Button jsxId={'btn0Edit'} absolute={true} size={'xs'} x={'716px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'edit'} onClick={this.saveData} className={this.state.isEdit?'':'d-none'} theme={'success'} tip={'Edit'}>

                </Button>
                <Button jsxId={'btn0Save'} absolute={true} size={'xs'} x={'716px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'save'} onClick={this.saveData} className={!this.state.isEdit?'':'d-none'} theme={'success'} tip={'Save'}>

                </Button>
                <Box jsxId={'BoxhearlineButton'} absolute={true} x={'604px'} y={'0px'} width={'140px'} height={'28px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                <Label jsxId={'work_id'} sm={true} absolute={true} x={'84px'} y={'4px'} width={'56px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} field={'wrk_id'} text={this.state.data?.wrk_id}/>
                <Label jsxId={'Label837'} sm={true} absolute={true} x={'16px'} y={'4px'} width={'64px'} height={'20px'} align={'left'} color={'rgb(255,255,255)'} text={'Work ID:'}/>
                <WModal ref={c=>this.modal=c}/>
            </Form>
        );
    }
}

export default FEfcWork;
