/*****VERSION*****
* app_version: 1.34.0
* created_date: 2026-05-18 11:08:09
* last_replace_date: 2026-05-29 08:11:10
* replace_date: 2026-05-30 14:03:24
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
    Form,
} from '@clake/react-bootstrap4';
import {
    CTable,
	Window,
	WModal
} from '../../../src/index';
import {GetData,ComboSearch,ProcessData,ajaxPostModel,ajaxPostUrl } from '../../common/DataService';
// import {isFunction} from '../../common/common';

class FImdb extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'f_imdb';
		this.title = 'Importer Big Data';
        if (!this.props.width) {
            this.width = '664px';
        }
        if (!this.props.height) {
            this.height = '516px';
        }
		this.source = 's_imdb';
		this.process = 't_imdb';
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
			isEdit:false,
		};

        //删除的关联数据
        this.del_bonds = [];
    }

    componentDidMount() {
		if (this.window) {
			this.window.on(Window.EVT_SHOW,this.showHandler);
            this.window.is_before = true;
            this.window.on(Window.EVT_BEFORE_CLOSE,this.closeBeforeHandler);
			this.window.on(Window.EVT_CLOSE,this.closeHandler);
		}
		this.showHandler()
    }

    showHandler = ()=>{
        // this.getData(this.window?.params?.id||0)
    };

    closeHandler = ()=>{    
    };

    closeBeforeHandler =(callbackClose)=>{
        if(this.state.isEdit==true){
            this.modal.confirm({content: 'DATA UPDATED, SAVE THE CHANGE?'},(flag)=>{
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


	getData = (id) => {
		ajaxPostUrl({
            url:'/Api/Imdb/GetImdb',
            loading:this,
            data:{id:id},
            success:(data)=>{
                this.setState({
                    data:data,
                    isEdit:false,
                    lock:this.setLock(data)
                },()=>{
                    this.sub_imdb_bond_list.props.onSelectPage(1);
                });
                
            }
        });	
    };

    setLock =(data)=>{
        return {all:false};
    };   

	getTableData(name, source, def_order) {
        let query = (page) => {
            this.modal.loading('Loading...');
            let order_by = this["order"+name] ?? [];
            GetData(source,page,50, [{
                field:'imdb_seq_id',
                value:this.state.data.imdb_seq_id,
                flag:'eq'
            }],order_by.length>0?order_by:def_order,(res)=>{
                if(!this.modal)return;
                this.modal.close();
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
                }
            },this[name].props.totalFields);
        }
        if (typeof this.getData !== "function") {
            this.getData = query;
        }
        this[name+"_query"] = query;
        return query
    }

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
            lock:this.setLock(data)
        })
    };

	cloneData = ()=>{
        let data = Common.Clone(this.state.data);
        delete data.imdb_seq_id;
        this.setState({
            data:data,
            isEdit:false,
            lock:this.setLock(data)
        })
    };

 
    saveData = (callback) => {
        let _this = this;
        let _data = this.state.data;
        _data.bonds = this.sub_imdb_bond_list.getEditRows();
        console.log("bonds",_data.bonds);
        _data.bonds.forEach(item=>{ 
            if(!item.imdb_bond_auto_id){
                item.imdb_bond_auto_id = 0;
            }
        });
        _data.del_bonds = this.del_bonds??[];
        // ajaxPostModel({
        //     url: '/Api/Imdb/save',
        //     loading: this,
        //     form: this.id,
        //     button: 'btn0Save',
        //     data: _data,
        //     success: (data) => {
        //         if(!this.window.params){
        //             this.window.params = {};
        //         }
        //         this.window.params.id = data.imdb_seq_id;
        //         this.setState({
        //             data:data,
        //             isEdit:false,
        //             lock:this.setLock(data)
        //         },()=>{
        //             this.del_bonds = [];
        //             if(isFunction(callback)){
        //                  _this.refreshWindow();
        //                 callback();
        //             }else{
        //                 this.modal.alert({messageid:1000, content: 'RECORD SAVED.'},()=>{
        //                     _this.refreshWindow();
        //                     let _params = _this.window?.params;
        //                     if(_params?.fun=="add"){
        //                         this.window.close();
        //                     }
        //                 });
        //             }
        //         });
        //     }
        // });
    };

    refreshWindow = ()=>{
        let _fromname = "f_imdb_query";
        if(this.window.parent.windows[_fromname] && this.window.parent.windows[_fromname]?.state.close !== true){
            this.window.parent.windows[_fromname].showHandler(); 
        }
    };

    deleteData = ()=>{
        this.modal.confirm({messageid:2021, content: 'SURE TO DELETE?'},(flag)=>{
            if (flag){
                ajaxPostUrl({
                    url: '/Api/Imdb/Delete',
                    loading: this,
                    data: { id: this.window.params.id },
                    success: (data) => {
                        _this.refreshWindow();
                        this.window.close();
                    }
                });
            }
        });
    };


    onChangeBond = (idx, field, row, all_data, jsxId) => {
        this.setState({isEdit:true});
    };     

    onDeleteBond = (row,row_index) => {
        this.setState({isEdit:true});
        if(row.imdb_bond_auto_id){
           this.del_bonds.push(row);  
        }
        this.sub_imdb_bond_list.deleteRow(row_index);
    };    
    
    fieldChangeHandler = (field,val,row,type,textField)=>{
        let data = this.state.data;
        if (type==='combo') {
            data[field] = row?row[field]??row[textField.combo_key]:val;
            data[textField.key_text] = val;
        } else {
            data[field] = val;
        }
        this.setState({data:data,isEdit:true});
    };
	
	sortHandler = (table) => {
        if (!this["order"+table]) {
            this["order"+table] = [];
        }
        return (field,sort_type) => {
            this["order"+table] = [{
                field:field,
                type:sort_type
            }];
            this[table].props.onSelectPage(1);
        }
    };

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
            this[table].props.onSelectPage(1);
        }
    };

	open(formName,field){
        return (row)=> {
            this.manage.open(formName,{id:row[field]??0});
        }
    }


    render() {        return (
            <Form ref={c=>this.form=c} onChange={this.fieldChangeHandler}>
                <Box jsxId={'Boxheadline'} absolute={true} x={'0px'} y={'0px'} width={'580px'} height={'24px'} backColor={'rgb(53,88,117)'} borderColor={'rgb(0,0,0)'} borderWidth={'1px'}/>
                <Label jsxId={'imdb_seq_id'} sm={true} absolute={true} x={'80px'} y={'4px'} width={'52px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} field={'imdb_seq_id'} text={this.state.data?.imdb_seq_id}/>
                <Label jsxId={'lbl_efc_branch_id'} sm={true} absolute={true} x={'16px'} y={'4px'} width={'60px'} height={'20px'} align={'left'} color={'rgb(255,255,255)'} text={'Seq No:'}/>
                <Input jsxId={'importer_name'} field={'importer_name'} absolute={true} size={'xs'} lang={'en'} x={'100px'} y={'40px'} width={'284px'} tabIndex={'1'} color={'#000000'} disableClear={true} align={'left'} data={this.state.data?.importer_name} maxlength={35}/>
                <Label jsxId={'lbl_company_name Code'} sm={true} absolute={true} x={'24px'} y={'40px'} width={'72px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Importer'}/>
                <Box jsxId={'box_00_11'} absolute={true} x={'24px'} y={'124px'} width={'372px'} height={'188px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                <TextArea jsxId={'address'} field={'address'} absolute={true} size={'xs'} lang={'en'} x={'120px'} y={'144px'} width={'256px'} tabIndex={'2'} color={'#000000'} disableClear={true} height={'52px'} data={this.state.data?.address} maxlength={120}/>
                <Label jsxId={'Label901'} sm={true} absolute={true} x={'44px'} y={'144px'} width={'72px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Address '}/>
                <Input jsxId={'city'} field={'city'} absolute={true} size={'xs'} lang={'en'} x={'120px'} y={'208px'} width={'128px'} tabIndex={'3'} color={'#000000'} disableClear={true} align={'left'} data={this.state.data?.city} maxlength={25}/>
                <Label jsxId={'Label902'} sm={true} absolute={true} x={'44px'} y={'208px'} width={'72px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'City Name'}/>
                <Input jsxId={'postal_code'} field={'postal_code'} absolute={true} size={'xs'} lang={'en'} x={'120px'} y={'240px'} width={'128px'} tabIndex={'4'} color={'#080000'} disableClear={true} align={'left'} data={this.state.data?.postal_code} maxlength={10}/>
                <Label jsxId={'Label921'} sm={true} absolute={true} x={'44px'} y={'240px'} width={'72px'} height={'20px'} align={'left'} color={'rgb(18,0,0)'} text={'Zip Code'}/>
                <Input jsxId={'importer_id_no'} field={'importer_id_no'} absolute={true} size={'xs'} lang={'en'} x={'100px'} y={'72px'} width={'140px'} tabIndex={'5'} color={'#000000'} disableClear={true} align={'left'} data={this.state.data?.importer_id_no} maxlength={12}/>
                <Label jsxId={'Label903'} sm={true} absolute={true} x={'24px'} y={'72px'} width={'72px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'ID Number'}/>
                <Label jsxId={'Label952'} sm={true} absolute={true} x={'24px'} y={'108px'} width={'372px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'ID - Address'}/>
                <Label jsxId={'Label973'} sm={true} absolute={true} x={'408px'} y={'108px'} width={'236px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Type A - Entry Bond Info'}/>
                <Input jsxId={'a_bond_no'} field={'a_bond_no'} absolute={true} size={'xs'} lang={'en'} x={'528px'} y={'144px'} width={'116px'} tabIndex={'8'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.a_bond_no} maxlength={9}/>
                <Label jsxId={'Label1563'} sm={true} absolute={true} x={'428px'} y={'144px'} width={'92px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Bond Number'}/>
                <Input jsxId={'a_bond_expiration_date'} field={'a_bond_expiration_date'} absolute={true} size={'xs'} lang={'en'} x={'528px'} y={'176px'} width={'116px'} tabIndex={'9'} color={'#000000'} disableClear={true} align={'center'} calendar={{format:'MM-DD-YYYY'}} data={this.state.data?.a_bond_expiration_date}/>
                <Label jsxId={'Label1565'} sm={true} absolute={true} x={'428px'} y={'176px'} width={'92px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Expiration Dt'}/>
                <Input jsxId={'a_surety_code'} field={'a_surety_code'} absolute={true} size={'xs'} lang={'en'} x={'528px'} y={'240px'} width={'48px'} tabIndex={'10'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.a_surety_code} maxlength={3}/>
                <Label jsxId={'Label152'} sm={true} absolute={true} x={'428px'} y={'240px'} width={'92px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Surety No.'}/>
                <Input jsxId={'bond_status_desc'} field={'bond_status_desc'} absolute={true} size={'xs'} lang={'en'} x={'572px'} y={'72px'} width={'92px'} tabIndex={'11'} color={'#000000'} disableClear={true} align={'left'} data={this.state.data?.bond_status_desc} maxlength={12}/>
                <Input jsxId={'a_bond_amount'} field={'a_bond_amount'} absolute={true} size={'xs'} lang={'en'} x={'528px'} y={'208px'} width={'116px'} tabIndex={'12'} color={'#000000'} disableClear={true} align={'right'} data={this.state.data?.a_bond_amount} onFormat={val=>val?Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(val):''}/>
                <Label jsxId={'Label1010'} sm={true} absolute={true} x={'428px'} y={'208px'} width={'92px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Bond Amount'}/>
                <Input jsxId={'sub_division_code'} field={'sub_division_code'} absolute={true} size={'xs'} lang={'en'} x={'316px'} y={'208px'} width={'60px'} tabIndex={'6'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.sub_division_code} maxlength={4}/>
                <Input jsxId={'country_code'} field={'country_code'} absolute={true} size={'xs'} lang={'en'} x={'316px'} y={'240px'} width={'60px'} tabIndex={'7'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.country_code} maxlength={2}/>
                <CTable jsxId={'sub_imdb_bond_list'} absolute={true} x={'24px'} y={'408px'} width={'644px'} height={'128px'} scroll={true} headerTheme={'primary'} edit={true} hover={true} select={false} sm={true} fontSm={true} source={'v_imdb_bond_list'} data={this.state.tab_sub_imdb_bond_list_data} ref={c=>this.sub_imdb_bond_list=c} page={this.state.tab_sub_imdb_bond_list_page} dataCount={this.state.tab_sub_imdb_bond_list_count} onSelectPage={this.getTableData('sub_imdb_bond_list','v_imdb_bond_list',null)} showNumbers={50}
                    onFilter={this.filterHandler('sub_imdb_bond_list')} 
                    onSort={this.sortHandler('sub_imdb_bond_list')} 
                    onDelete={this.onDeleteBond}
                    onChange={this.onChangeBond}>

                    <Table.Header jsxId={'sub_imdb_bond_list-bond_no'} field={'bond_no'} text={'Bond No.'} width={'104px'} align={'left'} color={'#000000'} dataType={'text'}/>
                    <Table.Header jsxId={'sub_imdb_bond_list-bond_activity_code'} field={'bond_activity_code'} text={'Cde'} width={'36px'} align={'center'} color={'#000000'} dataType={'text'}/>
                    <Table.Header jsxId={'sub_imdb_bond_list-bond_amount'} field={'bond_amount'} text={'Bond Amt'} width={'108px'} align={'right'} color={'#000000'} dataType={'number'} onFormat={val=>val?Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(val):''} foot={false} type={'currency'}/>
                    <Table.Header jsxId={'sub_imdb_bond_list-bond_expiration_date'} field={'bond_expiration_date'} text={'Expiration Date'} width={'85px'} align={'center'} color={'#000000'} dataType={'number'} onFormat={val=>val?moment(val).format('MM-DD-YYYY'):''} foot={false} type={'calendar'}/>
                    <Table.Header jsxId={'sub_imdb_bond_list-surety_code'} field={'surety_code'} text={'Surety'} width={'56px'} align={'center'} color={'#000000'} dataType={'text'}/>
                    <Table.Header jsxId={'sub_imdb_bond_list-PMS_approved_sw'} field={'PMS_approved_sw'} text={'PMS'} width={'36px'} align={'center'} color={''} dataType={'bool'} onFormat={val=><i className={"text-primary far "+ (!!val?"fa-check-circle":"fa-circle")}/>} foot={false} type={'checkbox'}/>
                    <Table.Header jsxId={'sub_imdb_bond_list-modified_date'} field={'modified_date'} text={'Modified Date'} width={'85px'} align={'center'} color={'#000000'} dataType={'number'} onFormat={val=>val?moment(val).format('MM-DD-YYYY'):''}/>
                    <Table.Header jsxId={'sub_imdb_bond_list-a_bond_amount_prev'} field={'a_bond_amount_prev'} text={'Prev Amt'} width={'108px'} align={'right'} color={'#000000'} dataType={'number'} onFormat={val=>val?Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(val):''}/>
                    <Table.Header jsxId={'sub_imdb_bond_list-a_bond_expiration_date_prev'} field={'a_bond_expiration_date_prev'} text={'Prev Expired'} width={'85px'} align={'center'} color={'#000000'} dataType={'number'} onFormat={val=>val?moment(val).format('MM-DD-YYYY'):''}/>
                    <Table.Header jsxId={'sub_imdb_bond_list-bond_expired_sw'} field={'bond_expired_sw'} text={'Expired'} width={'48px'} align={'center'} color={''} dataType={'bool'} onFormat={val=><i className={"text-primary far "+ (!!val?"fa-check-circle":"fa-circle")}/>} foot={false} type={'checkbox'}/>
                    <Table.Header jsxId={'sub_imdb_bond_list-bond_sufficient_sw'} field={'bond_sufficient_sw'} text={'Sufficient'} width={'60px'} align={'center'} color={''} dataType={'bool'} onFormat={val=><i className={"text-primary far "+ (!!val?"fa-check-circle":"fa-circle")}/>} foot={false} type={'checkbox'}/>
                    <Table.Header jsxId={'sub_imdb_bond_list-bond_effective_date'} field={'bond_effective_date'} text={'Effective Date'} width={'85px'} align={'center'} color={'#000000'} dataType={'number'} onFormat={val=>val?moment(val).format('MM-DD-YYYY'):''} foot={false} type={'calendar'}/>
                    <Table.Header jsxId={'sub_imdb_bond_list-created_date'} field={'created_date'} text={'Created Date'} width={'85px'} align={'center'} color={'#000000'} dataType={'number'} onFormat={val=>val?moment(val).format('MM-DD-YYYY'):''} foot={false} type={'calendar'}/>
                    <Table.Header jsxId={'sub_imdb_bond_list-bond_port_code'} field={'bond_port_code'} text={'Port '} width={'56px'} align={'center'} color={'#000000'} dataType={'text'}/>
                    <Table.Header jsxId={'sub_imdb_bond_list-name_qualifier'} field={'name_qualifier'} text={'DBA'} width={'40px'} align={'center'} color={'#000000'} dataType={'text'}/>
                    <Table.Header jsxId={'sub_imdb_bond_list-imdb_bond_auto_id'} field={'imdb_bond_auto_id'} text={'Seq'} width={'60px'} align={'center'} color={'#000000'} dataType={'number'}/>
                </CTable>
                <Box jsxId={'Box1014'} absolute={true} x={'408px'} y={'128px'} width={'260px'} height={'184px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                <Label jsxId={'Label1015'} sm={true} absolute={true} x={'260px'} y={'208px'} width={'52px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'State'}/>
                <Label jsxId={'Label1016'} sm={true} absolute={true} x={'260px'} y={'240px'} width={'52px'} height={'20px'} align={'left'} color={'rgb(18,0,0)'} text={'Country'}/>
                <CCheckbox jsxId={'a_PMS_sw'} field={'a_PMS_sw'} absolute={true} x={'632px'} y={'244px'} checked={this.state.data?.a_PMS_sw} locked={true}/>
                <Label jsxId={'Label1020'} sm={true} absolute={true} x={'584px'} y={'240px'} width={'44px'} height={'20px'} align={'center'} color={'rgb(0,0,0)'} text={'PMS'}/>
                <Input jsxId={'no_of_bonds'} field={'no_of_bonds'} absolute={true} size={'xs'} lang={'en'} x={'632px'} y={'272px'} width={'20px'} tabIndex={'15'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.no_of_bonds}/>
                <Label jsxId={'Label1021'} sm={true} absolute={true} x={'584px'} y={'272px'} width={'44px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Bonds'}/>
                <Input jsxId={'modified_date'} field={'modified_date'} absolute={true} size={'xs'} lang={'en'} x={'120px'} y={'360px'} width={'128px'} tabIndex={'16'} color={'#000000'} disableClear={true} align={'center'} calendar={{format:'MM-DD-YYYY HH:mm'}} data={this.state.data?.modified_date}/>
                <Label jsxId={'Label1050'} sm={true} absolute={true} x={'44px'} y={'360px'} width={'72px'} height={'20px'} align={'left'} color={'rgb(18,0,0)'} text={'Modified'}/>
                <Input jsxId={'center_code'} field={'center_code'} absolute={true} size={'xs'} lang={'en'} x={'316px'} y={'272px'} width={'60px'} tabIndex={'17'} color={'#000000'} disableClear={true} align={'left'} data={this.state.data?.center_code} maxlength={6}/>
                <Label jsxId={'Label1055'} sm={true} absolute={true} x={'260px'} y={'272px'} width={'52px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Center'}/>
                <CCheckbox jsxId={'entry_bond_sw'} field={'entry_bond_sw'} absolute={true} x={'648px'} y={'112px'} checked={this.state.data?.entry_bond_sw} locked={true}/>
                <Box jsxId={'Box1031'} absolute={true} x={'24px'} y={'312px'} width={'372px'} height={'84px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                <Box jsxId={'Box1032'} absolute={true} x={'408px'} y={'312px'} width={'260px'} height={'84px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                <Input jsxId={'bond_info_changed_code'} field={'bond_info_changed_code'} absolute={true} size={'xs'} lang={'en'} x={'336px'} y={'328px'} width={'40px'} tabIndex={'19'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.bond_info_changed_code} maxlength={1}/>
                <Label jsxId={'Label1034'} sm={true} absolute={true} x={'264px'} y={'328px'} width={'64px'} height={'20px'} align={'left'} color={'rgb(18,0,0)'} text={'Changed'}/>
                <Input jsxId={'imdb_change_desc'} field={'imdb_change_desc'} absolute={true} size={'xs'} lang={'en'} x={'264px'} y={'360px'} width={'112px'} tabIndex={'20'} color={'#000000'} disableClear={true} align={'left'} data={this.state.data?.imdb_change_desc} maxlength={12}/>
                <Input jsxId={'created_date'} field={'created_date'} absolute={true} size={'xs'} lang={'en'} x={'120px'} y={'328px'} width={'128px'} tabIndex={'21'} color={'#000000'} disableClear={true} align={'center'} calendar={{format:'MM-DD-YYYY HH:mm'}} data={this.state.data?.created_date}/>
                <Label jsxId={'Label1042'} sm={true} absolute={true} x={'44px'} y={'328px'} width={'72px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Create'}/>
                <Box jsxId={'Box1044'} absolute={true} x={'644px'} y={'108px'} width={'24px'} height={'20px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                <Input jsxId={'bond_status_code'} field={'bond_status_code'} absolute={true} size={'xs'} lang={'en'} x={'528px'} y={'72px'} width={'36px'} tabIndex={'22'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.bond_status_code} maxlength={1}/>
                <Label jsxId={'Label1046'} sm={true} absolute={true} x={'476px'} y={'72px'} width={'44px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Status'}/>
                <Input jsxId={'group_code'} field={'group_code'} absolute={true} size={'xs'} lang={'en'} x={'120px'} y={'272px'} width={'76px'} tabIndex={'23'} color={'#000000'} disableClear={true} align={'left'} data={this.state.data?.group_code} maxlength={12}/>
                <Label jsxId={'Label1065'} sm={true} absolute={true} x={'44px'} y={'272px'} width={'72px'} height={'20px'} align={'left'} color={'rgb(18,0,0)'} text={'Group -BFC'}/>
                <Input jsxId={'sys_type_code'} field={'sys_type_code'} absolute={true} size={'xs'} lang={'en'} x={'252px'} y={'72px'} width={'52px'} tabIndex={'24'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.sys_type_code} maxlength={4}/>
                <Input jsxId={'broker_filer_code'} field={'broker_filer_code'} absolute={true} size={'xs'} lang={'en'} x={'204px'} y={'272px'} width={'44px'} tabIndex={'25'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.broker_filer_code} maxlength={3}/>
                <Input jsxId={'last_inquiry_date'} field={'last_inquiry_date'} absolute={true} size={'xs'} lang={'en'} x={'528px'} y={'328px'} width={'116px'} tabIndex={'26'} color={'#000000'} disableClear={true} align={'center'} calendar={{format:'MM-DD-YYYY'}} data={this.state.data?.last_inquiry_date}/>
                <Label jsxId={'Label1058'} sm={true} absolute={true} x={'428px'} y={'328px'} width={'92px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Last Inquiry'}/>
                <Input jsxId={'next_inquiry_date'} field={'next_inquiry_date'} absolute={true} size={'xs'} lang={'en'} x={'528px'} y={'360px'} width={'116px'} tabIndex={'27'} color={'#000000'} disableClear={true} align={'center'} calendar={{format:'MM-DD-YYYY'}} data={this.state.data?.next_inquiry_date}/>
                <Label jsxId={'Label1060'} sm={true} absolute={true} x={'428px'} y={'360px'} width={'92px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Next Inquiry'}/>
                <Input jsxId={'interval_days'} field={'interval_days'} absolute={true} size={'xs'} lang={'en'} x={'528px'} y={'272px'} width={'48px'} tabIndex={'28'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.interval_days}/>
                <Label jsxId={'Label1064'} sm={true} absolute={true} x={'428px'} y={'272px'} width={'92px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Interval Days'}/>
                <Button jsxId={'btn0Delete'} absolute={true} size={'xs'} x={'580px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'times-circle'} onClick={this.deleteData} theme={'danger'} tip={'Delete'} disabled={!this.state.data.imdb_seq_id} noReplace={"disabled"}>
                    
                </Button>
                <Button jsxId={'btn0Clone'} absolute={true} size={'xs'} x={'608px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'clone'} onClick={this.cloneData} theme={'dark'} tip={'Clone'} disabled={!this.state.data.imdb_seq_id} noReplace={"disabled"}>
                    
                </Button>
                <Button jsxId={'btn0Save'} absolute={true} size={'xs'} x={'664px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'save'} onClick={this.saveData} theme={'success'} tip={'Save'} disabled={!this.state.isEdit} noReplace={'disabled'}>
                    
                </Button>
                <Button jsxId={'btn0Add'} absolute={true} size={'xs'} x={'636px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'folder-plus'} onClick={this.newData} theme={'dark'} tip={'Add'} disabled={!this.state.data.imdb_seq_id} noReplace={"disabled"}>
                    
                </Button>
                <WModal ref={c=>this.modal=c}/>
            </Form>
        );}
}

export default FImdb;
