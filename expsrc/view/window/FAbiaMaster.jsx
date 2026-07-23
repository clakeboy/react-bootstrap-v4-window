
/*****VERSION*****
* app_version: 2.0.1
* created_date: 2026-07-22 14:42:40
* last_replace_date: 2026-07-22 14:48:52
* replace_date: 2026-07-22 14:55:51
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
} from '../../../src/index'
import {GetData,ComboSearch,ProcessData} from '../../common/DataService';
class FAbiaMaster extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'f_abia_master';
        this.title = 'Query MAWB Manifest / ABI Status';
        if (!this.props.width) {
            this.width = '836px';
        }
        if (!this.props.height) {
            this.height = '576px';
        }
        this.source = 's_abia_master';
        this.process = 't_abi_master';
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
        if (this.window) {
            this.window.on(Window.EVT_SHOW,this.showHandler);
            this.window.on(Window.EVT_CLOSE,this.closeHandler);
        }
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
            field:'abi_master_id',
            value: id + '',
            flag:  'eq'
        };
        this.modal.loading('Loading...');
        GetData('s_abia_master',1,1, [condition],null,(res)=>{
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

    getTableData(name, source, def_order) {
        let query = (page) => {
            this.modal.loading('Loading...');
            GetData(source,page,50, [],this.order.length>0?this.order:order_by,(res)=>{
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
        })
    };

    cloneData = ()=>{
        let data = Common.Clone(this.state.data);
        delete data.abi_master_id;
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
        ProcessData(this.process,'delete',{'abi_master_id':this.window.params.id},(res)=>{
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

    open() {}

    render() {
        return (
            <Form ref={c=>this.form=c} onChange={this.fieldChangeHandler}>
                <Tabs jsxId={'MainTab'} sm={true} border={true} absolute={true} x={'0px'} y={'0px'} width={'836px'} height={'576px'}>
                    <TabsContent jsxId={'ManifestStatus'} id={'ManifestStatus'} text={'Manifest Status'} active={true}>
                        <Input jsxId={'master_bl_no'} field={'master_bl_no'} absolute={true} size={'xs'} lang={'en'} x={'100px'} y={'12px'} width={'112px'} tabIndex={'0'} color={'#800000'} disableClear={true} align={'left'} locked={true} data={this.state.data?.master_bl_no} maxlength={16}/>
                        <Label jsxId={'lbl_doc_code'} sm={true} absolute={true} x={'20px'} y={'12px'} width={'72px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'MAWB No.'}/>
                        <Box jsxId={'box_00_11'} absolute={true} x={'16px'} y={'45px'} width={'228px'} height={'81px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Box jsxId={'box_00_21'} absolute={true} x={'615px'} y={'45px'} width={'201px'} height={'81px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Button jsxId={'btn0Requery'} absolute={true} size={'xs'} x={'736px'} y={'12px'} width={'80px'} height={'24px'} outline={true} theme={'dark'} tip={'Requery'}>
                            Requery
                        </Button>
                        <Input jsxId={'status_desc'} field={'status_desc'} absolute={true} size={'xs'} lang={'en'} x={'296px'} y={'12px'} width={'96px'} tabIndex={'2'} color={'#000000'} disableClear={true} align={'left'} locked={true} data={this.state.data?.status_desc} maxlength={20}/>
                        <Label jsxId={'lbl_status_id'} sm={true} absolute={true} x={'240px'} y={'12px'} width={'48px'} height={'19px'} align={'center'} color={'rgb(0,0,0)'} text={'Status'}/>
                        <Input jsxId={'airline'} field={'airline'} absolute={true} size={'xs'} lang={'en'} x={'80px'} y={'60px'} width={'144px'} tabIndex={'3'} color={'#000080'} disableClear={true} align={'left'} locked={true} data={this.state.data?.airline} maxlength={100}/>
                        <Label jsxId={'Label701'} sm={true} absolute={true} x={'32px'} y={'60px'} width={'44px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'Airline'}/>
                        <Input jsxId={'FIRMS_code'} field={'FIRMS_code'} absolute={true} size={'xs'} lang={'en'} x={'696px'} y={'60px'} width={'52px'} tabIndex={'4'} color={'#000080'} disableClear={true} align={'center'} locked={true} data={this.state.data?.FIRMS_code} maxlength={4}/>
                        <Label jsxId={'Label707'} sm={true} absolute={true} x={'632px'} y={'60px'} width={'60px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'Firm Cde'}/>
                        <CTable jsxId={'sub_abia_master_list_manifest'} absolute={true} x={'16px'} y={'136px'} width={'800px'} height={'110px'} scroll={true} headerTheme={'primary'} hover={true} select={false} sm={true} fontSm={true} source={'v_abia_master_list_manifest'} data={this.state.tab_sub_abia_master_list_manifest_data} ref={c=>this.sub_abia_master_list_manifest=c} page={this.state.tab_sub_abia_master_list_manifest_page} dataCount={this.state.tab_sub_abia_master_list_manifest_count} onSelectPage={this.getTableData('sub_abia_master_list_manifest','v_abia_master_list_manifest',[{field:'part_indicator',type:'asc'}])} showNumbers={50} onFilter={this.filterHandler('sub_abia_master_list_manifest')} onSort={this.sortHandler('sub_abia_master_list_manifest')}>
                            <Table.Header jsxId={'sub_abia_master_list_manifest-part_indicator'} field={'part_indicator'} text={'Part'} width={'28px'} align={'center'} color={'#080000'} bgColor={'#ffffff'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_abia_master_list_manifest-flight_id'} field={'flight_id'} text={'Flight ID'} width={'84px'} align={'center'} color={'#080000'} bgColor={'#ffffff'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_abia_master_list_manifest-boarded_quantity'} field={'boarded_quantity'} text={'Qty Board'} width={'60px'} align={'center'} color={'#080000'} bgColor={'#ffffff'} dataType={'number'}/>
                            <Table.Header jsxId={'sub_abia_master_list_manifest-manifest_quantity'} field={'manifest_quantity'} text={'Pkg'} width={'60px'} align={'center'} color={'#080000'} bgColor={'#ffffff'} dataType={'number'}/>
                            <Table.Header jsxId={'sub_abia_master_list_manifest-atd_date'} field={'atd_date'} text={'ETD'} width={'88px'} align={'center'} color={'#080000'} bgColor={'#ffffff'} dataType={'number'} onFormat={val=>val?moment(val).format('YYYY-MM-DD'):''}/>
                            <Table.Header jsxId={'sub_abia_master_list_manifest-arrival_date'} field={'arrival_date'} text={'ETA'} width={'88px'} align={'center'} color={'#080000'} bgColor={'#ffffff'} dataType={'number'} onFormat={val=>val?moment(val).format('YYYY-MM-DD'):''}/>
                            <Table.Header jsxId={'sub_abia_master_list_manifest-inbond_number'} field={'inbond_number'} text={'I.T. Number'} width={'104px'} align={'left'} color={'#080000'} bgColor={'#ffffff'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_abia_master_list_manifest-it_type_desc'} field={'it_type_desc'} text={'Type'} width={'48px'} align={'center'} color={'#080000'} bgColor={'#ffffff'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_abia_master_list_manifest-inbond_status'} field={'inbond_status'} text={'Code'} width={'48px'} align={'center'} color={'#080000'} bgColor={'#ffffff'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_abia_master_list_manifest-ibond_status_desc'} field={'ibond_status_desc'} text={'I.T. Status'} width={'104px'} align={'left'} color={'#080000'} bgColor={'#ffffff'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_abia_master_list_manifest-icao_airline_code'} field={'icao_airline_code'} text={'ICAO'} width={'36px'} align={'center'} color={'#080000'} bgColor={'#ffffff'} dataType={'text'}/>
                        </CTable>
                        <Input jsxId={'carrier_code'} field={'carrier_code'} absolute={true} size={'xs'} lang={'en'} x={'80px'} y={'88px'} width={'36px'} tabIndex={'6'} color={'#000080'} disableClear={true} align={'center'} locked={true} data={this.state.data?.carrier_code} maxlength={4}/>
                        <Label jsxId={'Label723'} sm={true} absolute={true} x={'32px'} y={'88px'} width={'44px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'IATA'}/>
                        <Input jsxId={'hbl_count'} field={'hbl_count'} absolute={true} size={'xs'} lang={'en'} x={'756px'} y={'88px'} width={'44px'} tabIndex={'7'} color={'#000080'} disableClear={true} align={'center'} locked={true} data={this.state.data?.hbl_count}/>
                        <Label jsxId={'Label718'} sm={true} absolute={true} x={'756px'} y={'60px'} width={'44px'} height={'19px'} align={'center'} color={'rgb(0,0,0)'} text={'HBLs'}/>
                        <CTable jsxId={'sub_abia_master_list_2_event'} absolute={true} x={'16px'} y={'257px'} width={'800px'} height={'274px'} scroll={true} headerTheme={'primary'} hover={true} select={false} sm={true} fontSm={true} source={'v_abia_master_list_event'} data={this.state.tab_sub_abia_master_list_2_event_data} ref={c=>this.sub_abia_master_list_2_event=c} page={this.state.tab_sub_abia_master_list_2_event_page} dataCount={this.state.tab_sub_abia_master_list_2_event_count} onSelectPage={this.getTableData('sub_abia_master_list_2_event','v_abia_master_list_event',[{field:'bl_no',type:'asc'},{field:'ibl_no_type_desc',type:'desc'},{field:'event_date',type:'desc'}])} showNumbers={50} onFilter={this.filterHandler('sub_abia_master_list_2_event')} onSort={this.sortHandler('sub_abia_master_list_2_event')} noWrap={false}>
                            <Table.Header jsxId={'sub_abia_master_list_2_event-part_indicator'} field={'part_indicator'} text={'Part'} width={'28px'} align={'center'} color={'#080000'} bgColor={'#ffffff'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_abia_master_list_2_event-bl_no'} field={'bl_no'} text={'B/L No.'} width={'120px'} align={'left'} color={'#080000'} bgColor={'#ffffff'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_abia_master_list_2_event-ibl_no_type_desc'} field={'ibl_no_type_desc'} text={'B/L'} width={'28px'} align={'center'} color={'#080000'} bgColor={'#ffffff'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_abia_master_list_2_event-event_date'} field={'event_date'} text={'Event Date'} width={'120px'} align={'center'} color={'#080000'} bgColor={'#ffffff'} dataType={'number'} onFormat={val=>val?moment(val).format('YYYY-MM-DD HH:mm'):''}/>
                            <Table.Header jsxId={'sub_abia_master_list_2_event-disposition_code'} field={'disposition_code'} text={'Status'} width={'52px'} align={'center'} color={'#080000'} bgColor={'#ffffff'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_abia_master_list_2_event-disposition_desc'} field={'disposition_desc'} text={'Status Description'} width={'292px'} align={'left'} color={'#080000'} bgColor={'#ffffff'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_abia_master_list_2_event-manifest_quantity'} field={'manifest_quantity'} text={'Package'} width={'60px'} align={'center'} color={'#080000'} bgColor={'#ffffff'} dataType={'number'}/>
                            <Table.Header jsxId={'sub_abia_master_list_2_event-boarded_quantity'} field={'boarded_quantity'} text={'Boarded'} width={'60px'} align={'center'} color={'#080000'} bgColor={'#ffffff'} dataType={'number'}/>
                        </CTable>
                        <Box jsxId={'Box637'} absolute={true} x={'243px'} y={'45px'} width={'373px'} height={'81px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'arrival_port_code'} field={'arrival_port_code'} absolute={true} size={'xs'} lang={'en'} x={'436px'} y={'88px'} width={'52px'} tabIndex={'9'} color={'#000080'} disableClear={true} align={'left'} locked={true} data={this.state.data?.arrival_port_code} maxlength={4}/>
                        <Input jsxId={'departure_port_code'} field={'departure_port_code'} absolute={true} size={'xs'} lang={'en'} x={'436px'} y={'60px'} width={'52px'} tabIndex={'10'} color={'#000080'} disableClear={true} align={'left'} locked={true} data={this.state.data?.departure_port_code} maxlength={5}/>
                        <Input jsxId={'arrival_port_name'} field={'arrival_port_name'} absolute={true} size={'xs'} lang={'en'} x={'332px'} y={'88px'} width={'96px'} tabIndex={'11'} color={'#000080'} disableClear={true} align={'left'} locked={true} data={this.state.data?.arrival_port_name} maxlength={50}/>
                        <Label jsxId={'Label633'} sm={true} absolute={true} x={'260px'} y={'88px'} width={'68px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'Arrival'}/>
                        <Input jsxId={'departure_port_name'} field={'departure_port_name'} absolute={true} size={'xs'} lang={'en'} x={'332px'} y={'60px'} width={'96px'} tabIndex={'12'} color={'#000080'} disableClear={true} align={'left'} locked={true} data={this.state.data?.departure_port_name} maxlength={50}/>
                        <Label jsxId={'Label635'} sm={true} absolute={true} x={'260px'} y={'60px'} width={'68px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'Departure'}/>
                        <Input jsxId={'icao_airline_code'} field={'icao_airline_code'} absolute={true} size={'xs'} lang={'en'} x={'176px'} y={'88px'} width={'48px'} tabIndex={'13'} color={'#000080'} disableClear={true} align={'center'} locked={true} data={this.state.data?.icao_airline_code} maxlength={3}/>
                        <Label jsxId={'Label703'} sm={true} absolute={true} x={'128px'} y={'88px'} width={'40px'} height={'19px'} align={'center'} color={'rgb(0,0,0)'} text={'ICAO'}/>
                        <Input jsxId={'departure_date'} field={'departure_date'} absolute={true} size={'xs'} lang={'en'} x={'496px'} y={'60px'} width={'100px'} tabIndex={'14'} color={'#000080'} disableClear={true} align={'center'} locked={true} calendar={{format:'MM/DD/YYYY'}} data={this.state.data?.departure_date}/>
                        <Input jsxId={'arrival_date'} field={'arrival_date'} absolute={true} size={'xs'} lang={'en'} x={'496px'} y={'88px'} width={'100px'} tabIndex={'15'} color={'#000080'} disableClear={true} align={'center'} locked={true} calendar={{format:'MM/DD/YYYY'}} data={this.state.data?.arrival_date}/>
                        <Input jsxId={'manifest_quantity'} field={'manifest_quantity'} absolute={true} size={'xs'} lang={'en'} x={'696px'} y={'88px'} width={'52px'} tabIndex={'16'} color={'#000080'} disableClear={true} align={'center'} locked={true} data={this.state.data?.manifest_quantity}/>
                        <Label jsxId={'Label670'} sm={true} absolute={true} x={'632px'} y={'88px'} width={'60px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'Package'}/>
                    </TabsContent>
                    <TabsContent jsxId={'MasterInbond'} id={'MasterInbond'} text={'Master Inbond'}>
                        <Box jsxId={'Box659'} absolute={true} x={'20px'} y={'137px'} width={'340px'} height={'168px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'inbond_auth_date'} field={'inbond_auth_date'} absolute={true} size={'xs'} lang={'en'} x={'152px'} y={'343px'} width={'116px'} tabIndex={'0'} color={'#000080'} disableClear={true} align={'center'} locked={true} calendar={{format:'YYYY-MM-DD HH:mm'}} data={this.state.data?.inbond_auth_date}/>
                        <Input jsxId={'inbond_arrival_date'} field={'inbond_arrival_date'} absolute={true} size={'xs'} lang={'en'} x={'520px'} y={'156px'} width={'124px'} tabIndex={'1'} color={'#000080'} disableClear={true} align={'center'} locked={true} calendar={{format:'YYYY-MM-DD HH:mm'}} data={this.state.data?.inbond_arrival_date}/>
                        <Label jsxId={'Label731'} sm={true} absolute={true} x={'392px'} y={'156px'} width={'124px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'I.T. Arrival Date'}/>
                        <Input jsxId={'inbond_number'} field={'inbond_number'} absolute={true} size={'xs'} lang={'en'} x={'152px'} y={'190px'} width={'116px'} tabIndex={'2'} color={'#000080'} disableClear={true} align={'left'} locked={true} data={this.state.data?.inbond_number} maxlength={12}/>
                        <Label jsxId={'Label742'} sm={true} absolute={true} x={'40px'} y={'190px'} width={'104px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'I.T. Number'}/>
                        <Input jsxId={'inbond_origin_port_name'} field={'inbond_origin_port_name'} absolute={true} size={'xs'} lang={'en'} x={'152px'} y={'223px'} width={'116px'} tabIndex={'3'} color={'#000080'} disableClear={true} align={'left'} locked={true} data={this.state.data?.inbond_origin_port_name} maxlength={50}/>
                        <Label jsxId={'Label744'} sm={true} absolute={true} x={'40px'} y={'223px'} width={'104px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'I.T. Origin'}/>
                        <Input jsxId={'inbond_dest_port_name'} field={'inbond_dest_port_name'} absolute={true} size={'xs'} lang={'en'} x={'152px'} y={'257px'} width={'116px'} tabIndex={'4'} color={'#000080'} disableClear={true} align={'left'} locked={true} data={this.state.data?.inbond_dest_port_name} maxlength={50}/>
                        <Label jsxId={'Label746'} sm={true} absolute={true} x={'40px'} y={'257px'} width={'104px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'Destination City'}/>
                        <Input jsxId={'inbond_type'} field={'inbond_type'} absolute={true} size={'xs'} lang={'en'} x={'152px'} y={'156px'} width={'48px'} tabIndex={'5'} color={'#000080'} disableClear={true} align={'center'} locked={true} data={this.state.data?.inbond_type} maxlength={2}/>
                        <Label jsxId={'Label749'} sm={true} absolute={true} x={'40px'} y={'156px'} width={'104px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'I.T. Type Code'}/>
                        <Label jsxId={'Label761'} sm={true} absolute={true} x={'20px'} y={'118px'} width={'340px'} height={'19px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'I.T. Type - No. - Authorized Date'}/>
                        <Input jsxId={'inbond_origin_code'} field={'inbond_origin_code'} absolute={true} size={'xs'} lang={'en'} x={'276px'} y={'223px'} width={'60px'} tabIndex={'6'} color={'#000080'} disableClear={true} align={'left'} locked={true} data={this.state.data?.inbond_origin_code} maxlength={4}/>
                        <Input jsxId={'inbond_dest_code'} field={'inbond_dest_code'} absolute={true} size={'xs'} lang={'en'} x={'276px'} y={'257px'} width={'60px'} tabIndex={'7'} color={'#000080'} disableClear={true} align={'left'} locked={true} data={this.state.data?.inbond_dest_code} maxlength={4}/>
                        <Label jsxId={'Label781'} sm={true} absolute={true} x={'360px'} y={'118px'} width={'324px'} height={'19px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'I.T. City - Schedule D Number'}/>
                        <Box jsxId={'Box782'} absolute={true} x={'359px'} y={'136px'} width={'325px'} height={'92px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Label jsxId={'Label784'} sm={true} absolute={true} x={'40px'} y={'343px'} width={'104px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'Authorized - 1J'}/>
                        <Input jsxId={'ptt_auth_date'} field={'ptt_auth_date'} absolute={true} size={'xs'} lang={'en'} x={'520px'} y={'343px'} width={'124px'} tabIndex={'8'} color={'#000080'} disableClear={true} align={'center'} locked={true} calendar={{format:'YYYY-MM-DD'}} data={this.state.data?.ptt_auth_date}/>
                        <Label jsxId={'Label660'} sm={true} absolute={true} x={'392px'} y={'343px'} width={'124px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'Authorized - 1W'}/>
                        <Input jsxId={'it_complete_date'} field={'it_complete_date'} absolute={true} size={'xs'} lang={'en'} x={'520px'} y={'190px'} width={'124px'} tabIndex={'9'} color={'#000080'} disableClear={true} align={'center'} locked={true} calendar={{format:'YYYY-MM-DD'}} data={this.state.data?.it_complete_date}/>
                        <Label jsxId={'Label661'} sm={true} absolute={true} x={'392px'} y={'190px'} width={'124px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'I.T. Complete Date'}/>
                        <Input jsxId={'inbond_export_date'} field={'inbond_export_date'} absolute={true} size={'xs'} lang={'en'} x={'520px'} y={'266px'} width={'124px'} tabIndex={'10'} color={'#000080'} disableClear={true} align={'center'} locked={true} calendar={{format:'YYYY-MM-DD'}} data={this.state.data?.inbond_export_date}/>
                        <Label jsxId={'Label662'} sm={true} absolute={true} x={'392px'} y={'266px'} width={'124px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'Export Date'}/>
                        <Label jsxId={'Label663'} sm={true} absolute={true} x={'360px'} y={'228px'} width={'324px'} height={'19px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'IE - Immediate Export / TE - Tranport & Export'}/>
                        <Label jsxId={'Label664'} sm={true} absolute={true} x={'360px'} y={'305px'} width={'324px'} height={'19px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'PTT - Permit to Transfer'}/>
                        <Label jsxId={'Label665'} sm={true} absolute={true} x={'20px'} y={'305px'} width={'340px'} height={'19px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'I.T. Type - No. - Authorized Date'}/>
                        <Box jsxId={'Box666'} absolute={true} x={'20px'} y={'323px'} width={'340px'} height={'58px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Box jsxId={'Box667'} absolute={true} x={'359px'} y={'247px'} width={'325px'} height={'57px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Box jsxId={'Box668'} absolute={true} x={'359px'} y={'323px'} width={'325px'} height={'58px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'request_count'} field={'request_count'} absolute={true} size={'xs'} lang={'en'} x={'424px'} y={'37px'} width={'48px'} tabIndex={'11'} color={'#000080'} disableClear={true} align={'center'} locked={true} data={this.state.data?.request_count}/>
                        <Label jsxId={'Label720'} sm={true} absolute={true} x={'288px'} y={'37px'} width={'132px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'Fetch Count - Unit'}/>
                        <Input jsxId={'group_code'} field={'group_code'} absolute={true} size={'xs'} lang={'en'} x={'100px'} y={'37px'} width={'88px'} tabIndex={'12'} color={'#000080'} disableClear={true} align={'left'} locked={true} data={this.state.data?.group_code} maxlength={8}/>
                        <Label jsxId={'lbl_SalesTypeSONo'} sm={true} absolute={true} x={'44px'} y={'37px'} width={'48px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'Group'}/>
                        <Input jsxId={'branch_code'} field={'branch_code'} absolute={true} size={'xs'} lang={'en'} x={'196px'} y={'37px'} width={'52px'} tabIndex={'13'} color={'#000080'} disableClear={true} align={'center'} locked={true} data={this.state.data?.branch_code} maxlength={3}/>
                        <Input jsxId={'file_doc_number'} field={'file_doc_number'} absolute={true} size={'xs'} lang={'en'} x={'100px'} y={'66px'} width={'148px'} tabIndex={'14'} color={'#000080'} disableClear={true} align={'left'} locked={true} data={this.state.data?.file_doc_number} maxlength={25}/>
                        <Label jsxId={'lbl_oeb_contact'} sm={true} absolute={true} x={'44px'} y={'66px'} width={'48px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'File No.'}/>
                        <Box jsxId={'Box646'} absolute={true} x={'24px'} y={'22px'} width={'244px'} height={'81px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Box jsxId={'Box647'} absolute={true} x={'267px'} y={'22px'} width={'329px'} height={'81px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'last_request_date'} field={'last_request_date'} absolute={true} size={'xs'} lang={'en'} x={'424px'} y={'66px'} width={'143px'} tabIndex={'15'} color={'#000080'} disableClear={true} align={'center'} locked={true} calendar={{format:'YYYY-MM-DD HH:mm:ss'}} data={this.state.data?.last_request_date}/>
                        <Label jsxId={'Label658'} sm={true} absolute={true} x={'288px'} y={'66px'} width={'132px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'Last Fetch Date'}/>
                        <Input jsxId={'quantity_unit'} field={'quantity_unit'} absolute={true} size={'xs'} lang={'en'} x={'480px'} y={'37px'} width={'52px'} tabIndex={'16'} color={'#000080'} disableClear={true} align={'center'} locked={true} data={this.state.data?.quantity_unit} maxlength={5}/>
                        <Label jsxId={'Label677'} sm={true} absolute={true} x={'20px'} y={'382px'} width={'340px'} height={'19px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Created By - Date'}/>
                        <Box jsxId={'Box678'} absolute={true} x={'20px'} y={'401px'} width={'340px'} height={'57px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Label jsxId={'Label679'} sm={true} absolute={true} x={'359px'} y={'382px'} width={'325px'} height={'19px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Modified By - Date'}/>
                        <Box jsxId={'Box680'} absolute={true} x={'360px'} y={'401px'} width={'324px'} height={'57px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'created_date'} field={'created_date'} absolute={true} size={'xs'} lang={'en'} x={'244px'} y={'416px'} width={'96px'} tabIndex={'17'} color={'#000080'} disableClear={true} align={'center'} locked={true} calendar={{format:'YYYY-MM-DD'}} data={this.state.data?.created_date}/>
                        <Label jsxId={'Label682'} sm={true} absolute={true} x={'40px'} y={'416px'} width={'104px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'Created By '}/>
                        <Input jsxId={'created_by_code'} field={'created_by_code'} absolute={true} size={'xs'} lang={'en'} x={'152px'} y={'416px'} width={'84px'} tabIndex={'18'} color={'#000080'} disableClear={true} align={'center'} locked={true} data={this.state.data?.created_by_code} maxlength={20}/>
                        <Input jsxId={'Text685'} field={'created_date'} absolute={true} size={'xs'} lang={'en'} x={'564px'} y={'416px'} width={'96px'} tabIndex={'19'} color={'#000080'} disableClear={true} align={'center'} locked={true} calendar={{format:'YYYY-MM-DD'}} data={this.state.data?.created_date}/>
                        <Label jsxId={'Label686'} sm={true} absolute={true} x={'380px'} y={'416px'} width={'84px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'Modified By'}/>
                        <Input jsxId={'modified_by_code'} field={'modified_by_code'} absolute={true} size={'xs'} lang={'en'} x={'472px'} y={'416px'} width={'84px'} tabIndex={'20'} color={'#000080'} disableClear={true} align={'center'} locked={true} data={this.state.data?.modified_by_code} maxlength={20}/>
                    </TabsContent>
                    <TabsContent jsxId={'HouseList'} id={'HouseList'} text={'House Summary'}>
                        <CTable jsxId={'sub_abia_master_list_3_hbl_summary'} absolute={true} x={'16px'} y={'46px'} width={'800px'} height={'264px'} scroll={true} headerTheme={'primary'} hover={true} select={false} sm={true} fontSm={true} source={'v_abia_master_list_hbl_summary'} data={this.state.tab_sub_abia_master_list_3_hbl_summary_data} ref={c=>this.sub_abia_master_list_3_hbl_summary=c} page={this.state.tab_sub_abia_master_list_3_hbl_summary_page} dataCount={this.state.tab_sub_abia_master_list_3_hbl_summary_count} onSelectPage={this.getTableData('sub_abia_master_list_3_hbl_summary','v_abia_master_list_hbl_summary',null)} showNumbers={50} onFilter={this.filterHandler('sub_abia_master_list_3_hbl_summary')} onSort={this.sortHandler('sub_abia_master_list_3_hbl_summary')} total={this.state.tab_sub_abia_master_list_3_hbl_summary_total} totalFields={'manifest_quantity'.split(',')}>
                            <Table.Header jsxId={'sub_abia_master_list_3_hbl_summary-house_no'} field={'house_no'} text={'House No.'} width={'108px'} align={'left'} color={'#0000ff'} bgColor={'#ffffff'} dataType={'text'} onFormat={val=><u className='print-default'>{val}</u>} onDoubleClick={this.open('','')}/>
                            <Table.Header jsxId={'sub_abia_master_list_3_hbl_summary-manifest_quantity'} field={'manifest_quantity'} text={'Qty'} width={'56px'} align={'center'} color={'#000000'} bgColor={'#ffffff'} dataType={'number'}/>
                            <Table.Header jsxId={'sub_abia_master_list_3_hbl_summary-departure_date'} field={'departure_date'} text={'Departed'} width={'88px'} align={'center'} color={'#000000'} bgColor={'#ffffff'} dataType={'number'} onFormat={val=>val?moment(val).format('MM-DD-YYYY'):''}/>
                            <Table.Header jsxId={'sub_abia_master_list_3_hbl_summary-arrival_date'} field={'arrival_date'} text={'Arrived'} width={'88px'} align={'center'} color={'#000000'} bgColor={'#ffffff'} dataType={'number'} onFormat={val=>val?moment(val).format('MM-DD-YYYY'):''}/>
                            <Table.Header jsxId={'sub_abia_master_list_3_hbl_summary-released_date'} field={'released_date'} text={'Released'} width={'88px'} align={'center'} color={'#000000'} bgColor={'#ffffff'} dataType={'number'} onFormat={val=>val?moment(val).format('MM-DD-YYYY'):''}/>
                            <Table.Header jsxId={'sub_abia_master_list_3_hbl_summary-hold_date'} field={'hold_date'} text={'Hold'} width={'88px'} align={'center'} color={'#000000'} bgColor={'#ffffff'} dataType={'number'} onFormat={val=>val?moment(val).format('MM-DD-YYYY'):''}/>
                            <Table.Header jsxId={'sub_abia_master_list_3_hbl_summary-hold_disposition_code'} field={'hold_disposition_code'} text={'Code'} width={'44px'} align={'center'} color={'#000000'} bgColor={'#ffffff'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_abia_master_list_3_hbl_summary-hold_removed_date'} field={'hold_removed_date'} text={'Hold Remove'} width={'88px'} align={'center'} color={'#000000'} bgColor={'#ffffff'} dataType={'number'} onFormat={val=>val?moment(val).format('MM-DD-YYYY'):''}/>
                            <Table.Header jsxId={'sub_abia_master_list_3_hbl_summary-last_disposition_code'} field={'last_disposition_code'} text={'Code'} width={'44px'} align={'center'} color={'#000000'} bgColor={'#ffffff'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_abia_master_list_3_hbl_summary-last_event_date'} field={'last_event_date'} text={'Last Event'} width={'88px'} align={'center'} color={'#000000'} bgColor={'#ffffff'} dataType={'number'} onFormat={val=>val?moment(val).format('MM-DD-YYYY'):''}/>
                            <Table.Header jsxId={'sub_abia_master_list_3_hbl_summary-disposition_desc'} field={'disposition_desc'} text={'Last Status Desc'} width={'212px'} align={'left'} color={'#000000'} bgColor={'#ffffff'} dataType={'text'}/>
                        </CTable>
                        <Label jsxId={'Label630'} sm={true} absolute={true} x={'20px'} y={'22px'} width={'116px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'House Summary'}/>
                        <CTable jsxId={'sub_abia_master_list_inbond'} absolute={true} x={'16px'} y={'344px'} width={'800px'} height={'183px'} scroll={true} headerTheme={'primary'} hover={true} select={false} sm={true} fontSm={true} source={'v_abio_master_list_2_hbl_summary'} data={this.state.tab_sub_abia_master_list_inbond_data} ref={c=>this.sub_abia_master_list_inbond=c} page={this.state.tab_sub_abia_master_list_inbond_page} dataCount={this.state.tab_sub_abia_master_list_inbond_count} onSelectPage={this.getTableData('sub_abia_master_list_inbond','v_abio_master_list_2_hbl_summary',null)} showNumbers={50} onFilter={this.filterHandler('sub_abia_master_list_inbond')} onSort={this.sortHandler('sub_abia_master_list_inbond')}>
                            <Table.Header jsxId={'sub_abia_master_list_inbond-house_no'} field={'house_no'} text={'House No.'} width={'108px'} align={'left'} color={'#0000ff'} bgColor={'#ffffff'} dataType={'text'} onFormat={val=><u className='print-default'>{val}</u>} onDoubleClick={this.open('','')}/>
                            <Table.Header jsxId={'sub_abia_master_list_inbond-inbond_type'} field={'inbond_type'} text={'Type'} width={'56px'} align={'left'} color={'#080000'} bgColor={'#ffffff'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_abia_master_list_inbond-inbond_number'} field={'inbond_number'} text={'Inbond No.'} width={'88px'} align={'left'} color={'#080000'} bgColor={'#ffffff'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_abia_master_list_inbond-inbond_origin_port_name'} field={'inbond_origin_port_name'} text={'Inbond  Origin'} width={'87px'} align={'left'} color={'#080000'} bgColor={'#ffffff'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_abia_master_list_inbond-inbond_dest_port_name'} field={'inbond_dest_port_name'} text={'Inbond Dest'} width={'87px'} align={'left'} color={'#080000'} bgColor={'#ffffff'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_abia_master_list_inbond-inbond_auth_date'} field={'inbond_auth_date'} text={'Authorized'} width={'87px'} align={'center'} color={'#080000'} bgColor={'#ffffff'} dataType={'number'} onFormat={val=>val?moment(val).format('MM-DD-YYYY'):''}/>
                            <Table.Header jsxId={'sub_abia_master_list_inbond-inbond_arrival_date'} field={'inbond_arrival_date'} text={'Inbond Arrived'} width={'87px'} align={'center'} color={'#080000'} bgColor={'#ffffff'} dataType={'number'} onFormat={val=>val?moment(val).format('MM-DD-YYYY'):''}/>
                            <Table.Header jsxId={'sub_abia_master_list_inbond-inbond_export_date'} field={'inbond_export_date'} text={'Export Date'} width={'87px'} align={'center'} color={'#080000'} bgColor={'#ffffff'} dataType={'number'} onFormat={val=>val?moment(val).format('MM-DD-YYYY'):''}/>
                            <Table.Header jsxId={'sub_abia_master_list_inbond-it_complete_date'} field={'it_complete_date'} text={'I.T. Complete'} width={'87px'} align={'center'} color={'#080000'} bgColor={'#ffffff'} dataType={'number'} onFormat={val=>val?moment(val).format('MM-DD-YYYY'):''}/>
                        </CTable>
                        <Label jsxId={'Label631'} sm={true} absolute={true} x={'20px'} y={'320px'} width={'132px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'Inbond Summary'}/>
                        <Input jsxId={'last_modified_date'} field={'last_modified_date'} absolute={true} size={'xs'} lang={'en'} x={'668px'} y={'12px'} width={'128px'} tabIndex={'2'} color={'#000080'} disableClear={true} align={'left'} locked={true} calendar={{format:'MM-DD-YYYY HH:mm'}} data={this.state.data?.last_modified_date}/>
                        <Label jsxId={'Label638'} sm={true} absolute={true} x={'548px'} y={'12px'} width={'112px'} height={'19px'} align={'left'} color={'rgb(0,0,0)'} text={'Last Query Date'}/>
                    </TabsContent>
                </Tabs>
                <WModal ref={c=>this.modal=c}/>
            </Form>
        );}
}

export default FAbiaMaster;
