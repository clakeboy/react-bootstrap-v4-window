/*****VERSION*****
* app_version: 1.12.0
* created_date: 2024-10-17 14:12:16
* last_replace_date: -
* replace_date: -
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

var ComboSearch = ()=>{
    return (text,row)=>{
    }
}

class FComGroup extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'f_com_group';
		this.title = 'Company Group Entry';
        if (!this.props.width) {
            this.width = '868px';
        }
        if (!this.props.height) {
            this.height = '496px';
        }
		this.source = 's_com_group';
		this.process = 't_com_group';
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
		this.showHandler()
    }

    showHandler = ()=>{
        this.getData(this.window?.params?.id??'')
    };

    closeHandler = ()=>{
        
    };

	getData = (id) => {
		
    };

	getTableData(name, source) {
        return (page) => {
            this.modal.loading('Loading...');
            GetData(source,page,50, [{
                field:'group_code',
                value:this.state.data.group_code??"",
                flag:'eq'
            }],null,(res)=>{
                this.modal.close();
                if (res.status) {
                    let data = {};
                    data['tab_'+name+'_data'] = res.data.list||[];
                    data['tab_'+name+'_page'] = page;
                    data['tab_'+name+'_count'] = res.data.count;
                    this.setState(data);
                } else {
                    let data = {};
                    data['tab_'+name+'_data'] = [];
                    data['tab_'+name+'_page'] = 1;
                    data['tab_'+name+'_count'] = 0;
                    this.setState(data);
                }
            });
        }
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
        delete data.group_code;
        this.setState({
            data:data,
            isEdit:false,
        })
    };

    saveData = () => {
        this.state.data.Edit = this.state.isEdit;
        ajaxPostModel({
            url:'/Api/Group/SaveGroup',
            loading:this,        
            form:this.id,
            button:'btn0Save',
            data:this.state.data,
            success:(data)=>{
                this.showHandler();                
            }
        });
    };

    deleteData = ()=>{
        ProcessData(this.process,'delete',{'group_code':this.window.params.id},(res)=>{
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
        this.setState({data:data});
    };
	
	sortHandler() {}

	filterHandler() {}

	open(formName,field){
        return (row)=> {
            this.manage.open(formName,{id:row[field]});
        }
    }

    addBranch=()=>{
        if(this.state.isEdit)
        this.manage.open('f_com_branch',{group_code:this.state.data.group_code});
    }

    terminate=()=>{
        if(this.state.isEdit){
            ajaxPostUrl({
                url:'/Api/Group/Terminate',
                loading:this,
                data:{id:this.state.data.group_code},
                success:(data)=>{
                    this.showHandler();                    
                }
            });	
        }
    }

    openBranch=(row)=>{
        this.manage.open('f_com_branch',{group_code:this.state.data.group_code,branch_code:row["branch_code"]});
    }

    onProductCheckChanged = (v,row,ctrol)=>{
        console.log(this)
        // let sel = this.sub_com_group_list_branch.getSelectRows();
        
        // ajaxPostUrl({
        //     url:'/Api/Group/AddProducttoBranch',
        //     loading:this,
        //     data:{id:this.state.data.group_code},
        //     success:(data)=>{
        //         this.showHandler();                    
        //     }
        // });	
    }

    

    render() {
        return (
            <Form ref={c=>this.form=c} onChange={this.fieldChangeHandler}>
                <Box jsxId={'Boxheadline'} absolute={true} x={'0px'} y={'0px'} width={'808px'} height={'24px'} backColor={'rgb(53,88,117)'} borderColor={'rgb(0,0,0)'} borderWidth={'1px'}/>
                <Label jsxId={'group_seq_id'} sm={true} absolute={true} x={'80px'} y={'4px'} width={'52px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} field={'group_seq_id'} text={this.state.data?.group_seq_id}/>
                <Label jsxId={'lbl_efc_branch_id'} sm={true} absolute={true} x={'16px'} y={'4px'} width={'60px'} height={'20px'} align={'left'} color={'rgb(255,255,255)'} text={'Seq No'}/>
                <Button jsxId={'btn0Save'} absolute={true} size={'xs'} x={'836px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'save'} onClick={this.saveData} theme={'success'} tip={'Save'}>
                    
                </Button>
                <Input jsxId={'status_id'} field={{key:'status_id',text_key:'status_desc',combo_key:'status_id'}} size={'xs'} absolute={true} x={'272px'} y={'0px'} width={'96px'} align={'left'} combo={{
                    onSearch:ComboSearch('status_desc','q_com_tb_status'),
                    searchColumn:'status_desc',
                    width:'144px',
                    header:false,
                    filterColumns:[
                        {field:'status_desc',width:'96px'},
                        {field:'status_id',width:'48px'}
                    ]
                }} data={this.state.data?.status_id}/>
                <Label jsxId={'Label263'} sm={true} absolute={true} x={'216px'} y={'0px'} width={'48px'} height={'20px'} align={'left'} color={'rgb(255,255,255)'} text={'Status'}/>
                <Button jsxId={'btn0Reload'} absolute={true} size={'xs'} x={'808px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'sync-alt'} onClick={this.showHandler} theme={'success'} tip={'Refresh'}>
                    
                </Button>
                <Tabs jsxId={'TabCtl274'} sm={true} border={true} absolute={true} x={'0px'} y={'24px'} width={'868px'} height={'472px'}>
                    <TabsContent jsxId={'Group'} id={'Group'} text={'Group'} active={true}>
                        <CTable jsxId={'sub_com_group_list_rev_product'} absolute={true} x={'16px'} y={'173px'} width={'828px'} height={'248px'} scroll={true} headerTheme={'primary'} hover={true} select={false} sm={true} fontSm={true} source={'v_com_group_product'} data={this.state.tab_sub_com_group_list_rev_product_data} ref={c=>this.sub_com_group_list_rev_product=c} page={this.state.tab_sub_com_group_list_rev_product_page} dataCount={this.state.tab_sub_com_group_list_rev_product_count} onSelectPage={this.getTableData('sub_com_group_list_rev_product','v_com_group_product')} showNumbers={50} onFilter={this.filterHandler} onSort={this.sortHandler}>
                            <Table.Header jsxId={'sub_com_group_list_rev_product-branch_code'} field={'branch_code'} text={'Branch'} width={'48px'} align={'left'} dataType={'text'} onFormat={val=><u className='text-primary print-default'>{val}</u>} onDoubleClick={this.openBranch}/>
                            <Table.Header jsxId={'sub_com_group_list_rev_product-product_code'} field={'product_code'} text={'Service'} width={'76px'} align={'left'} dataType={'text'} onFormat={val=><u className='text-primary print-default'>{val}</u>} onDoubleClick={this.open('f_com_service','group_product_id')}/>
                            <Table.Header jsxId={'sub_com_group_list_rev_product-status_id'} field={'status_id'} text={'Status'} width={'48px'} align={'center'} dataType={'number'}/>
                            <Table.Header jsxId={'sub_com_group_list_rev_product-scac_code'} field={'scac_code'} text={'SCAC'} width={'52px'} align={'center'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_com_group_list_rev_product-currency_code'} field={'currency_code'} text={'Currency'} width={'56px'} align={'center'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_com_group_list_rev_product-pricing_code'} field={'pricing_code'} text={'Price Code'} width={'68px'} align={'center'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_com_group_list_rev_product-monthly_mim_fee'} field={'monthly_mim_fee'} text={'Monthly Fee'} width={'84px'} align={'right'} dataType={'number'} onFormat={val=>Intl.NumberFormat('en-US',{minimumFractionDigits:2}).format(val)}/>
                            <Table.Header jsxId={'sub_com_group_list_rev_product-base_rate'} field={'base_rate'} text={'Base Rate'} width={'72px'} align={'right'} dataType={'number'} onFormat={val=>Intl.NumberFormat('en-US',{minimumFractionDigits:2}).format(val)}/>
                            <Table.Header jsxId={'sub_com_group_list_rev_product-setup_fee'} field={'setup_fee'} text={'Setup Fee'} width={'84px'} align={'right'} dataType={'number'} onFormat={val=>Intl.NumberFormat('en-US',{minimumFractionDigits:2}).format(val)}/>
                            <Table.Header jsxId={'sub_com_group_list_rev_product-amend_rate'} field={'amend_rate'} text={'Amend'} width={'60px'} align={'right'} dataType={'number'} onFormat={val=>Intl.NumberFormat('en-US',{minimumFractionDigits:2}).format(val)}/>
                            <Table.Header jsxId={'sub_com_group_list_rev_product-eft_branch_code'} field={'eft_branch_code'} text={'EFT Br'} width={'60px'} align={'left'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_com_group_list_rev_product-created_by_code'} field={'created_by_code'} text={'Created'} width={'72px'} align={'left'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_com_group_list_rev_product-created_date'} field={'created_date'} text={'Created Date'} width={'92px'} align={'center'} dataType={'number'} onFormat={val=>val?moment(val).format('YYYY-MM-DD'):''}/>
                            <Table.Header jsxId={'sub_com_group_list_rev_product-modified_by_code'} field={'modified_by_code'} text={'Modified'} width={'72px'} align={'center'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_com_group_list_rev_product-modified_date'} field={'modified_date'} text={'Modified  Date'} width={'92px'} align={'center'} dataType={'number'} onFormat={val=>val?moment(val).format('MM-DD-YYYY'):''}/>
                        </CTable>
                        <Input jsxId={'eft_branch_code'} field={'eft_branch_code'} absolute={true} size={'xs'} lang={'en'} x={'604px'} y={'29px'} width={'48px'} tabIndex={'1'} align={'center'} data={this.state.data?.eft_branch_code} maxlength={3}/>
                        <Label jsxId={'Label253'} sm={true} absolute={true} x={'452px'} y={'29px'} width={'148px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Bill by LAX - SHA - TPE'}/>
                        <Box jsxId={'Box804'} absolute={true} x={'16px'} y={'13px'} width={'416px'} height={'148px'} borderColor={'rgb(83,83,83)'} borderWidth={'1px'}/>
                        <Input jsxId={'group_code'} field={'group_code'} readOnly={true} absolute={true} size={'xs'} lang={'en'} x={'124px'} y={'29px'} width={'100px'} tabIndex={'2'} align={'left'} data={this.state.data?.group_code} maxlength={8}/>
                        <Label jsxId={'lbl_discharge_port_un_code'} sm={true} absolute={true} x={'32px'} y={'29px'} width={'88px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Group Code'}/>
                        <Box jsxId={'Box252'} absolute={true} x={'431px'} y={'13px'} width={'413px'} height={'148px'} borderColor={'rgb(83,83,83)'} borderWidth={'1px'}/>
                        <Input jsxId={'group_name'} field={'group_name'} absolute={true} size={'xs'} lang={'en'} x={'124px'} y={'93px'} width={'288px'} tabIndex={'3'} align={'left'} data={this.state.data?.group_name} maxlength={60}/>
                        <Label jsxId={'Label255'} sm={true} absolute={true} x={'32px'} y={'93px'} width={'84px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Group Name'}/>
                        <Input jsxId={'group_alias'} field={'group_alias'} absolute={true} size={'xs'} lang={'en'} x={'124px'} y={'125px'} width={'288px'} tabIndex={'4'} align={'left'} data={this.state.data?.group_alias} maxlength={60}/>
                        <Label jsxId={'Label257'} sm={true} absolute={true} x={'32px'} y={'125px'} width={'84px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Group Alias'}/>
                        <Input jsxId={'start_date'} field={'start_date'} absolute={true} size={'xs'} lang={'en'} x={'124px'} y={'61px'} width={'100px'} tabIndex={'5'} align={'left'} data={this.state.data?.start_date} maxlength={10}/>
                        <Label jsxId={'Label259'} sm={true} absolute={true} x={'32px'} y={'61px'} width={'84px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Start Date'}/>
                        <Input jsxId={'entity_type_code'} field={{key:'entity_type_code',text_key:'entity_type_desc',combo_key:'entity_type_code'}} size={'xs'} absolute={true} x={'328px'} y={'29px'} width={'84px'} align={'left'} combo={{
                            onSearch:ComboSearch('entity_type_desc','q_zzs_entity_type'),
                            searchColumn:'entity_type_desc',
                            width:'144px',
                            header:false,
                            filterColumns:[
                                {field:'entity_type_desc',width:'96px'},
                                {field:'entity_type_code',width:'48px'}
                            ]
                        }} data={this.state.data?.entity_type_code}/>
                        <Label jsxId={'Label261'} sm={true} absolute={true} x={'240px'} y={'29px'} width={'76px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Group Type'}/>
                        <Input jsxId={'billing_branch_code'} field={'billing_branch_code'} absolute={true} size={'xs'} lang={'en'} x={'328px'} y={'61px'} width={'84px'} tabIndex={'7'} align={'center'} data={this.state.data?.billing_branch_code} maxlength={4}/>
                        <Label jsxId={'Label265'} sm={true} absolute={true} x={'240px'} y={'61px'} width={'84px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Corp Branch'}/>
                        <CCheckbox jsxId={'combine_branch_billing_sw'} field={'combine_branch_billing_sw'} absolute={true} x={'808px'} y={'101px'} checked={this.state.data?.combine_branch_billing_sw}/>
                        <Label jsxId={'Label1290'} sm={true} absolute={true} x={'668px'} y={'97px'} width={'132px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Billing to one Branch'}/>
                        <CCheckbox jsxId={'combine_product_billing_sw'} field={'combine_product_billing_sw'} absolute={true} x={'808px'} y={'129px'} checked={this.state.data?.combine_product_billing_sw}/>
                        <Label jsxId={'Label267'} sm={true} absolute={true} x={'668px'} y={'125px'} width={'132px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Combine Product'}/>
                        <Input jsxId={'BranchCount'} field={'BranchCount'} absolute={true} size={'xs'} lang={'en'} x={'604px'} y={'61px'} width={'48px'} tabIndex={'10'} align={'center'} readOnly={true} data={this.state.data?.BranchCount}/>
                        <Label jsxId={'Label271'} sm={true} absolute={true} x={'452px'} y={'61px'} width={'148px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Group  Branch Count'}/>
                        <Button jsxId={'btn3AddBranch'} absolute={true} size={'xs'} x={'736px'} y={'29px'} width={'84px'} height={'20px'} outline={true} theme={'dark'} tip={null} onClick={this.addBranch}>
                            Add Branch
                        </Button>
                        <Button jsxId={'btn3Terminate'} absolute={true} size={'xs'} x={'736px'} y={'61px'} width={'84px'} height={'20px'} outline={true} theme={'dark'} tip={null} onClick={this.terminate}>
                            Terminate
                        </Button>
                        <Input jsxId={'efc_group_code'} field={'efc_group_code'} absolute={true} size={'xs'} lang={'en'} x={'528px'} y={'93px'} width={'68px'} tabIndex={'13'} align={'center'} data={this.state.data?.efc_group_code} maxlength={8}/>
                        <Input jsxId={'efc_company_id'} field={'efc_company_id'} absolute={true} size={'xs'} lang={'en'} x={'604px'} y={'93px'} width={'48px'} tabIndex={'14'} align={'center'} data={this.state.data?.efc_company_id}/>
                        <Input jsxId={'top_up_id'} field={'top_up_id'} absolute={true} size={'xs'} lang={'en'} x={'604px'} y={'125px'} width={'48px'} tabIndex={'15'} align={'center'} data={this.state.data?.top_up_id}/>
                        <Label jsxId={'Label286'} sm={true} absolute={true} x={'580px'} y={'125px'} width={'20px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'ID'}/>
                        <Button jsxId={'Command289'} absolute={true} size={'xs'} x={'452px'} y={'93px'} width={'72px'} height={'20px'} outline={true} theme={'dark'} tip={null}>
                            Build- EFC
                        </Button>
                        <Button jsxId={'btn3AddTopUp'} absolute={true} size={'xs'} x={'452px'} y={'125px'} width={'124px'} height={'20px'} outline={true} theme={'dark'} tip={null}>
                            Create   Top Up
                        </Button>
                    </TabsContent>
                    <TabsContent jsxId={'SetupProduct'} id={'SetupProduct'} text={'Setup Product'}>
                        <CTable jsxId={'sub_com_group_list_eft_service'} absolute={true} x={'16px'} y={'13px'} width={'188px'} height={'408px'} scroll={true} headerTheme={'primary'} hover={true} select={true} sm={true} fontSm={true} source={'v_eft_product'} 
                        data={this.state.tab_sub_com_group_list_eft_service_data} ref={c=>this.sub_com_group_list_eft_service=c} 
                        page={this.state.tab_sub_com_group_list_eft_service_page} dataCount={this.state.tab_sub_com_group_list_eft_service_count} 
                        onSelectPage={this.getTableData('sub_com_group_list_eft_service','v_eft_product')} showNumbers={50} onFilter={this.filterHandler} 
                        onSort={this.sortHandler} onCheck={this.onProductCheckChanged}>
                            <Table.Header jsxId={'sub_com_group_list_eft_service-product_code'} field={'product_code'} text={'Service'} width={'72px'} align={'center'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_com_group_list_eft_service-eft_product_id'} field={'eft_product_id'} text={'Seq'} width={'48px'} align={'center'} dataType={'number'}/>
                            <Table.Header jsxId={'sub_com_group_list_eft_service-business_code'} field={'business_code'} text={'Cat Code'} width={'64px'} align={'center'} dataType={'text'}/>
                        </CTable>
                        <CTable jsxId={'sub_com_group_list_branch'} absolute={true} x={'212px'} y={'13px'} width={'636px'} height={'180px'} scroll={true} headerTheme={'primary'} hover={true} select={false} sm={true} fontSm={true} source={'v_com_group_branch'} data={this.state.tab_sub_com_group_list_branch_data} ref={c=>this.sub_com_group_list_branch=c} page={this.state.tab_sub_com_group_list_branch_page} dataCount={this.state.tab_sub_com_group_list_branch_count} onSelectPage={this.getTableData('sub_com_group_list_branch','v_com_group_branch')} showNumbers={50} onFilter={this.filterHandler} onSort={this.sortHandler}>
                            <Table.Header jsxId={'sub_com_group_list_branch-ShowProduct'} field={'ShowProduct'} text={'-'} width={'29px'} align={'center'} dataType={'number'} onFormat={val=><u className='text-primary print-default'>{val}</u>} onDoubleClick={this.open('','')}/>
                            <Table.Header jsxId={'sub_com_group_list_branch-branch_code'} field={'branch_code'} text={'Branch'} width={'48px'} align={'center'} dataType={'text'} onFormat={val=><u className='text-primary print-default'>{val}</u>} onDoubleClick={this.open('f_com_branch','group_branch_id')}/>
                            <Table.Header jsxId={'sub_com_group_list_branch-branch_name'} field={'branch_name'} text={'Branch Name'} width={'172px'} align={'left'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_com_group_list_branch-metro_city'} field={'metro_city'} text={'Metro City'} width={'92px'} align={'left'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_com_group_list_branch-country_code'} field={'country_code'} text={'Country'} width={'52px'} align={'center'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_com_group_list_branch-contact'} field={'contact'} text={'Contact'} width={'92px'} align={'left'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_com_group_list_branch-phone_area'} field={'phone_area'} text={'Area'} width={'48px'} align={'center'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_com_group_list_branch-phone'} field={'phone'} text={'Phone'} width={'92px'} align={'left'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_com_group_list_branch-notify_email'} field={'notify_email'} text={'Notify Email'} width={'144px'} align={'left'} dataType={'number'}/>
                            <Table.Header jsxId={'sub_com_group_list_branch-billing_email'} field={'billing_email'} text={'Billing Email'} width={'144px'} align={'left'} dataType={'number'}/>
                        </CTable>
                        <CTable jsxId={'sub_com_group_list_product'} absolute={true} x={'212px'} y={'205px'} width={'636px'} height={'216px'} scroll={true} headerTheme={'primary'} hover={true} select={false} sm={true} fontSm={true} source={'v_com_group_product'} data={this.state.tab_sub_com_group_list_product_data} ref={c=>this.sub_com_group_list_product=c} page={this.state.tab_sub_com_group_list_product_page} dataCount={this.state.tab_sub_com_group_list_product_count} onSelectPage={this.getTableData('sub_com_group_list_product','v_com_group_product')} showNumbers={50} onFilter={this.filterHandler} onSort={this.sortHandler}>
                            <Table.Header jsxId={'sub_com_group_list_product-product_code'} field={'product_code'} text={'Service'} width={'76px'} align={'left'} dataType={'text'} onFormat={val=><u className='text-primary print-default'>{val}</u>} onDoubleClick={this.open('f_com_service','group_product_id')}/>
                            <Table.Header jsxId={'sub_com_group_list_product-status_id'} field={'status_id'} text={'Status'} width={'48px'} align={'center'} dataType={'number'}/>
                            <Table.Header jsxId={'sub_com_group_list_product-branch_code'} field={'branch_code'} text={'Branch'} width={'48px'} align={'center'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_com_group_list_product-scac_code'} field={'scac_code'} text={'SCAC'} width={'52px'} align={'center'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_com_group_list_product-currency_code'} field={'currency_code'} text={'Currency'} width={'56px'} align={'center'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_com_group_list_product-pricing_code'} field={'pricing_code'} text={'Price Code'} width={'68px'} align={'center'} dataType={'text'}/>
                            <Table.Header jsxId={'sub_com_group_list_product-monthly_mim_fee'} field={'monthly_mim_fee'} text={'Monthly Fee'} width={'84px'} align={'right'} dataType={'number'} onFormat={val=>Intl.NumberFormat('en-US',{minimumFractionDigits:2}).format(val)}/>
                            <Table.Header jsxId={'sub_com_group_list_product-base_rate'} field={'base_rate'} text={'Base Rate'} width={'72px'} align={'right'} dataType={'number'} onFormat={val=>Intl.NumberFormat('en-US',{minimumFractionDigits:2}).format(val)}/>
                            <Table.Header jsxId={'sub_com_group_list_product-setup_fee'} field={'setup_fee'} text={'Setup Fee'} width={'84px'} align={'right'} dataType={'number'} onFormat={val=>Intl.NumberFormat('en-US',{minimumFractionDigits:2}).format(val)}/>
                            <Table.Header jsxId={'sub_com_group_list_product-amend_rate'} field={'amend_rate'} text={'Amend'} width={'60px'} align={'right'} dataType={'number'} onFormat={val=>Intl.NumberFormat('en-US',{minimumFractionDigits:2}).format(val)}/>
                            <Table.Header jsxId={'sub_com_group_list_product-eft_branch_code'} field={'eft_branch_code'} text={'EFT Br'} width={'60px'} align={'left'} dataType={'text'}/>
                        </CTable>
                    </TabsContent>
                </Tabs>
				<WModal ref={c=>this.modal=c}/>
            </Form>
        );
    }
}

export default FComGroup;
