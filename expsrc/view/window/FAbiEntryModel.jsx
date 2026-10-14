
/*****VERSION*****
* app_version: 2.2.13
* created_date: 2026-08-31 14:15:10
* last_replace_date: 2026-09-03 14:11:05
* replace_date: 2026-09-03 23:48:58
*****VERSION*****/
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
// import {default as WModal} from '../../common/EfcModal'
// import Tooltip from '/src/Tooltip';
// import FDutyComputation from '/src/view/window/FDutyComputation';

// import { ComboSearch,generalApi } from '../../Api/generalApi';
// import request from '../../Api/request';
import {pad,toPercent,formatCurrency,numberformat,format,isFunction,withBtnLoading} from '../../common/common'
import {GetData,ComboSearch,ProcessData} from '../../common/DataService';
class FAbiEntryModel extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'f_abi_entry_model';
        this.title = 'Entry Model';
        if (!this.props.width) {
            this.width = '672px';
        }
        if (!this.props.height) {
            this.height = '421px';
        }
        this.source = 's_abi_entry_model';
        this.process = 't_abi_entry_model';
        if (this.props.parent instanceof Window) {
            //window 窗体对像
            this.window = this.props.parent;
            //window 管理对像
            this.manage = this.window.parent;
            //传送的窗体参数
            this.params = this.window.params;
        }

        this.state = {
            data:{
                
            },
            isEdit:false,
            btnLoading:{},
            tab_sub_abi_entry_model_tariff_data:[
                    {
                        "duty_seq_no": "12",
                        "duty_hs_code": "",
                        "column1_rate_ad_valorem": "",
                        "hs_code_desc": "",
                        "fee_class_code": ""
                    },
                    {
                        "duty_seq_no": "32",
                        "duty_hs_code": "",
                        "column1_rate_ad_valorem": "",
                        "hs_code_desc": "",
                        "fee_class_code": ""
                    }
                ]
        };
    }

    componentDidMount() {
        if (this.window) {
            this.window.on(Window.EVT_SHOW,this.showHandler);
            this.window.is_before = true;
            this.window.on(Window.EVT_BEFORE_CLOSE,this.closeBeforeHandler); 
            this.window.on(Window.EVT_CLOSE,this.closeHandler);
        }
        this.showHandler();
    }

    showHandler = ()=>{
        this.getData(this.window?.params?.id)
    };

    closeBeforeHandler =(callbackClose)=>{
        if(this.state.isEdit==true){
            this.modal.confirm('The data has not been saved yet, do you need to save it?',(flag)=>{
                if (flag){
                    this.saveData(callbackClose);
                }else{
                    callbackClose();
                }
            });
        }else{
            callbackClose();
        }
    };

    getData = async (id) => {
        if (!id) {
            return;
        }
        let condition = {
            field:'abi_entry_model_id',
            value: id + '',
            flag:  'eq'
        };

        this.modal.loading('Loading...');
        generalApi().GetData('s_abi_entry_model',1,1, [condition]).then((res)=>{
            this.modal?.close();
            if (res.status) {
                if (res.data.list && res.data.list[0]) {
                    this.setState({
                        data:res.data.list[0],
                        isEdit:false 
                    },()=>{
                        this.sub_abi_entry_model_tariff?.props.onSelectPage(1);
                    });
                } else {
                    this.modal.alert('not found data');
                }
            }else {
                this.setState({
                    data:{},
                    isEdit:false,   
                });
            }
        }).catch((err)=>{   
            this.modal.alert(err.message || 'get data error');
        }); 
    };

    getTableData(name, source,def_order) {

        let condition = {
            field:'abi_entry_model_id',
            value: this.window?.params?.id,
            flag:  'eq'
        }; 
        let query = async (page) => {
            this.modal.loading('Loading...');
            let order = this["order"+name] ?? [];
            generalApi().GetData(source,page,50, [condition],order.length>0?order:def_order,this[name]?.props?.totalFields??null).then((res)=>{
                this.modal?.close();
                if (res.status) {
                    let data = {};
                    data['tab_'+name+'_data'] = res.data.list||[];
                    data['tab_'+name+'_page'] = page;
                    data['tab_'+name+'_count'] = res.data.count;
                    data['tab_'+name+'_total'] = res.data?.total;   
                    this.setState(data);
                } else {    
                    let data = {};
                    data['tab_'+name+'_data'] = [];
                    data['tab_'+name+'_page'] = 1;
                    data['tab_'+name+'_count'] = 0;
                    data['tab_'+name+'_total'] = null;   
                    this.setState(data);      
                    this.modal.alert('get data error:'+res.message);  
                }
            });                   
        }
        if (typeof this.getData !== "function") {
            this.getData = query;
        }
        return query
    }

    saveData = (callback) => {
        let _this = this;
        let _data = this.state.data;
        let tableName = 'sub_abi_entry_model_tariff';
        _data.editTariffs = _this[tableName].getEditRows();
        console.log(_data.editTariffs );
        // console.log(_this[tableName].getData())
        // Validate duty_seq_no is not empty
        // let hasEmptyDutySeqNo = _data.editTariffs.some((item, index) => {
        //     return item.duty_seq_no === null || item.duty_seq_no === undefined || item.duty_seq_no === '';
        // });

        // if (hasEmptyDutySeqNo) {
        //     _this.modal.alert('T-Seq is required, please fill in all T-Seq values.');
        //     return;
        // }

        // _data.editTariffs.forEach(item=>{ 
        //     if(!item.abi_entry_line_tariff_id){
        //         item.abi_entry_line_tariff_id = 0;
        //     }
        // });


        // _data.delTariffs = _this.delTariffs??[];

        // return request.post("/Api/AbiEntryModel/Save",_data)
        //     .then((res)=>{
        //         _this.modal?.close();
        //         if (res.status) {
        //             if(!_this.window.params){
        //                 _this.window.params = {};
        //             }
        //             _this.delTariffs = [];
        //             _this.window.params.id = res.data.abi_entry_model_id;
        //             _this[tableName].props.onSelectPage(1);
        //             _this.refreshParentWindow();
        //             _this.setState({isEdit:false});
        //         } else {
        //             _this.modal.alert('save data error:'+res.message);
        //         }
        //         if(isFunction(callback)){
        //             callback();
        //         }
        //     }).catch((err)=>{
        //         _this.modal.alert('save data error:'+err.message);
        //     });
    };

    refreshEntryWindow=()=>{
        let parentWindowName = 'f_abi_entry';
        if (!!this.window.parent.windows[parentWindowName] && this.window.parent.windows[parentWindowName]?.state.close !== true){
            this.window.parent.windows[parentWindowName].showHandler();  
        }
    };


    fieldChangeHandler = (field,val,row,type,textField)=>{
        let data = this.state.data;
        if (type==='combo') {
            data[field] = row?row[field]??row[textField.combo_key]:val;
            data[textField.key_text] = val;
        } else {
            data[field] = val;
        }
        this.setState({data:data});
    };

    sortHandler = (table) => {
        if (!this["order"+table]) {
            this["order"+table] = [];
        }
        return (field,sort_type) => {
            this["order"+table] = [{
                field:field,
                type:sort_type
            }]
        }
    }

    filterHandler = (table) => {
        if (!this["filter"+table]) {
            this["filter"+table] = [];
        }
        return (text,field,type) => {
            if (type === 'clear') {
                this["filter"+table] = [];
            } else {
                this["filter"+table]=this["filter"+table]??[];
                this["filter"+table].push({
                    field:field,
                    value:text,
                    flag:type
                })
            }
        }
    }

    onApplyHSCode = (goods) => {
        let _Data = this.state.data??{};
        if(_Data?.abi_entry_model_id>0){
            this.modal.loading('Loading...');
            request.postRepeat(`/Api/AbiEntryModel/BuildEntryLineModel`,{abi_entry_model_id:_Data.abi_entry_model_id,goods:goods})
                   .then((res)=>{
                    if (res.status) {
                        this.modal.alert("Apply HSCode Completed.",()=>{
                            this.sub_abi_entry_model_tariff?.props.onSelectPage(1);
                        });
                    }else{
                        this.modal.alert({content: res.message});
                    }
            });
        }else{
            this.modal.alert({content: "Please select a batch first."});
        }
    }


    open() {}

    onUpdateFromState = (_isEdit=true)=>{
        console.log(_isEdit);
        this.setState({isEdit:_isEdit});
    };

    
    deleteItem =async (row,index,callback)=>{
        if(row.abi_entry_model_tariff_id){
            if(!this.delTariffs){
                this.delTariffs = [];
            }
            this.delTariffs.push(row); 
            this.onUpdateFromState(); 
        }
        callback(index);//删除控件上数据
    };

    onDisabledFunc = (row) => {
        return row.duty_hs_code!="" && row.duty_hs_code===this.state.data?.hs_code;
    };
    

    render() {        return (
            <Form ref={c=>this.form=c} onChange={this.fieldChangeHandler}>
                <CTable jsxId={'sub_abi_entry_model_tariff'} absolute={true} x={'16px'} y={'128px'} width={'640px'} height={'272px'} scroll={true} headerTheme={'primary'} hover={true} select={false} sm={true} fontSm={true} source={'v_abi_entry_model_tariff'} data={this.state.tab_sub_abi_entry_model_tariff_data} ref={c=>this.sub_abi_entry_model_tariff=c} page={this.state.tab_sub_abi_entry_model_tariff_page} dataCount={this.state.tab_sub_abi_entry_model_tariff_count} onSelectPage={this.getTableData('sub_abi_entry_model_tariff','v_abi_entry_model_tariff',null)} showNumbers={50} edit={true} onFilter={this.filterHandler('sub_abi_entry_model_tariff')} onSort={this.sortHandler('sub_abi_entry_model_tariff')} onDelete={this.deleteItem}>
                    <Table.Header jsxId={'sub_abi_entry_model_tariff-duty_seq_no'} field={'duty_seq_no'} text={'T-Seq'} width={'56px'} align={'center'} color={'#000000'} bgColor={'#ffffff'} dataType={'number'} foot={false} type={''} onEdit={(index,val,row,callback)=>{
                        this.onUpdateFromState();
                    }} noReplace={"onEdit"}/>
                    <Table.Header jsxId={'sub_abi_entry_model_tariff-duty_hs_code'} field={'duty_hs_code'} text={'Tariff Code'} width={'116px'} align={''} color={''} bgColor={''} dataType={'text'} foot={false} type={'combo'} combo={{
                        onSearch:ComboSearch('hs_code','q_hs_us',null),
                        searchColumn:'hs_code',
                        width:'384px',
                        header:false,
                        filterColumns:[
                            {field:'hs_code',width:'96px'},
                            {field:'hs_code_desc',width:'288px'}
                        ]
                    }} onEdit={(index,val,row,callback)=>{
                        if(!this.sub_abi_entry_model_tariff) return;
                        this.sub_abi_entry_model_tariff.state.data[index]["hs_code_desc"]=row?row["hs_code_desc"]:"";
                        this.sub_abi_entry_model_tariff.state.data[index]["column1_rate_ad_valorem"]=row?row["column1_rate_ad_valorem"]:"0";
                    }} disabledFunc={this.onDisabledFunc} noReplace={"disabledFunc,onEdit"}/>
                    <Table.Header jsxId={'sub_abi_entry_model_tariff-column1_rate_ad_valorem'} field={'column1_rate_ad_valorem'} text={'Valorem Rate'} width={'92px'} align={'center'} color={'#000000'} bgColor={''} dataType={'number'} onFormat={val=>val?Intl.NumberFormat("en-US",{style:"percent",minimumFractionDigits:2}).format(val):''} foot={false} type={''} disabled={true}  onEdit={(index,val,row,callback)=>{
                        this.onUpdateFromState();
                    }} disabledFunc={this.onDisabledFunc} noReplace={"disabledFunc,onEdit"}/>
                    <Table.Header jsxId={'sub_abi_entry_model_tariff-hs_code_desc'} field={'hs_code_desc'} text={'HS Desc'} width={'264px'} align={'left'} color={'#000000'} bgColor={''} dataType={'text'} foot={false} type={''} disabled={true} onEdit={(index,val,row,callback)=>{
                        this.onUpdateFromState();
                    }} disabledFunc={this.onDisabledFunc} noReplace={"disabledFunc,onEdit"}/>
                    <Table.Header jsxId={'sub_abi_entry_model_tariff-fee_class_code'} field={'fee_class_code'} text={'Class'} width={'64px'} align={'center'} color={'#000000'} bgColor={'#ffffff'} dataType={'text'} foot={false} type={''} onEdit={(index,val,row,callback)=>{
                        this.onUpdateFromState();
                    }} disabledFunc={this.onDisabledFunc} noReplace={"disabledFunc,onEdit"}/>
                </CTable>
                <Box jsxId={'Boxheadline'} absolute={true} x={'0px'} y={'0px'} width={'644px'} height={'24px'} backColor={'#355875'} borderColor={'#000000'} borderWidth={'1px'}/>
                <Button jsxId={'btn0Save'} absolute={true} size={'xs'} x={'644px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'save'} onClick={()=>withBtnLoading(this.state.btnLoading, (s)=>this.setState({btnLoading:s}), 'btn0Save', ()=>this.saveData())} theme={'success'} tip={'Save'} disabled={this.state.isEdit!=true || this.state.btnLoading?.btn0Save} noReplace={"disabled,onClick"}>
                    
                </Button>
                <Button jsxId={'btn3ApplytoHSandGoods'} absolute={true} size={'xs'} x={'504px'} y={'64px'} width={'68px'} height={'36px'} outline={true} theme={'danger'} tip={null} onClick={()=>withBtnLoading(this.state.btnLoading, (s)=>this.setState({btnLoading:s}), 'btn3ApplytoHSandGoods', ()=>this.onApplyHSCode(2))} disabled={this.state.btnLoading?.btn3ApplytoHSandGoods} noReplace={"onClick,disabled"}>
                    HS Code + Goods
                </Button>
                <Button jsxId={'btn3ApplytoThisSameHSCode'} absolute={true} size={'xs'} x={'576px'} y={'64px'} width={'72px'} height={'36px'} outline={true} theme={'primary'} tip={null} onClick={()=>withBtnLoading(this.state.btnLoading, (s)=>this.setState({btnLoading:s}), 'btn3ApplytoThisSameHSCode', ()=>this.onApplyHSCode(1))} disabled={this.state.btnLoading?.btn3ApplytoThisSameHSCode} noReplace={"onClick,disabled"}>
                    Same <br/>HS Code
                </Button>
                <Input jsxId={'entry_seq_code'} field={'entry_seq_code'} absolute={true} size={'xs'} lang={'en'} x={'96px'} y={'40px'} width={'92px'} tabIndex={'4'} color={'#000000'} disableClear={true} locked={true} align={'center'} data={this.state.data?.entry_seq_code} maxlength={6}/>
                <Label jsxId={'Label298'} sm={true} absolute={true} x={'16px'} y={'40px'} width={'76px'} height={'20px'} align={'left'} color={'#000000'} text={'Entry Seq'}/>
                <Input jsxId={'hs_code'} field={'hs_code'} absolute={true} size={'xs'} lang={'en'} x={'96px'} y={'68px'} width={'92px'} tabIndex={'5'} color={'#000000'} disableClear={true} locked={true} align={'center'} data={this.state.data?.hs_code} maxlength={10}/>
                <Label jsxId={'Label1421'} sm={true} absolute={true} x={'16px'} y={'68px'} width={'76px'} height={'20px'} align={'left'} color={'#000000'} text={'HS Code'}/>
                <Input jsxId={'goods_desc'} field={'goods_desc'} absolute={true} size={'xs'} lang={'en'} x={'96px'} y={'96px'} width={'192px'} tabIndex={'6'} color={'#000000'} disableClear={true} locked={true} align={'left'} data={this.state.data?.goods_desc} maxlength={250}/>
                <Label jsxId={'Label1423'} sm={true} absolute={true} x={'16px'} y={'96px'} width={'80px'} height={'20px'} align={'left'} color={'#000000'} text={'Goods Desc'}/>
                <Box jsxId={'Box235'} absolute={true} x={'496px'} y={'36px'} width={'160px'} height={'76px'} borderColor={'#808080'} borderWidth={'1px'}/>
                <Label jsxId={'Label1426'} sm={true} absolute={true} x={'500px'} y={'36px'} width={'56px'} height={'20px'} align={'left'} color={'#000000'} text={'Apply to'}/>
                <Button jsxId={'btn3ModelComplete'} absolute={true} size={'xs'} x={'408px'} y={'64px'} width={'72px'} height={'36px'} outline={true} theme={'primary'} tip={null}>
                    Model Complete
                </Button>
                <Label jsxId={'abi_entry_model_id'} sm={true} absolute={true} x={'60px'} y={'4px'} width={'56px'} height={'20px'} align={'center'} color={'#ffffff'} field={'abi_entry_model_id'} text={this.state.data?.abi_entry_model_id}/>
                <Label jsxId={'Label157'} sm={true} absolute={true} x={'16px'} y={'4px'} width={'40px'} height={'20px'} align={'left'} color={'#ffffff'} text={'Seq'}/>
                <Label jsxId={'status_desc'} sm={true} absolute={true} x={'200px'} y={'4px'} width={'96px'} height={'20px'} align={'left'} color={'#ffffff'} field={'status_desc'} text={this.state.data?.status_desc}/>
                <Label jsxId={'Label1433'} sm={true} absolute={true} x={'148px'} y={'4px'} width={'48px'} height={'20px'} align={'left'} color={'#ffffff'} text={'Status'}/>
                <Label jsxId={'Label1435'} sm={true} absolute={true} x={'556px'} y={'36px'} width={'68px'} height={'20px'} align={'left'} color={'#000000'} text={'this Entry'}/>
                <Box jsxId={'Box1440'} absolute={true} x={'396px'} y={'36px'} width={'92px'} height={'76px'} borderColor={'#808080'} borderWidth={'1px'}/>
                <Label jsxId={'Label1441'} sm={true} absolute={true} x={'400px'} y={'40px'} width={'68px'} height={'20px'} align={'left'} color={'#000000'} text={'Complete'}/>
                <WModal ref={c=>this.modal=c}/>
            </Form>
        );}
}

export default FAbiEntryModel;