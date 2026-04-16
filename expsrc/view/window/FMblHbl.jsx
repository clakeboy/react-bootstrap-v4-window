/*****VERSION*****
* app_version: 1.33.2
* created_date: 2025-10-24 09:08:44
* last_replace_date: 2026-01-25 09:41:22
* replace_date: 2026-01-30 07:55:14
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
// import {default as WModal} from '../../common/EfcModal'
// import ABICommon from '../../common/ABICommon';
import {GetData,ComboSearch,ProcessData,ajaxPostUrl,ajaxPostModel,ajaxPostFrom} from '../../common/DataService';
class FMblHbl extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'f_mbl_hbl';
		this.title = 'House';
        if (!this.props.width) {
            this.width = '768px';
        }
        if (!this.props.height) {
            this.height = '552px';
        }
		this.source = 's_mbl_oih';
		this.process = 't_mbl_hbl';
		if (this.props.parent instanceof Window) {
            //window 窗体对像
            this.window = this.props.parent;
            //window 管理对像
            this.manage = this.window.parent;
            //传送的窗体参数
            this.params = this.window.params;
        }
        this.window.params=this.window.params||{};

		this.state = {
			data:{},
			isEdit:!!this.window?.params?.id
		};
        if (!this.anFileDom) {
            this.anFileDom = document.createElement("input");
            this.anFileDom.type = 'file';
            this.anFileDom.accept = '.pdf';
            this.anFileDom.addEventListener("change",this.anFileChangeHandler);
        }
        if (!this.ciFileDom) {
            this.ciFileDom = document.createElement("input");
            this.ciFileDom.type = 'file';
            this.ciFileDom.accept = '.pdf,.xlsx,.xls,.docx,.doc';
            this.ciFileDom.addEventListener("change",this.ciFileChangeHandler);
        }
    }
    anFileChangeHandler = (e) => {
        if(this.state.data.abi_entry_id>0){
             let fdata = new FormData();
             for(let i=0;i<e.target.files.length;i++){
                fdata.append('files',e.target.files[i]);
            }
            fdata.append('abi_entry_id',this.state.data.abi_entry_id);
            ajaxPostFrom({
                url:'/Api/OceanHouse/AiReadAN',
                loading:this,
                form:this.id,
                button:'btn3UploadAN',
                data:fdata,
                success:(data)=>{
                    this.showHandler();
                }
            });
        }
       
        this.anFileDom.value='';
    };
    ciFileChangeHandler = (e) => {
        if(this.state.data.abi_entry_id>0){
             let fdata = new FormData();
             for(let i=0;i<e.target.files.length;i++){
                fdata.append('files',e.target.files[i]);
            }
            fdata.append('abi_entry_id',this.state.data.abi_entry_id);
            ajaxPostFrom({
                url:'/Api/OceanHouse/AiReadCI',
                loading:this,
                form:this.id,
                button:'btn3ExcelUploadInput Line',
                data:fdata,
                success:(data)=>{
                    this.showHandler();
                }
            });
        }
       
        this.ciFileDom.value='';
    };

    componentDidMount() {
		if (this.window) {
			this.window.on(Window.EVT_SHOW,this.showHandler);
			this.window.on(Window.EVT_CLOSE,this.closeHandler);
		}
		this.showHandler()
    }

    showHandler = ()=>{
        // this.getData(this.window?.params?.id||0)
    };

    closeHandler = ()=>{
        
    };

	getData = (id) => {
		ajaxPostUrl({
            url:'/Api/OceanHouse/GetHouse',
            loading:this,
            data:{id:id},
            success:(data)=>{
                data.total_weight_kg = ABICommon.numberFormat(data.total_weight_kg);
                data.total_weight_lb = ABICommon.numberFormat(data.total_weight_lb);
                this.CIDisabled = data.ci_hs_complete_sw==true;
                this.setState({
                    data:data,
                    InvoiceLineEditSw:false,
                    EdocEditSw:false,
                    lock:this.setLock(data)
                },()=>{
                    this.order = [];
                    this.filter = [];
                    this.sub_mbl_hbl_1_container_list.props.onSelectPage(1);
                    this.setTab2Subform();
                    
                    this.sub_mbl_hbl_list_part_shipment.props.onSelectPage(1);
                    
                    this.sub_mbl_o_hbl_list_doc.props.onSelectPage(1);
                    
                    this.sub_mbl_hbl_isf_mf_hs_coo_list.props.onSelectPage(1);
                    this.sub_mbl_hbl_multi_mf_list.props.onSelectPage(1);
                    this.sub_mbl_hbl_multi_coo_list.props.onSelectPage(1);

                    
                });
                
            }
        });	
    };
    setLock =(data)=>{
        return  {all:false};
    }
    setCiLine =(type)=>{
        let data = this.state.data;
        data.ciline_type = type;
        this.setState({
            data:data,
            lock:this.setLock(data)
        },()=>{
            this.setTab2Subform();
        });
    }
    setTab2Subform=()=>{
         if(this.showCiSimpleSw()){
            this.sub_mbl_o_hbl_1_ci_line_1_simple.props.onSelectPage(1);
        }else{
            this.sub_mbl_o_hbl_1_ci_line_2_complex.props.onSelectPage(1);
        }
    }
    showCiSimpleSw=()=>{
        if(this.state.data.ciline_type){
            if(this.state.data.ciline_type=="1")return true;
            return false;
        }else{
            return (this.state.data.invoice_count??0)<=1;
        }
    }
	getTableData(name, source,def_order) {
        return (page) => {
            this.modal.loading('Loading...');
            let condition =[{
                    field:'abi_entry_id',
                    value:this.state.data.abi_entry_id,
                    flag:'eq'
                }]

            let order_by = this["order"+name] ?? [];
            GetData(source,page, name=="sub_mbl_o_hbl_1_ci_line_1_simple"||name=="sub_mbl_o_hbl_1_ci_line_2_complex"?200: 50, condition,order_by.length>0?order_by:def_order,(res)=>{
                if(!this.modal)return;
                this.modal.close();
                if (res.status) {
                    let data = {};
                    data['tab_'+name+'_data'] = res.data.list||[];
                    for (let i = 0; i < data['tab_'+name+'_data'] .length; i++) {
                        if(data['tab_'+name+'_data'][i].ci_line_no!=undefined)data['tab_'+name+'_data'][i].ci_line_no=ABICommon.pad(data['tab_'+name+'_data'][i].ci_line_no,3);
                    }
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
    }

	newData = () => {
        this.window.params = {};
        this.getData(0);
    };

	cloneData = ()=>{
        console.log(this.manage)
        this.window.resize(768,552);
        this.window.setTitle('Clone House');
    };

    saveData = (fun) => {
        let data = Object.assign({},this.state.data);
        if(this.showCiSimpleSw()){
            data.invoice_lines = this.sub_mbl_o_hbl_1_ci_line_1_simple.getEditRows();
        }else{
            data.invoice_lines = this.sub_mbl_o_hbl_1_ci_line_2_complex.getEditRows();
        }
       
        if(data.invoice_lines!=null){
            for (let i = 0; i < data.invoice_lines.length; i++) {
                if(!data.invoice_lines[i].hbl_inv_line_auto_id)data.invoice_lines[i].hbl_inv_line_auto_id=0;
            }
        }
        
        data.mbl_hbl_mf_hs_coo_lists = this.sub_mbl_hbl_isf_mf_hs_coo_list.getEditRows();
        if(data.mbl_hbl_mf_hs_coo_lists!=null){
            for (let i = 0; i < data.mbl_hbl_mf_hs_coo_lists.length; i++) {
                if(!data.mbl_hbl_mf_hs_coo_lists[i].mbl_hbl_isf_hs_id)data.mbl_hbl_mf_hs_coo_lists[i].mbl_hbl_isf_hs_id=0;
            }
        }

        data.mbl_hbl_list_multi_mfs = this.sub_mbl_hbl_multi_mf_list.getEditRows();
        if(data.mbl_hbl_list_multi_mfs!=null){
            for (let i = 0; i < data.mbl_hbl_list_multi_mfs.length; i++) {
                if(!data.mbl_hbl_list_multi_mfs[i].abi_multi_mf_id)data.mbl_hbl_list_multi_mfs[i].abi_multi_mf_id=0;
            }
        }

        data.mbl_hbl_list_multi_coos = this.sub_mbl_hbl_multi_coo_list.getEditRows();
        if(data.mbl_hbl_list_multi_coos!=null){
            for (let i = 0; i < data.mbl_hbl_list_multi_coos.length; i++) {
                if(!data.mbl_hbl_list_multi_coos[i].abi_multi_coo_id)data.mbl_hbl_list_multi_coos[i].abi_multi_coo_id=0;
            }
        }
        data.doc_query_general = this.sub_mbl_o_hbl_list_doc.getEditRows();
        if(data.doc_query_general!=null){
            for (let i = 0; i < data.doc_query_general.length; i++) {
                if(!data.doc_query_general[i].doc_id)data.doc_query_general[i].doc_id=0;
            }
        }
        data.container_list = this.sub_mbl_hbl_1_container_list.getEditRows();
        if(data.container_list!=null){
            for (let i = 0; i < data.container_list.length; i++) {
                if(!data.container_list[i].mbl_container_id)data.container_list[i].mbl_container_id=0;
            }
        }
        
        ajaxPostModel({
            url:'/Api/OceanHouse/SaveHouse',
            loading:this,
            data:data,
            success:(data)=>{
                
                this.window.params.id = data.abi_entry_id;
                if(fun instanceof Function)fun();
                this.showHandler();                
            }
        });	
    };

    deleteData = ()=>{
        if ((this.window.params?.id || 0) > 0) {
            this.modal.alert({messageid:1304},(e)=>{
                if(e==1){
                    ajaxPostUrl({
                        url: '/Api/OceanHouse/DeleteHouse',
                        loading: this,
                        form:this.id,
                        button:'btn0Delete',
                        data: { id: this.window.params.id },
                        success: (data) => {
                            this.sortHandler();
                            //this.window.close();
                        }
                    });
                }
            });
        }
    };

    fieldChangeHandler = (field,val,row,type,textField)=>{
        let data = this.state.data;
        console.log(field,val,row,type,textField);
        if (type==='combo') {
            data[field] = row?row[field]??row[textField.combo_key]:val;
            data[textField.key_text] = val;
        } else {
            data[field] = val;
        }
        if(field=="mid_id"){
            data["mid"] = row?row["mid"]??"":"";
        }
        if(field=="country_of_origin"){
            data["country_of_origin_code"] = row?row["country_code"]??"":"";
        }
        if(field=="airline"){
            data["airline_code"]= row?(row["Expr2"]??row["airline_code"])??"":"";
        }
        
        if(field=="loading_port_name"){
            data["loading_port_no"] = row?row["schedule_k_code"]??"":"";
            data["loading_port_code"] = row?row["un_port_code"]??"":"";
        }
        if(field=="discharge_port"){
            data["discharge_port_no"] = row?row["schedule_d_code"]??"":"";
            data["discharge_port_code"] = row?row["un_port_code"]??"":"";
        }
        if(field=="destination_port"){
            data["destination_port_no"] = row?row["schedule_d_code"]??"":"";
            data["destination_port_code"] = row?row["un_port_code"]??"":"";
        }
         if(field=="departure_airport_name"){
            data["departure_airport_code"] = row?row["airport_code"]??"":"";
        }
        if(field=="first_entry_airport_name"){
            data["first_entry_airport_code"] = row?row["airport_code"]??"":"";
            data["discharge_port_no"] = row?row["schedule_d_code"]??"":"";
        }
        if(field=="destination_airport_name"){
            data["destination_airport_code"] = row?row["airport_code"]??"":"";
            //data["destination_port_no"] = row?row["schedule_d_code"]??"":"";
        }
        if(field=="country_name"){
            data["country_of_origin_code"] = row?row["country_code"]??"":"";
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
            }];
            
            this[table].props.onSelectPage(1);
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
            this[table].props.onSelectPage(1);
        }
    }

	open(formName,field,emptyRedirt){
        return (row)=> {
            if((emptyRedirt==false&&row[field])||emptyRedirt!==false){
                this.manage.open(formName,{id:row[field]});
            }
        }
    };

    openMid=(id)=>{
        if(id)
         this.manage.open('f_mid',{id:id,abi_entry_id:this.state.data.abi_entry_id,fun:()=>{
            this.showHandler();
        }});
    }
    buildHblToAbi=()=>{
        if(!this.state.data.entry_number)this.state.data.entry_number="PENDING";
        if(this.state.data.abi_entry_id>0&&this.state.data.entry_number){
            this.saveData(()=>{
                this.manage.open('f_mbl_hbl_temp_create_entry',{id:this.state.data.abi_entry_id,mode_cat_code:this.state.data.mode_cat_code});
            });
        }
    }

    fetchManifest =()=>{
        if(this.state.data.abi_entry_id>0){
            ajaxPostUrl({
                url: '/Api/OceanHouse/FetchManifest',
                loading: this,
                data: {id: this.state.data.abi_entry_id},
                success: (data) => {
                    this.showHandler();
                    this.iTraceClick();
                }
            });
        }
    }
    iTraceClick =(e)=>{
        if(this.state.data.master_bill_no){
            if(this.state.data.mode_cat_code=="O"){
                this.manage.open("f_oem_status",{master_bl_no:this.state.data.master_bill_no,abi_entry_id:this.state.data.abi_entry_id,fun:()=>{this.showHandler();}});
            }else if(this.state.data.mode_cat_code=="A"){
                this.manage.open("f_aem_status",{master_bl_no:this.state.data.master_bill_no,abi_entry_id:this.state.data.abi_entry_id,fun:()=>{this.showHandler();}});
            }
        }
        return false;
    }
    queryIsf =()=>{
        if(this.state.data.abi_entry_id>0){
            ajaxPostUrl({
                url:'/Api/OceanHouse/QueryIsfData',
                loading:this,
                data:{id:this.state.data.abi_entry_id},
                success:(data)=>{
                    this.showHandler();
                }
            });	
        }
    }
    uploadArrivalNotice=()=>{
        ajaxPostUrl({
            url:'/Api/OceanHouse/AiReadANByeDoc',
            loading:this,
            data:{id:this.state.data.abi_entry_id},
            success:(data)=>{
                if(data){
                    this.showHandler();
                }else{
                    this.anFileDom.click();
                }
            }
        });	
    }
    uploadCI=()=>{
        ajaxPostUrl({
            url:'/Api/OceanHouse/AiReadCIByeDoc',
            loading:this,
            data:{id:this.state.data.abi_entry_id},
            success:(data)=>{
                if(data){
                    this.showHandler();
                }else{
                    this.ciFileDom.click();
                }
            }
        });	
    }
    queryContainers =(e)=>{
        if(this.state.data.abi_entry_id){
            this.manage.open("f_mbl_hbl_2_container_query",{condition:[{field:'abi_entry_id',
                    value:this.state.data.abi_entry_id,
                    flag:'eq'}]});
        }
        return false;
    }
    queryHbls =(e)=>{
        if(this.state.data.abi_entry_id){
            this.manage.open("f_mbl_hbl_1_query",{condition:[{field:'abi_entry_id',
                    value:this.state.data.abi_entry_id,
                    flag:'eq'}]});
        }
        return false;
    }
    openIsfHS=()=>{
         if(this.state.data.abi_entry_id){
            this.manage.open("f_mbl_hbl_isf_mf_hs_coo",{condition:[{field:'abi_entry_id',
                    value:this.state.data.abi_entry_id,
                    flag:'eq'}]});
        }
    }
    openMultiInvoice=()=>{
         if(this.state.data.abi_entry_id){
            this.manage.open("f_mbl_hbl_multi_invoice",{condition:[{field:'abi_entry_id',
                    value:this.state.data.abi_entry_id,
                    flag:'eq'}],abi_entry_id:this.state.data.abi_entry_id,fun:()=>{this.showHandler()}});
        }
    }
    openMultiMFR=()=>{
         if(this.state.data.abi_entry_id){
            this.manage.open("f_mbl_hbl_multi_mf",{condition:[{field:'abi_entry_id',
                    value:this.state.data.abi_entry_id,
                    flag:'eq'}],abi_entry_id:this.state.data.abi_entry_id,fun:()=>{this.showHandler()}});
        }
    }
    openMultiSeller=()=>{
         if(this.state.data.abi_entry_id){
            this.manage.open("f_mbl_hbl_multi_seller_consol",{condition:[{field:'abi_entry_id',
                    value:this.state.data.abi_entry_id,
                    flag:'eq'}],abi_entry_id:this.state.data.abi_entry_id,fun:()=>{this.showHandler()}});
        }
    }
    openMultiCoo=()=>{
         if(this.state.data.abi_entry_id){
            this.manage.open("f_mbl_hbl_multi_coo",{condition:[{field:'abi_entry_id',
                    value:this.state.data.abi_entry_id,
                    flag:'eq'}],abi_entry_id:this.state.data.abi_entry_id,fun:()=>{this.showHandler()}});
        }
    }

    openDoc=()=>{
          this.manage.open("f_doc",{abi_entry_id:this.state.data.abi_entry_id,fun:()=>{this.showHandler();}});
    }
    openPdf = (row)=>{
        if(row.extention_type.toUpperCase()=="PDF"){
            var a = document.createElement('a');
            a.href = "/pdf/web/viewer.html?file=/Api/Doc/ShowPdf?doc_id="+row.doc_id;
            a.target = '_blank';  
            a.click();
        }
    }

    applyHsCode=()=>{
        if(this.state.data.abi_entry_id&&this.state.data.HSCode)
        {
            let rows=[];
            if(this.showCiSimpleSw()){
                rows = this.sub_mbl_o_hbl_1_ci_line_1_simple.getSelectRows();
            }else{
                rows = this.sub_mbl_o_hbl_1_ci_line_2_complex.getSelectRows();
            }
            if(rows.length>0)
            {
                let invoiceLineIds=[];
                for (let i = 0; i < rows.length; i++) {
                    invoiceLineIds.push(rows[i].hbl_inv_line_auto_id);
                }
                 ajaxPostModel({
                    url:'/Api/OceanHouse/ApplyHsCode',
                    loading:this,
                    data:{abi_entry_id:this.state.data.abi_entry_id,hs_code:this.state.data.HSCode,invoice_line_ids:invoiceLineIds},
                    success:(data)=>{
                        this.showHandler();                
                    }
                });	
            }
        }
    }

    setInvoiceLineEdit =(editSw)=>{
            this.setState({
                    InvoiceLineEditSw:editSw
                });
    }
    setEdocEdis=(editSw)=>{
        this.setState({
            EdocEditSw:editSw
        });
    }

    deleteInvoiceLine =(row,index)=>{
        this.modal.alert({messageid:1304},(e)=>{
            if(e===1){
                if(row.hbl_inv_line_auto_id>0){
                    ajaxPostUrl({
                        url:'/Api/OceanHouse/DeleteInvoiceLine',
                        loading:this,
                        data:{hbl_inv_line_auto_id:row.hbl_inv_line_auto_id},
                        success:(data)=>{   
                            if(this.showCiSimpleSw()){
                                this.sub_mbl_o_hbl_1_ci_line_1_simple.deleteRow(index); 
                            }else{
                                this.sub_mbl_o_hbl_1_ci_line_2_complex.deleteRow(index); 
                            }              
                        }
                    });	
                }else{            
                    if(this.showCiSimpleSw()){
                        this.sub_mbl_o_hbl_1_ci_line_1_simple.deleteRow(index); 
                    }else{
                        this.sub_mbl_o_hbl_1_ci_line_2_complex.deleteRow(index); 
                    }   
                }
            }
        });
        
    }

    deleteCoo =(row,index)=>{
        this.modal.alert({messageid:1304},(e)=>{
            if(e===1){
                if(row.abi_multi_coo_id>0){
                    ajaxPostUrl({
                        url:'/Api/OceanHouse/DeleteCoo',
                        loading:this,
                        data:{abi_multi_coo_id:row.abi_multi_coo_id},
                        success:(data)=>{   
                                this.sub_mbl_hbl_multi_coo_list.deleteRow(index);           
                        }
                    });	
                }else{         
                    this.sub_mbl_hbl_multi_coo_list.deleteRow(index); 
                }
            }
        });
        
    }
    deleteMMf =(row,index)=>{
        this.modal.alert({messageid:1304},(e)=>{
            if(e===1){
                if(row.abi_multi_mf_id>0){
                    ajaxPostUrl({
                        url:'/Api/OceanHouse/DeleteMMf',
                        loading:this,
                        data:{abi_multi_mf_id:row.abi_multi_mf_id},
                        success:(data)=>{   
                                this.sub_mbl_hbl_multi_mf_list.deleteRow(index);           
                        }
                    });	
                }else{         
                    this.sub_mbl_hbl_multi_mf_list.deleteRow(index); 
                }
            }
        });
        
    }

    deleteMHsCoo =(row,index)=>{
        this.modal.alert({messageid:1304},(e)=>{
            if(e===1){
                if(row.mbl_hbl_isf_hs_id>0){
                    ajaxPostUrl({
                        url:'/Api/OceanHouse/DeleteMHsCoo',
                        loading:this,
                        data:{mbl_hbl_isf_hs_id:row.mbl_hbl_isf_hs_id},
                        success:(data)=>{   
                                this.sub_mbl_hbl_isf_mf_hs_coo_list.deleteRow(index);           
                        }
                    });	
                }else{         
                    this.sub_mbl_hbl_isf_mf_hs_coo_list.deleteRow(index); 
                }
            }
        });
    }
    deleteEdoc =(row,index)=>{
        this.modal.alert({messageid:1304},(e)=>{
            if(e===1){
                if(row.doc_id>0){
                    ajaxPostUrl({
                        url:'/Api/OceanHouse/DeleteEdoc',
                        loading:this,
                        data:{doc_id:row.doc_id},
                        success:(data)=>{   
                            this.sub_mbl_o_hbl_list_doc.deleteRow(index);            
                        }
                    });	
                }else{         
                        this.sub_mbl_o_hbl_list_doc.deleteRow(index); 
                }
            }
        });
        
    }
    deleteContainer =(row,index)=>{
        this.modal.alert({messageid:1304},(e)=>{
            if(e==1){
                if(row.mbl_container_id>0){
                    ajaxPostUrl({
                        url:'/Api/OceanHouse/DeleteContainer',
                        loading:this,
                        data:{mbl_container_id:row.mbl_container_id},
                        success:(data)=>{   
                            this.sub_mbl_hbl_1_container_list.deleteRow(index);            
                        }
                    });	
                }else{         
                        this.sub_mbl_hbl_1_container_list.deleteRow(index); 
                }
            }
        })
        
    }
    ACEManifest=()=>{
        if(this.state.data.abi_entry_id){
            ajaxPostUrl({
                url: '/Api/OceanHouse/ViewManifest',
                loading: this,
                data: {id: this.state.data.abi_entry_id},
                success: (data) => {
                    this.manage.open('f_manifest_status',{url:data,abi_entry_id: this.state.data.abi_entry_id,fun:()=>{
                        this.showHandler();
                    }});
                }
            });
        }
    }
    openCvm=(cvmid)=>{
        if(cvmid)
            this.manage.open('f_cvm',{id:cvmid});
    }
    openImporter=(cvmid)=>{
        if(cvmid)
            this.manage.open('f_cvm_importer',{id:cvmid});
    }
    openAbi=()=>{
        if(this.state.data.abi_entry_id&&this.state.data.entry_number){
            this.manage.open('f_abi_entry',{id:this.state.data.abi_entry_id});
            this.window.close();
        }
    }
    openWeightCalculator=()=>{
        if(this.state.data.abi_entry_id){
            this.manage.open('f_mbl_hbl_weight_calculator',{id:this.state.data.abi_entry_id,total_gross_weight:this.state.data.total_gross_weight,total_net_weight:this.state.data.total_net_weight});
        }
    }
    openABIByContainer(){
        return (row)=> {
            if(row["cnru_no"])
            {
                 if(row["mbl_container_id"]){
                    ajaxPostUrl({
                        url: '/Api/OceanHouse/ViewCNRUManifest',
                        loading: this,
                        data: {container_id: row["mbl_container_id"]},
                        success: (data) => {
                            this.manage.open('f_manifest_status',{url:data,mbl_container_id: row["mbl_container_id"],fun:()=>{
                                this.showHandler();
                            }});
                        }
                    });
                }
            }
        }
    };
    openWeightCalculator=()=>{
        if(this.state.data.abi_entry_id){
            this.manage.open('f_mbl_hbl_weight_calculator',{id:this.state.data.abi_entry_id,total_gross_weight:this.state.data.total_gross_weight,total_net_weight:this.state.data.total_net_weight,fun:()=>{
                this.showHandler();
            }});
        }
    }
    openIsf=()=>{
        var a = document.createElement('a');
        a.href = "https://isf.gsf24.com/";
        a.target = '_blank';  
        a.click();
        
    }
    render() {        return (
            <Form ref={c=>this.form=c} onChange={this.fieldChangeHandler}>
                <Tabs jsxId={'TabCtl1055'} sm={true} border={true} absolute={true} x={'0px'} y={'24px'} width={'848px'} height={'544px'}>
                    <TabsContent jsxId={'House'} id={'House'} text={'Shipment'} active={true}>
                        <Input jsxId={'house_no'} field={'house_no'} absolute={true} size={'xs'} lang={'en'} x={'96px'} y={'16px'} width={'168px'} tabIndex={'0'} color={'#000000'} disableClear={true} align={'left'} data={this.state.data?.house_no} maxlength={16}/>
                        <Label jsxId={'Label961'} sm={true} absolute={true} x={'20px'} y={'16px'} width={'76px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'House No.'}/>
                        <Box jsxId={'Box1286'} absolute={true} x={'20px'} y={'192px'} width={'404px'} height={'128px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'entry_number'} field={'entry_number'} absolute={true} size={'xs'} lang={'en'} x={'716px'} y={'124px'} width={'96px'} tabIndex={'1'} color={'#0000ff'} disableClear={true} align={'center'} underline={true} data={this.state.data?.entry_number} maxlength={8} onDblClick={this.openAbi}/>
                        <Button jsxId={'btn3CreateEntrybyHouse'} absolute={true} size={'xs'} x={'764px'} y={'20px'} width={'64px'} height={'40px'} outline={true} theme={'danger'} tip={null} onClick={this.buildHblToAbi}>
                            Create Entry
                        </Button>
                        <Input jsxId={'importer_id'} field={{key:'importer_id',key_text:'importer_short_name',combo_text:'cvm_short_name',combo_key:'cvm_id'}} size={'xs'} absolute={true} x={'120px'} y={'212px'} width={'284px'} align={'left'} combo={{
                            onSearch:ComboSearch('cvm_short_name','q_cvm_im',null),
                            searchColumn:'cvm_short_name',
                            width:'719px',
                            header:false,
                            filterColumns:[
                                {field:'cvm_short_name',width:'211px'},
                                {field:'city',width:'96px'},
                                {field:'sub_division_code',width:'48px'},
                                {field:'entity_type_code',width:'48px'},
                                {field:'entity_type_id',width:'105px'},
                                {field:'company_name',width:'211px'}
                            ]
                        }} data={this.state.data?.importer_short_name} onDblClick={()=>{this.openImporter(this.state.data?.importer_id)}}/>
                        <Label jsxId={'lbl_importer_id'} sm={true} absolute={true} x={'40px'} y={'212px'} width={'72px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Importer'}/>
                        <Input jsxId={'consignee_id'} field={{key:'consignee_id',key_text:'consignee_short_name',combo_text:'cvm_short_name',combo_key:'cvm_id'}} size={'xs'} absolute={true} x={'120px'} y={'244px'} width={'284px'} align={'left'} combo={{
                            onSearch:ComboSearch('cvm_short_name','q_cvm_cn',null),
                            searchColumn:'cvm_short_name',
                            width:'719px',
                            header:false,
                            filterColumns:[
                                {field:'cvm_short_name',width:'211px'},
                                {field:'city',width:'96px'},
                                {field:'sub_division_code',width:'48px'},
                                {field:'entity_type_code',width:'48px'},
                                {field:'entity_type_id',width:'105px'},
                                {field:'company_name',width:'211px'}
                            ]
                        }} data={this.state.data?.consignee_short_name} onDblClick={()=>{this.openCvm(this.state.data?.consignee_id)}}/>
                        <Label jsxId={'Label991'} sm={true} absolute={true} x={'40px'} y={'244px'} width={'72px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Consignee'}/>
                        <Input jsxId={'buyer_id'} field={{key:'buyer_id',key_text:'buyer_short_name',combo_text:'cvm_short_name',combo_key:'cvm_id'}} size={'xs'} absolute={true} x={'120px'} y={'276px'} width={'284px'} align={'left'} combo={{
                            onSearch:ComboSearch('cvm_short_name','q_cvm_cn',null),
                            searchColumn:'cvm_short_name',
                            width:'719px',
                            header:false,
                            filterColumns:[
                                {field:'cvm_short_name',width:'211px'},
                                {field:'city',width:'96px'},
                                {field:'sub_division_code',width:'48px'},
                                {field:'entity_type_code',width:'48px'},
                                {field:'entity_type_id',width:'105px'},
                                {field:'company_name',width:'211px'}
                            ]
                        }} data={this.state.data?.buyer_short_name} onDblClick={()=>{this.openCvm(this.state.data?.buyer_id)}}/>
                        <Label jsxId={'Label1403'} sm={true} absolute={true} x={'40px'} y={'276px'} width={'72px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Buyer'}/>
                        <Input jsxId={'seller_id'} field={{key:'seller_id',key_text:'seller_short_name',combo_text:'cvm_short_name',combo_key:'cvm_id'}} size={'xs'} absolute={true} x={'544px'} y={'212px'} width={'260px'} align={'left'} combo={{
                            onSearch:ComboSearch('cvm_short_name','q_cvm_se',null),
                            searchColumn:'cvm_short_name',
                            width:'566px',
                            header:false,
                            filterColumns:[
                                {field:'cvm_short_name',width:'211px'},
                                {field:'city',width:'96px'},
                                {field:'sub_division_code',width:'48px'},
                                {field:'company_name',width:'211px'}
                            ]
                        }} data={this.state.data?.seller_short_name} onDblClick={()=>{this.openCvm(this.state.data?.seller_id)}}/>
                        <Label jsxId={'Label1401'} sm={true} absolute={true} x={'444px'} y={'212px'} width={'96px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Seller Name'}/>
                        <Input jsxId={'mf_count'} field={'mf_count'} absolute={true} size={'xs'} lang={'en'} x={'544px'} y={'276px'} width={'36px'} tabIndex={'7'} color={'#0000ff'} disableClear={true} align={'center'} underline={true} data={this.state.data?.mf_count}/>
                        <Label jsxId={'Label1422'} sm={true} absolute={true} x={'444px'} y={'276px'} width={'88px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'MFR Count'}/>
                        <Input jsxId={'total_package'} field={'total_package'} absolute={true} size={'xs'} lang={'en'} x={'40px'} y={'452px'} width={'52px'} tabIndex={'8'} color={'#333399'} disableClear={true} align={'center'} data={this.state.data?.total_package}/>
                        <Input jsxId={'total_gross_weight'} field={'total_gross_weight'} absolute={true} size={'xs'} lang={'en'} x={'568px'} y={'452px'} width={'84px'} tabIndex={'9'} color={'#000080'} disableClear={true} align={'center'} data={this.state.data?.total_gross_weight} maxlength={16} onFormat={val=>val?Intl.NumberFormat("en-US",{minimumFractionDigits:2}).format(val):''}/>
                        <TextArea jsxId={'cargo_desc'} field={'cargo_desc'} absolute={true} size={'xs'} lang={'en'} x={'200px'} y={'444px'} width={'208px'} tabIndex={'10'} color={'#000080'} disableClear={true} height={'40px'} data={this.state.data?.cargo_desc} maxlength={250}/>
                        <Box jsxId={'box_01_31'} absolute={true} x={'20px'} y={'432px'} width={'164px'} height={'68px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Label jsxId={'lbl_gross_wgt_kg'} sm={true} absolute={true} x={'424px'} y={'412px'} width={'124px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Net Wgt Kg'}/>
                        <Box jsxId={'box_01_41'} absolute={true} x={'184px'} y={'432px'} width={'240px'} height={'68px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Box jsxId={'box_01_51'} absolute={true} x={'672px'} y={'432px'} width={'156px'} height={'68px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Label jsxId={'lbl_packing'} sm={true} absolute={true} x={'20px'} y={'412px'} width={'88px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Package'}/>
                        <Label jsxId={'lbl_description'} sm={true} absolute={true} x={'184px'} y={'412px'} width={'240px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Cargo Description'}/>
                        <Input jsxId={'manifest_unit_code'} field={'manifest_unit_code'} absolute={true} size={'xs'} lang={'en'} x={'116px'} y={'452px'} width={'52px'} tabIndex={'11'} color={'#000080'} disableClear={true} align={'center'} data={this.state.data?.manifest_unit_code} maxlength={3}/>
                        <Box jsxId={'Box1536'} absolute={true} x={'424px'} y={'192px'} width={'404px'} height={'128px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'mid_id'} field={{key:'mid_id',key_text:'mf_short_name',combo_text:'mf_short_name',combo_key:'mid_id'}} size={'xs'} absolute={true} x={'544px'} y={'244px'} width={'260px'} align={'left'} combo={{
                            onSearch:ComboSearch('mf_short_name','q_mid_short_name',null),
                            searchColumn:'mf_short_name',
                            width:'739px',
                            header:false,
                            filterColumns:[
                                {field:'mf_short_name',width:'211px'},
                                {field:'mid',width:'144px'},
                                {field:'country_code',width:'48px'},
                                {field:'city',width:'96px'},
                                {field:'mf_name',width:'240px'}
                            ]
                        }} data={this.state.data?.mf_short_name} onDblClick={()=>{this.openMid(this.state.data?.mid_id)}}/>
                        <Label jsxId={'Label1546'} sm={true} absolute={true} x={'444px'} y={'244px'} width={'96px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Manufacturer'}/>
                        <Input jsxId={'mid'} field={'mid'} absolute={true} size={'xs'} lang={'en'} x={'624px'} y={'276px'} width={'180px'} tabIndex={'13'} color={'#0000ff'} disableClear={true} align={'left'} underline={true} locked={true} data={this.state.data?.mid} maxlength={15} onDblClick={()=>{this.openMid(this.state.data?.mid_id)}}/>
                        <Label jsxId={'Label1577'} sm={true} absolute={true} x={'592px'} y={'276px'} width={'28px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'MID'}/>
                        <Button jsxId={'btn3FetchISF'} absolute={true} size={'xs'} x={'444px'} y={'124px'} width={'76px'} height={'24px'} outline={true} theme={'primary'} tip={null} onClick={this.queryIsf}>
                            Fetch ISF
                        </Button>
                        <Button jsxId={'btn3UploadAN'} absolute={true} size={'xs'} x={'612px'} y={'20px'} width={'72px'} height={'40px'} outline={true} theme={'danger'} tip={null} onClick={this.uploadArrivalNotice}>
                            AI Input A/N eDoc
                        </Button>
                        <Button jsxId={'btn3ExcelUploadInput Line'} absolute={true} size={'xs'} x={'688px'} y={'20px'} width={'72px'} height={'40px'} outline={true} theme={'primary'} tip={null} onClick={this.uploadCI} disabled={this.CIDisabled}>
                            AI Input<br/>CI eDoc
                        </Button>
                        <Input jsxId={'master_bill_no'} field={'master_bill_no'} absolute={true} size={'xs'} lang={'en'} x={'96px'} y={'48px'} width={'168px'} tabIndex={'17'} color={'#0000ff'} disableClear={true} align={'left'} underline={true} data={this.state.data?.master_bill_no} maxlength={16} onDblClick={this.openAbi}/>
                        <Label jsxId={'Label1568'} sm={true} absolute={true} x={'20px'} y={'48px'} width={'76px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Master B/L'}/>
                        <Box jsxId={'Box1571'} absolute={true} x={'20px'} y={'108px'} width={'204px'} height={'52px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Box jsxId={'Box1576'} absolute={true} x={'700px'} y={'108px'} width={'128px'} height={'52px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'country_of_origin_code'} field={'country_of_origin_code'} absolute={true} size={'xs'} lang={'en'} x={'216px'} y={'364px'} width={'64px'} tabIndex={'18'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.country_of_origin_code} maxlength={2}/>
                        <Input jsxId={'invoice_no'} field={'invoice_no'} absolute={true} size={'xs'} lang={'en'} x={'444px'} y={'364px'} width={'128px'} tabIndex={'19'} color={'#000000'} disableClear={true} align={'left'} data={this.state.data?.invoice_no} maxlength={35}/>
                        <Input jsxId={'invoice_value'} field={'invoice_value'} absolute={true} size={'xs'} lang={'en'} x={'688px'} y={'364px'} width={'120px'} tabIndex={'20'} color={'#000000'} disableClear={true} align={'right'} data={this.state.data?.invoice_value} onFormat={val=>val?Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(val):''}/>
                        <Box jsxId={'Box1343'} absolute={true} x={'20px'} y={'352px'} width={'164px'} height={'48px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'country_of_origin_count1'} field={'country_of_origin_count'} absolute={true} size={'xs'} lang={'en'} x={'336px'} y={'364px'} width={'60px'} tabIndex={'21'} color={'#0000ff'} disableClear={true} align={'center'} data={this.state.data?.country_of_origin_count}/>
                        <Input jsxId={'country_name'} field={{key:'country_name',key_text:'country_name',combo_text:'country_name',combo_key:'country_name'}} size={'xs'} absolute={true} x={'36px'} y={'364px'} width={'128px'} align={'left'} combo={{
                            onSearch:ComboSearch('country_name','q_zun_country_sel_name',null),
                            searchColumn:'country_name',
                            width:'192px',
                            header:false,
                            filterColumns:[
                                {field:'country_name',width:'144px'},
                                {field:'country_code',width:'48px'}
                            ]
                        }} data={this.state.data?.country_name}/>
                        <Input jsxId={'invoice_count'} field={'invoice_count'} absolute={true} size={'xs'} lang={'en'} x={'612px'} y={'364px'} width={'36px'} tabIndex={'23'} color={'#0000ff'} disableClear={true} align={'center'} data={this.state.data?.invoice_count}/>
                        <Label jsxId={'Label1414'} sm={true} absolute={true} x={'20px'} y={'332px'} width={'164px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Country Origin'}/>
                        <Label jsxId={'Label1539'} sm={true} absolute={true} x={'184px'} y={'332px'} width={'128px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Country Code'}/>
                        <Label jsxId={'Label1388'} sm={true} absolute={true} x={'424px'} y={'332px'} width={'172px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Invoice Number'}/>
                        <Label jsxId={'Label1418'} sm={true} absolute={true} x={'672px'} y={'332px'} width={'156px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Total  Value (USD)'}/>
                        <Label jsxId={'Label1538'} sm={true} absolute={true} x={'596px'} y={'332px'} width={'76px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Inv Count'}/>
                        <Box jsxId={'Box1578'} absolute={true} x={'596px'} y={'352px'} width={'76px'} height={'48px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Box jsxId={'Box1579'} absolute={true} x={'672px'} y={'352px'} width={'156px'} height={'48px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Box jsxId={'Box1580'} absolute={true} x={'424px'} y={'352px'} width={'172px'} height={'48px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Label jsxId={'Label1585'} sm={true} absolute={true} x={'20px'} y={'172px'} width={'404px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Import Entities'}/>
                        <Label jsxId={'Label1586'} sm={true} absolute={true} x={'424px'} y={'172px'} width={'404px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Export  Entities'}/>
                        <Box jsxId={'Box1587'} absolute={true} x={'184px'} y={'352px'} width={'128px'} height={'48px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Box jsxId={'Box1588'} absolute={true} x={'312px'} y={'352px'} width={'112px'} height={'48px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Label jsxId={'Label1589'} sm={true} absolute={true} x={'312px'} y={'332px'} width={'112px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'COO Count'}/>
                        <Label jsxId={'Label1592'} sm={true} absolute={true} x={'108px'} y={'412px'} width={'76px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Unit'}/>
                        <Input jsxId={'total_net_weight'} field={'total_net_weight'} absolute={true} size={'xs'} lang={'en'} x={'444px'} y={'452px'} width={'84px'} tabIndex={'24'} color={'#000080'} disableClear={true} align={'center'} data={this.state.data?.total_net_weight} onFormat={val=>val?Intl.NumberFormat("en-US",{minimumFractionDigits:2}).format(val):''}/>
                        <Input jsxId={'customer_ref_no'} field={'customer_ref_no'} absolute={true} size={'xs'} lang={'en'} x={'688px'} y={'452px'} width={'120px'} tabIndex={'25'} color={'#000000'} disableClear={true} align={'left'} data={this.state.data?.customer_ref_no} maxlength={30}/>
                        <Label jsxId={'Label1430'} sm={true} absolute={true} x={'672px'} y={'412px'} width={'156px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Shipment  Ref No.'}/>
                        <Box jsxId={'Box1596'} absolute={true} x={'424px'} y={'108px'} width={'120px'} height={'52px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Label jsxId={'Label1597'} sm={true} absolute={true} x={'424px'} y={'88px'} width={'120px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Build ISF Data'}/>
                        <Button jsxId={'btn1ISFFilingReview'} absolute={true} size={'xs'} x={'556px'} y={'124px'} width={'40px'} height={'24px'} outline={true} theme={'primary'} tip={'ISF Filing'} onClick={this.openIsf}>
                            ISF
                        </Button>
                        <Label jsxId={'Label1725'} sm={true} absolute={true} x={'544px'} y={'88px'} width={'68px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Web Link'}/>
                        <Box jsxId={'Box1726'} absolute={true} x={'544px'} y={'108px'} width={'68px'} height={'52px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Label jsxId={'Label1727'} sm={true} absolute={true} x={'548px'} y={'412px'} width={'124px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Gross Wgt Kg'}/>
                        <Box jsxId={'Box1728'} absolute={true} x={'424px'} y={'432px'} width={'124px'} height={'68px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Box jsxId={'Box1729'} absolute={true} x={'548px'} y={'432px'} width={'124px'} height={'68px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'port_eta_date'} field={'port_eta_date'} absolute={true} size={'xs'} lang={'en'} x={'100px'} y={'124px'} width={'104px'} tabIndex={'27'} color={'#000000'} disableClear={true} align={'center'} calendar={{format:'MM-DD-YYYY'}} data={this.state.data?.port_eta_date}/>
                        <Input jsxId={'destination_port_code'} field={'destination_port_code'} absolute={true} size={'xs'} lang={'en'} x={'240px'} y={'124px'} width={'56px'} tabIndex={'28'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.destination_port_code} maxlength={5}/>
                        <Input jsxId={'discharge_port_code'} field={'discharge_port_code'} absolute={true} size={'xs'} lang={'en'} x={'36px'} y={'124px'} width={'56px'} tabIndex={'29'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.discharge_port_code} maxlength={5}/>
                        <RadioGroup jsxId={'rdo_mode_cat_code'} absolute={true} x={'280px'} y={'16px'} data={this.state.data?.mode_cat_code} onChange={(v)=>this.fieldChangeHandler("mode_cat_code",v)}>
                            <Radio jsxId={'rdo_mode_cat_code_2'} data={'A'} absolute={true} x={'300px'} y={'48px'}/>
                            <Radio jsxId={'rdo_mode_cat_code_1'} data={'O'} absolute={true} x={'336px'} y={'48px'}/>
                            <Radio jsxId={'rdo_mode_cat_code_3'} data={'R'} absolute={true} x={'376px'} y={'48px'}/>
                            <Radio jsxId={'rdo_mode_cat_code_4'} data={'T'} absolute={true} x={'412px'} y={'48px'}/>
                        </RadioGroup>
                        <Label jsxId={'Label1757'} sm={true} absolute={true} x={'292px'} y={'24px'} width={'24px'} height={'20px'} align={'center'} color={'rgb(18,0,0)'} text={'Air'}/>
                        <Label jsxId={'Label1755'} sm={true} absolute={true} x={'320px'} y={'24px'} width={'44px'} height={'20px'} align={'center'} color={'rgb(18,0,0)'} text={'Ocean'}/>
                        <Label jsxId={'Label1766'} sm={true} absolute={true} x={'368px'} y={'24px'} width={'28px'} height={'20px'} align={'center'} color={'rgb(18,0,0)'} text={'Rail'}/>
                        <Label jsxId={'Label1768'} sm={true} absolute={true} x={'400px'} y={'24px'} width={'37px'} height={'20px'} align={'center'} color={'rgb(18,0,0)'} text={'Truck'}/>
                        <Box jsxId={'Box1769'} absolute={true} x={'224px'} y={'108px'} width={'200px'} height={'52px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Label jsxId={'Label1770'} sm={true} absolute={true} x={'224px'} y={'88px'} width={'200px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Destination Port - ETA'}/>
                        <Input jsxId={'destination_eta_date'} field={'destination_eta_date'} absolute={true} size={'xs'} lang={'en'} x={'304px'} y={'124px'} width={'104px'} tabIndex={'31'} color={'#000000'} disableClear={true} align={'center'} calendar={{format:'MM-DD-YYYY'}} data={this.state.data?.destination_eta_date}/>
                        <Label jsxId={'Label1740'} sm={true} absolute={true} x={'20px'} y={'88px'} width={'204px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'First Entry Port - ETA'}/>
                        <Button jsxId={'btn1GoToEntry'} absolute={true} size={'xs'} x={'700px'} y={'88px'} width={'128px'} height={'20px'} outline={true} theme={'primary'} tip={null} onClick={this.openAbi}>
                            -&gt; Entry Number
                        </Button>
                        <Box jsxId={'Box1807'} absolute={true} x={'280px'} y={'16px'} width={'168px'} height={'56px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'Text1832'} field={'house_count'} absolute={true} size={'xs'} lang={'en'} x={'632px'} y={'124px'} width={'44px'} tabIndex={'33'} color={'#0000ff'} disableClear={true} align={'center'} underline={true} data={this.state.data?.house_count}/>
                        <Label jsxId={'Label1834'} sm={true} absolute={true} x={'612px'} y={'88px'} width={'88px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Multi-House'}/>
                        <Box jsxId={'Box1835'} absolute={true} x={'612px'} y={'108px'} width={'88px'} height={'52px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                    </TabsContent>
                    <TabsContent jsxId={'Manifest'} id={'Manifest'} text={'Ocean Manifest'}>
                        <Box jsxId={'Box914'} absolute={true} x={'20px'} y={'52px'} width={'412px'} height={'84px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'export_date'} field={'export_date'} absolute={true} size={'xs'} lang={'en'} x={'308px'} y={'152px'} width={'104px'} tabIndex={'0'} color={'#000000'} disableClear={true} align={'center'} calendar={{format:'MM-DD-YYYY'}} data={this.state.data?.export_date}/>
                        <Label jsxId={'Label1556'} sm={true} absolute={true} x={'260px'} y={'152px'} width={'44px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Export'}/>
                        <Input jsxId={'port_eta_date-1'} field={'port_eta_date'} absolute={true} size={'xs'} lang={'en'} x={'308px'} y={'184px'} width={'104px'} tabIndex={'1'} color={'#000000'} disableClear={true} align={'center'} calendar={{format:'MM-DD-YYYY'}} data={this.state.data?.port_eta_date}/>
                        <Label jsxId={'Label1557'} sm={true} absolute={true} x={'260px'} y={'184px'} width={'40px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Date'}/>
                        <Box jsxId={'Box1186'} absolute={true} x={'20px'} y={'136px'} width={'412px'} height={'120px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'master_bill_no-1'} field={'master_bill_no'} absolute={true} size={'xs'} lang={'en'} x={'120px'} y={'16px'} width={'164px'} tabIndex={'2'} color={'#000000'} disableClear={true} align={'left'} locked={true} data={this.state.data?.master_bill_no} maxlength={16}/>
                        <Label jsxId={'lbl_master_bl_no'} sm={true} absolute={true} x={'28px'} y={'16px'} width={'84px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Master B/L'}/>
                        <CTable jsxId={'sub_mbl_hbl_1_container_list'} absolute={true} x={'20px'} y={'324px'} width={'808px'} height={'176px'} scroll={true} headerTheme={'primary'} hover={true} select={false} sm={true} fontSm={true} source={'v_mbl_hbl_container_list'} data={this.state.tab_sub_mbl_hbl_1_container_list_data} ref={c=>this.sub_mbl_hbl_1_container_list=c} page={this.state.tab_sub_mbl_hbl_1_container_list_page} dataCount={this.state.tab_sub_mbl_hbl_1_container_list_count} onSelectPage={this.getTableData('sub_mbl_hbl_1_container_list','v_mbl_hbl_container_list',null)} showNumbers={50} edit={true} onFilter={this.filterHandler('sub_mbl_hbl_1_container_list')} onSort={this.sortHandler('sub_mbl_hbl_1_container_list')} onDelete={this.deleteContainer}>
                            <Table.Header jsxId={'sub_mbl_hbl_1_container_list-container_no'} field={'container_no'} text={'Container No.'} width={'116px'} align={'left'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_hbl_1_container_list-container_package'} field={'container_package'} text={'Piece / Pkg'} width={'68px'} align={'center'} color={'#000000'} dataType={'number'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_hbl_1_container_list-container_type'} field={'container_type'} text={'Type'} width={'64px'} align={'center'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_hbl_1_container_list-cnru_no'} field={'cnru_no'} text={'CNRU / CPRS No.'} width={'148px'} align={'left'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_hbl_1_container_list-container_it_no'} field={'container_it_no'} text={'I.T  No.'} width={'112px'} align={'left'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_hbl_1_container_list-Query'} field={'Query'} text={'MFST'} width={'48px'} align={'center'} color={'#99cc00'} dataType={'number'} onFormat={val=><u className='print-default'>Query</u>} onDoubleClick={this.openABIByContainer()} foot={false} type={''} noReplace={"onDoubleClick,disabled,dataType,onFormat"} disabled={true}/>
                            <Table.Header jsxId={'sub_mbl_hbl_1_container_list-port_entry_date'} field={'port_entry_date'} text={'Conv Arrival'} width={'85px'} align={'left'} color={'#000000'} dataType={'number'} onFormat={val=>val?moment(val).format('MM-DD-YYYY'):''} foot={false} type={'calendar'}/>
                            <Table.Header jsxId={'sub_mbl_hbl_1_container_list-it_arrival_date'} field={'it_arrival_date'} text={'I.T. Arrival'} width={'85px'} align={'left'} color={'#000000'} dataType={'number'} onFormat={val=>val?moment(val).format('MM-DD-YYYY'):''} foot={false} type={'calendar'}/>
                            <Table.Header jsxId={'sub_mbl_hbl_1_container_list-port_entry_sched_D_no'} field={'port_entry_sched_D_no'} text={'Port No.'} width={'72px'} align={'center'} color={'#000000'} dataType={'number'} foot={false} type={''}/>
                        </CTable>
                        <Box jsxId={'Box1549'} absolute={true} x={'592px'} y={'52px'} width={'236px'} height={'84px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <RadioGroup jsxId={'rdo_load_type'} field='load_type' absolute={true} x={'444px'} y={'96px'} data={this.state.data?.load_type}>
                            <Radio jsxId={'rdo_load_type_1'} data={'F'} absolute={true} x={'496px'} y={'108px'}/>
                            <Radio jsxId={'rdo_load_type_2'} data={'L'} absolute={true} x={'560px'} y={'108px'}/>
                        </RadioGroup>
                        <Label jsxId={'Label295'} sm={true} absolute={true} x={'456px'} y={'104px'} width={'32px'} height={'20px'} align={'left'} color={'rgb(18,0,0)'} text={'FCL'}/>
                        <Label jsxId={'Label297'} sm={true} absolute={true} x={'520px'} y={'104px'} width={'32px'} height={'20px'} align={'left'} color={'rgb(18,0,0)'} text={'LCL'}/>
                        <CCheckbox jsxId={'cnru_sw'} field={'cnru_sw'} absolute={true} x={'360px'} y={'276px'} checked={this.state.data?.cnru_sw}/>
                        <Label jsxId={'Label1443'} sm={true} absolute={true} x={'276px'} y={'272px'} width={'80px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'CNRU/CPRS'}/>
                        <Input jsxId={'vessel_name'} field={'vessel_name'} absolute={true} size={'xs'} lang={'en'} x={'120px'} y={'100px'} width={'180px'} tabIndex={'6'} color={'#000000'} disableClear={true} align={'left'} data={this.state.data?.vessel_name} maxlength={30}/>
                        <Label jsxId={'Label1432'} sm={true} absolute={true} x={'40px'} y={'100px'} width={'80px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Vssl / Voy'}/>
                        <Input jsxId={'voyage_no'} field={'voyage_no'} absolute={true} size={'xs'} lang={'en'} x={'308px'} y={'100px'} width={'104px'} tabIndex={'7'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.voyage_no} maxlength={20}/>
                        <Input jsxId={'carrier_code'} field={'carrier_code'} absolute={true} size={'xs'} lang={'en'} x={'308px'} y={'68px'} width={'48px'} tabIndex={'8'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.carrier_code} maxlength={4}/>
                        <Label jsxId={'Label1438'} sm={true} absolute={true} x={'40px'} y={'68px'} width={'52px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Carrier'}/>
                        <Input jsxId={'carrier_name'} field={'carrier_name'} absolute={true} size={'xs'} lang={'en'} x={'120px'} y={'68px'} width={'180px'} tabIndex={'9'} color={'#000000'} disableClear={true} align={'left'} data={this.state.data?.carrier_name} maxlength={25}/>
                        <Box jsxId={'Box1515'} absolute={true} x={'432px'} y={'136px'} width={'160px'} height={'120px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'destination_port_no'} field={'destination_port_no'} absolute={true} size={'xs'} lang={'en'} x={'520px'} y={'216px'} width={'52px'} tabIndex={'10'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.destination_port_no} maxlength={4}/>
                        <Input jsxId={'loading_port_no'} field={'loading_port_no'} absolute={true} size={'xs'} lang={'en'} x={'520px'} y={'152px'} width={'52px'} tabIndex={'11'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.loading_port_no} maxlength={5}/>
                        <Input jsxId={'destination_eta_date-1'} field={'destination_eta_date'} absolute={true} size={'xs'} lang={'en'} x={'308px'} y={'216px'} width={'104px'} tabIndex={'12'} color={'#000000'} disableClear={true} align={'center'} calendar={{format:'MM-DD-YYYY'}} data={this.state.data?.destination_eta_date}/>
                        <Label jsxId={'Label1561'} sm={true} absolute={true} x={'260px'} y={'216px'} width={'40px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'ETA'}/>
                        <Input jsxId={'discharge_port_no'} field={'discharge_port_no'} absolute={true} size={'xs'} lang={'en'} x={'520px'} y={'184px'} width={'52px'} tabIndex={'13'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.discharge_port_no} maxlength={4}/>
                        <Button jsxId={'btn3FetchManifestOcean'} absolute={true} size={'xs'} x={'468px'} y={'64px'} width={'88px'} height={'24px'} outline={true} theme={'primary'} tip={null} onClick={this.fetchManifest}>
                            Fetch iTrace
                        </Button>
                        <Button jsxId={'btn3OESBLVessel'} absolute={true} size={'xs'} x={'92px'} y={'68px'} width={'24px'} height={'20px'} outline={true} theme={'primary'} tip={'Check Call Ports - ETD/ETA'}>
                            S
                        </Button>
                        <Input jsxId={'loading_port_name'} field={{key:'loading_port_name',key_text:'loading_port_name',combo_text:'schedule_k_desc',combo_key:'schedule_k_desc'}} size={'xs'} absolute={true} x={'120px'} y={'152px'} width={'132px'} align={'left'} combo={{
                            onSearch:ComboSearch('schedule_k_desc','q_zzs_schedule_k',[{field:'schedule_k_desc',type:'asc'}]),
                            searchColumn:'schedule_k_desc',
                            width:'278px',
                            header:false,
                            filterColumns:[
                                {field:'schedule_k_desc',width:'144px'},
                                {field:'un_port_code',width:'67px'},
                                {field:'schedule_k_code',width:'67px'}
                            ]
                        }} data={this.state.data?.loading_port_name}/>
                        <Label jsxId={'Label982'} sm={true} absolute={true} x={'40px'} y={'152px'} width={'76px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Loading'}/>
                        <Input jsxId={'discharge_port'} field={{key:'discharge_port',key_text:'discharge_port',combo_text:'schedule_d_desc',combo_key:'schedule_d_desc'}} size={'xs'} absolute={true} x={'120px'} y={'184px'} width={'132px'} align={'left'} combo={{
                            onSearch:ComboSearch('schedule_d_desc','q_zzs_schedule_d',[{field:'schedule_d_desc',type:'asc'}]),
                            searchColumn:'schedule_d_desc',
                            width:'278px',
                            header:false,
                            filterColumns:[
                                {field:'schedule_d_desc',width:'144px'},
                                {field:'un_port_code',width:'67px'},
                                {field:'schedule_d_code',width:'67px'}
                            ]
                        }} data={this.state.data?.discharge_port}/>
                        <Label jsxId={'Label985'} sm={true} absolute={true} x={'40px'} y={'184px'} width={'76px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'First Entry'}/>
                        <Input jsxId={'destination_port'} field={{key:'destination_port',key_text:'destination_port',combo_text:'schedule_d_desc',combo_key:'schedule_d_desc'}} size={'xs'} absolute={true} x={'120px'} y={'216px'} width={'132px'} align={'left'} combo={{
                            onSearch:ComboSearch('schedule_d_desc','q_zzs_schedule_d',[{field:'schedule_d_desc',type:'asc'}]),
                            searchColumn:'schedule_d_desc',
                            width:'278px',
                            header:false,
                            filterColumns:[
                                {field:'schedule_d_desc',width:'144px'},
                                {field:'un_port_code',width:'67px'},
                                {field:'schedule_d_code',width:'67px'}
                            ]
                        }} data={this.state.data?.destination_port}/>
                        <Label jsxId={'Label1552'} sm={true} absolute={true} x={'40px'} y={'216px'} width={'76px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Process At'}/>
                        <Box jsxId={'Box1641'} absolute={true} x={'20px'} y={'256px'} width={'572px'} height={'56px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'destination_port_code-1'} field={'destination_port_code'} absolute={true} size={'xs'} lang={'en'} x={'452px'} y={'216px'} width={'56px'} tabIndex={'19'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.destination_port_code} maxlength={5}/>
                        <Input jsxId={'loading_port_code'} field={'loading_port_code'} absolute={true} size={'xs'} lang={'en'} x={'452px'} y={'152px'} width={'56px'} tabIndex={'20'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.loading_port_code} maxlength={5}/>
                        <Input jsxId={'discharge_port_code-1'} field={'discharge_port_code'} absolute={true} size={'xs'} lang={'en'} x={'452px'} y={'184px'} width={'56px'} tabIndex={'21'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.discharge_port_code} maxlength={5}/>
                        <Button jsxId={'btn7ABIQuery'} absolute={true} size={'xs'} x={'684px'} y={'12px'} width={'144px'} height={'28px'} outline={true} theme={'success'} tip={null} onClick={this.ACEManifest}>
                            Query Manifest Statue
                        </Button>
                        <CCheckbox jsxId={'clear_at_port_sw'} field={'clear_at_port_sw'} absolute={true} x={'792px'} y={'72px'} checked={this.state.data?.clear_at_port_sw}/>
                        <Label jsxId={'Label1764'} sm={true} absolute={true} x={'700px'} y={'68px'} width={'88px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Clear at Port'}/>
                        <Input jsxId={'it_no'} field={'it_no'} absolute={true} size={'xs'} lang={'en'} x={'692px'} y={'100px'} width={'116px'} tabIndex={'24'} color={'#000080'} disableClear={true} align={'left'} data={this.state.data?.it_no} maxlength={20}/>
                        <Label jsxId={'Label677'} sm={true} absolute={true} x={'608px'} y={'100px'} width={'80px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'I.T. Number'}/>
                        <CCheckbox jsxId={'it_issued_sw'} field={'it_issued_sw'} absolute={true} x={'644px'} y={'72px'} checked={this.state.data?.it_issue_sw}/>
                        <Label jsxId={'Label1775'} sm={true} absolute={true} x={'608px'} y={'68px'} width={'32px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'I.T.'}/>
                        <Input jsxId={'it_city_code'} field={'it_city_code'} absolute={true} size={'xs'} lang={'en'} x={'732px'} y={'184px'} width={'76px'} tabIndex={'26'} color={'#000080'} disableClear={true} align={'center'} locked={true} data={this.state.data?.it_city_code} maxlength={5}/>
                        <Label jsxId={'Label843'} sm={true} absolute={true} x={'612px'} y={'184px'} width={'112px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'From  IT City No.'}/>
                        <Input jsxId={'it_destination_city_code'} field={'it_destination_city_code'} absolute={true} size={'xs'} lang={'en'} x={'732px'} y={'216px'} width={'76px'} tabIndex={'27'} color={'#000080'} disableClear={true} align={'center'} locked={true} data={this.state.data?.it_destination_city_code} maxlength={5}/>
                        <Label jsxId={'Label1782'} sm={true} absolute={true} x={'612px'} y={'216px'} width={'116px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Dest  IT City No.'}/>
                        <Box jsxId={'Box1803'} absolute={true} x={'592px'} y={'136px'} width={'236px'} height={'120px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'it_issue_date'} field={'it_issue_date'} absolute={true} size={'xs'} lang={'en'} x={'692px'} y={'152px'} width={'116px'} tabIndex={'28'} color={'#000000'} disableClear={true} align={'left'} calendar={{format:'YYYY-MM-DD'}} data={this.state.data?.it_issue_date}/>
                        <Label jsxId={'lbl_it_issue_date'} sm={true} absolute={true} x={'612px'} y={'152px'} width={'76px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Issue Date'}/>
                        <Input jsxId={'it_arrival_date'} field={'it_arrival_date'} absolute={true} size={'xs'} lang={'en'} x={'692px'} y={'272px'} width={'116px'} tabIndex={'29'} color={'#000000'} disableClear={true} align={'left'} calendar={{format:'YYYY-MM-DD'}} data={this.state.data?.it_arrival_date}/>
                        <Label jsxId={'Label1784'} sm={true} absolute={true} x={'612px'} y={'272px'} width={'76px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Arrival Date'}/>
                        <Box jsxId={'Box1804'} absolute={true} x={'592px'} y={'256px'} width={'236px'} height={'56px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'canada_discharge_port_code'} field={'canada_discharge_port_code'} absolute={true} size={'xs'} lang={'en'} x={'168px'} y={'272px'} width={'92px'} tabIndex={'30'} color={'#000000'} disableClear={true} align={'left'} data={this.state.data?.canada_discharge_port_code} maxlength={5}/>
                        <Label jsxId={'Label1815'} sm={true} absolute={true} x={'40px'} y={'272px'} width={'124px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Canada Unload at'}/>
                        <Input jsxId={'cnru_count'} field={'house_count'} absolute={true} size={'xs'} lang={'en'} x={'516px'} y={'272px'} width={'56px'} tabIndex={'31'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.house_count}/>
                        <Label jsxId={'Label1816'} sm={true} absolute={true} x={'392px'} y={'272px'} width={'120px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'CNRU/CPRS Count'}/>
                        <Box jsxId={'Box1826'} absolute={true} x={'432px'} y={'52px'} width={'160px'} height={'84px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'rail_carrier_code'} field={'rail_carrier_code'} absolute={true} size={'xs'} lang={'en'} x={'364px'} y={'68px'} width={'48px'} tabIndex={'32'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.rail_carrier_code} maxlength={4}/>
                    </TabsContent>
                    <TabsContent jsxId={'AirManifest'} id={'AirManifest'} text={'Air Manifest'}>
                        <Input jsxId={'airline_code'} field={'airline_code'} absolute={true} size={'xs'} lang={'en'} x={'232px'} y={'48px'} width={'32px'} tabIndex={'0'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.airline_code} maxlength={2}/>
                        <Input jsxId={'airline'} field={{key:'airline',key_text:'airline',combo_text:'airline_name',combo_key:'airline_name'}} size={'xs'} absolute={true} x={'96px'} y={'48px'} width={'128px'} align={'left'} combo={{
                            onSearch:ComboSearch('airline_name','q_zzs_airline',null),
                            searchColumn:'airline_name',
                            width:'307px',
                            header:false,
                            filterColumns:[
                                {field:'airline_name',width:'211px'},
                                {field:'airline_code',width:'48px'},
                                {field:'airline_prefix',width:'48px'}
                            ]
                        }} data={this.state.data?.airline}/>
                        <Label jsxId={'Label1817'} sm={true} absolute={true} x={'24px'} y={'48px'} width={'68px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Airline'}/>
                        <Input jsxId={'departure_airport_name'} field={{key:'departure_airport_name',key_text:'departure_airport_name',combo_text:'airport',combo_key:'airport'}} size={'xs'} absolute={true} x={'116px'} y={'128px'} width={'144px'} align={'left'} combo={{
                            onSearch:ComboSearch('airport','q_zzs_airport',null),
                            searchColumn:'airport',
                            width:'163px',
                            header:false,
                            filterColumns:[
                                {field:'airport',width:'115px'},
                                {field:'airport_code',width:'48px'}
                            ]
                        }} data={this.state.data?.departure_airport_name}/>
                        <Label jsxId={'Label724'} sm={true} absolute={true} x={'40px'} y={'128px'} width={'72px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Departure'}/>
                        <Input jsxId={'destination_airport_name'} field={{key:'destination_airport_name',key_text:'destination_airport_name',combo_text:'airport',combo_key:'airport'}} size={'xs'} absolute={true} x={'116px'} y={'192px'} width={'144px'} align={'left'} combo={{
                            onSearch:ComboSearch('airport','q_zzs_airport',null),
                            searchColumn:'airport',
                            width:'163px',
                            header:false,
                            filterColumns:[
                                {field:'airport',width:'115px'},
                                {field:'airport_code',width:'48px'}
                            ]
                        }} data={this.state.data?.destination_airport_name}/>
                        <Label jsxId={'Label1176'} sm={true} absolute={true} x={'40px'} y={'192px'} width={'72px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Clear At'}/>
                        <Input jsxId={'destination_airport_code'} field={'destination_airport_code'} absolute={true} size={'xs'} lang={'en'} x={'272px'} y={'192px'} width={'60px'} tabIndex={'4'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.destination_airport_code} maxlength={3}/>
                        <Input jsxId={'export_date-1'} field={'export_date'} absolute={true} size={'xs'} lang={'en'} x={'496px'} y={'128px'} width={'116px'} tabIndex={'5'} color={'#000000'} disableClear={true} align={'center'} calendar={{format:'MM-DD-YYYY'}} data={this.state.data?.export_date}/>
                        <Label jsxId={'Label1795'} sm={true} absolute={true} x={'456px'} y={'128px'} width={'32px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'ATD'}/>
                        <Input jsxId={'destination_eta_date-2'} field={'destination_eta_date'} absolute={true} size={'xs'} lang={'en'} x={'496px'} y={'192px'} width={'116px'} tabIndex={'6'} color={'#000000'} disableClear={true} align={'center'} calendar={{format:'MM-DD-YYYY'}} data={this.state.data?.destination_eta_date}/>
                        <Label jsxId={'Label1798'} sm={true} absolute={true} x={'456px'} y={'192px'} width={'36px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Date'}/>
                        <Input jsxId={'master_bill_no-2'} field={'master_bill_no'} absolute={true} size={'xs'} lang={'en'} x={'96px'} y={'16px'} width={'168px'} tabIndex={'7'} color={'#000000'} disableClear={true} align={'left'} locked={true} data={this.state.data?.master_bill_no} maxlength={16}/>
                        <Label jsxId={'Label1624'} sm={true} absolute={true} x={'24px'} y={'16px'} width={'68px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'MWAB No.'}/>
                        <CTable jsxId={'sub_mbl_hbl_list_part_shipment'} absolute={true} x={'20px'} y={'244px'} width={'804px'} height={'136px'} scroll={true} headerTheme={'primary'} hover={true} select={false} sm={true} fontSm={true} source={'v_mbl_hbl_multi_split_ship'} data={this.state.tab_sub_mbl_hbl_list_part_shipment_data} ref={c=>this.sub_mbl_hbl_list_part_shipment=c} page={this.state.tab_sub_mbl_hbl_list_part_shipment_page} dataCount={this.state.tab_sub_mbl_hbl_list_part_shipment_count} onSelectPage={this.getTableData('sub_mbl_hbl_list_part_shipment','v_mbl_hbl_multi_split_ship',null)} showNumbers={50} edit={true} onFilter={this.filterHandler('sub_mbl_hbl_list_part_shipment')} onSort={this.sortHandler('sub_mbl_hbl_list_part_shipment')}>
                            <Table.Header jsxId={'sub_mbl_hbl_list_part_shipment-part_indicator'} field={'part_indicator'} text={'Part'} width={'44px'} align={'center'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_hbl_list_part_shipment-flight_id'} field={'flight_id'} text={'Flight ID'} width={'100px'} align={'center'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_hbl_list_part_shipment-partial_package'} field={'partial_package'} text={'Manifest Qty'} width={'88px'} align={'center'} color={'#000000'} dataType={'number'} foot={false} type={''} disabled={true}/>
                            <Table.Header jsxId={'sub_mbl_hbl_list_part_shipment-total_package'} field={'total_package'} text={'Total Pkg'} width={'76px'} align={'center'} color={'#000000'} dataType={'number'} foot={false} type={''} disabled={true}/>
                            <Table.Header jsxId={'sub_mbl_hbl_list_part_shipment-arrival_date'} field={'arrival_date'} text={'Arrival Date'} width={'92px'} align={'center'} color={'#000000'} dataType={'number'} onFormat={val=>val?moment(val).format('MM-DD-YYYY'):''} foot={false} type={'calendar'}/>
                            <Table.Header jsxId={'sub_mbl_hbl_list_part_shipment-inbond_number'} field={'inbond_number'} text={'I.T. Number'} width={'108px'} align={'left'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_hbl_list_part_shipment-atd_date'} field={'atd_date'} text={'Flight Date'} width={'92px'} align={'center'} color={'#000000'} dataType={'number'} onFormat={val=>val?moment(val).format('YYYY-MM-DD'):''} foot={false} type={'calendar'} disabled={true}/>
                            <Table.Header jsxId={'sub_mbl_hbl_list_part_shipment-flight_no'} field={'flight_no'} text={'Flight No.'} width={'80px'} align={'left'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                        </CTable>
                        <Button jsxId={'btn7ABIQuery1'} absolute={true} size={'xs'} x={'724px'} y={'20px'} width={'104px'} height={'44px'} outline={true} theme={'success'} tip={null} onClick={this.ACEManifest }>
                            Query <br/>Manifest Status
                        </Button>
                        <Input jsxId={'destination_port_no-1'} field={'destination_port_no'} absolute={true} size={'xs'} lang={'en'} x={'368px'} y={'192px'} width={'52px'} tabIndex={'10'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.destination_port_no} maxlength={4}/>
                        <Box jsxId={'Box1636'} absolute={true} x={'20px'} y={'108px'} width={'332px'} height={'124px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Label jsxId={'Label1637'} sm={true} absolute={true} x={'20px'} y={'88px'} width={'332px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Airpot / First Entry / Destination'}/>
                        <Input jsxId={'departure_airport_code'} field={'departure_airport_code'} absolute={true} size={'xs'} lang={'en'} x={'272px'} y={'128px'} width={'60px'} tabIndex={'11'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.departure_airport_code} maxlength={3}/>
                        <Label jsxId={'Label1652'} sm={true} absolute={true} x={'352px'} y={'88px'} width={'84px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Schedule D'}/>
                        <Label jsxId={'Label1655'} sm={true} absolute={true} x={'652px'} y={'128px'} width={'148px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'IT Issued - Issue Date'}/>
                        <CCheckbox jsxId={'it_issued_sw-1'} field={'it_issued_sw-1'} absolute={true} x={'660px'} y={'160px'} checked={this.state.data?.it_issue_sw}/>
                        <CCheckbox jsxId={'split_shipment_sw-1'} field={'split_shipment_sw-1'} absolute={true} x={'660px'} y={'192px'} checked={this.state.data?.split_shipment_sw}/>
                        <Label jsxId={'Label1659'} sm={true} absolute={true} x={'684px'} y={'188px'} width={'116px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Air Split Shipped'}/>
                        <Input jsxId={'port_eta_date-2'} field={'port_eta_date'} absolute={true} size={'xs'} lang={'en'} x={'496px'} y={'160px'} width={'116px'} tabIndex={'14'} color={'#000000'} disableClear={true} align={'center'} calendar={{format:'MM-DD-YYYY'}} data={this.state.data?.port_eta_date}/>
                        <Label jsxId={'Label1796'} sm={true} absolute={true} x={'456px'} y={'160px'} width={'36px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Date'}/>
                        <Input jsxId={'first_entry_airport_name'} field={{key:'first_entry_airport_name',key_text:'first_entry_airport_name',combo_text:'airport_name',combo_key:'airport_name'}} size={'xs'} absolute={true} x={'116px'} y={'160px'} width={'144px'} align={'left'} combo={{
                            onSearch:ComboSearch('airport_name','q_zzs_schedule_d_airport',[{field:'airport_name',type:'asc'}]),
                            searchColumn:'airport_name',
                            width:'278px',
                            header:false,
                            filterColumns:[
                                {field:'airport_name',width:'163px'},
                                {field:'airport_code',width:'48px'},
                                {field:'schedule_d_code',width:'67px'}
                            ]
                        }} data={this.state.data?.first_entry_airport_name}/>
                        <Label jsxId={'Label1792'} sm={true} absolute={true} x={'40px'} y={'160px'} width={'72px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'First Entry'}/>
                        <Input jsxId={'first_entry_airport_code'} field={'first_entry_airport_code'} absolute={true} size={'xs'} lang={'en'} x={'272px'} y={'160px'} width={'60px'} tabIndex={'16'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.first_entry_airport_code} maxlength={5}/>
                        <Input jsxId={'discharge_port_no-1'} field={'discharge_port_no'} absolute={true} size={'xs'} lang={'en'} x={'368px'} y={'160px'} width={'52px'} tabIndex={'17'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.discharge_port_no} maxlength={4}/>
                        <Label jsxId={'Label1800'} sm={true} absolute={true} x={'368px'} y={'128px'} width={'52px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Schd D'}/>
                        <Label jsxId={'Label1799'} sm={true} absolute={true} x={'436px'} y={'88px'} width={'196px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Export Date / ATA'}/>
                        <Box jsxId={'Box1818'} absolute={true} x={'352px'} y={'108px'} width={'84px'} height={'124px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Box jsxId={'Box1819'} absolute={true} x={'436px'} y={'108px'} width={'196px'} height={'124px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Box jsxId={'Box1820'} absolute={true} x={'632px'} y={'108px'} width={'192px'} height={'124px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Label jsxId={'Label1821'} sm={true} absolute={true} x={'632px'} y={'88px'} width={'192px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'IT Issued / Split Shipment'}/>
                        <Box jsxId={'Box1613'} absolute={true} x={'20px'} y={'416px'} width={'248px'} height={'80px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'ci_req_date_time'} field={'ci_req_date_time'} absolute={true} size={'xs'} lang={'en'} x={'108px'} y={'432px'} width={'140px'} tabIndex={'18'} color={'#000000'} disableClear={true} align={'center'} locked={true} calendar={{format:'MM-DD-YYYY HH:mm'}} data={this.state.data?.ci_req_date_time}/>
                        <Label jsxId={'Label1615'} sm={true} absolute={true} x={'40px'} y={'432px'} width={'60px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'AI Start'}/>
                        <Input jsxId={'ci_finish_date_time'} field={'ci_finish_date_time'} absolute={true} size={'xs'} lang={'en'} x={'108px'} y={'460px'} width={'140px'} tabIndex={'19'} color={'#000000'} disableClear={true} align={'center'} locked={true} calendar={{format:'MM-DD-YYYY HH:mm'}} data={this.state.data?.ci_finish_date_time}/>
                        <Label jsxId={'Label1617'} sm={true} absolute={true} x={'40px'} y={'460px'} width={'60px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'AI Finish'}/>
                        <Input jsxId={'ci_update_date_time'} field={'ci_update_date_time'} absolute={true} size={'xs'} lang={'en'} x={'372px'} y={'432px'} width={'140px'} tabIndex={'20'} color={'#000000'} disableClear={true} align={'center'} locked={true} data={this.state.data?.ci_update_date_time} maxlength={50}/>
                        <Label jsxId={'Label1619'} sm={true} absolute={true} x={'284px'} y={'432px'} width={'84px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Update Time'}/>
                        <Input jsxId={'ci_status_code'} field={'ci_status_code'} absolute={true} size={'xs'} lang={'en'} x={'372px'} y={'460px'} width={'140px'} tabIndex={'21'} color={'#000000'} disableClear={true} align={'center'} locked={true} data={this.state.data?.ci_status_code} maxlength={5}/>
                        <Label jsxId={'Label1621'} sm={true} absolute={true} x={'284px'} y={'460px'} width={'84px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Status Code'}/>
                        <Box jsxId={'Box1675'} absolute={true} x={'560px'} y={'416px'} width={'264px'} height={'80px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'created_by_code'} field={'created_by_code'} absolute={true} size={'xs'} lang={'en'} x={'580px'} y={'432px'} width={'80px'} tabIndex={'22'} color={'#000000'} disableClear={true} align={'center'} locked={true} data={this.state.data?.created_by_code} maxlength={20}/>
                        <Input jsxId={'created_date'} field={'created_date'} absolute={true} size={'xs'} lang={'en'} x={'672px'} y={'432px'} width={'140px'} tabIndex={'23'} color={'#000000'} disableClear={true} align={'center'} locked={true} calendar={{format:'MM-DD-YYYY'}} data={this.state.data?.created_date}/>
                        <Input jsxId={'modified_date'} field={'modified_date'} absolute={true} size={'xs'} lang={'en'} x={'672px'} y={'460px'} width={'140px'} tabIndex={'24'} color={'#000000'} disableClear={true} align={'center'} locked={true} calendar={{format:'MM-DD-YYYY'}} data={this.state.data?.modified_date}/>
                        <Input jsxId={'modified_by_code'} field={'modified_by_code'} absolute={true} size={'xs'} lang={'en'} x={'580px'} y={'460px'} width={'80px'} tabIndex={'25'} color={'#000000'} disableClear={true} align={'center'} locked={true} data={this.state.data?.modified_by_code} maxlength={20}/>
                        <Label jsxId={'Label1653'} sm={true} absolute={true} x={'20px'} y={'396px'} width={'248px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'AI Processing Time Log'}/>
                        <Label jsxId={'Label1676'} sm={true} absolute={true} x={'560px'} y={'396px'} width={'264px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Created - Modified'}/>
                        <Box jsxId={'Box1822'} absolute={true} x={'268px'} y={'416px'} width={'260px'} height={'80px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Label jsxId={'Label1823'} sm={true} absolute={true} x={'268px'} y={'396px'} width={'260px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'AI Update Status'}/>
                        <Input jsxId={'it_issue_date-1'} field={'it_issue_date'} absolute={true} size={'xs'} lang={'en'} x={'684px'} y={'156px'} width={'116px'} tabIndex={'26'} color={'#000000'} disableClear={true} align={'left'} calendar={{format:'YYYY-MM-DD'}} data={this.state.data?.it_issue_date}/>
                        <Button jsxId={'btn3FetchManifestAir'} absolute={true} size={'xs'} x={'652px'} y={'20px'} width={'64px'} height={'44px'} outline={true} theme={'primary'} tip={null} onClick={this.fetchManifest}>
                            Fetch iTrace
                        </Button>
                        <Input jsxId={'flight_no'} field={'voyage_no'} absolute={true} size={'xs'} lang={'en'} x={'348px'} y={'48px'} width={'72px'} tabIndex={'28'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.voyage_no} maxlength={20}/>
                        <Label jsxId={'lbl_flightno'} sm={true} absolute={true} x={'280px'} y={'48px'} width={'64px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Flight No.'}/>
                    </TabsContent>
                    <TabsContent jsxId={'Invoice'} id={'Invoice'} text={'Invoice line'}>
                        <CTable jsxId={'sub_mbl_o_hbl_1_ci_line_1_simple'} absolute={true} x={'20px'} y={'88px'} width={'808px'} height={'412px'} scroll={true} headerTheme={'primary'} hover={true} select={true} sm={true} fontSm={true} source={'v_mbl_hbl_invoice_line'} data={this.state.tab_sub_mbl_o_hbl_1_ci_line_1_simple_data} ref={c=>this.sub_mbl_o_hbl_1_ci_line_1_simple=c} page={this.state.tab_sub_mbl_o_hbl_1_ci_line_1_simple_page} dataCount={this.state.tab_sub_mbl_o_hbl_1_ci_line_1_simple_count} onSelectPage={this.getTableData('sub_mbl_o_hbl_1_ci_line_1_simple','v_mbl_hbl_invoice_line',[{field:'ci_invoice_no',type:'asc'},{field:'ci_line_no',type:'asc'}])} showNumbers={50} onFilter={this.filterHandler('sub_mbl_o_hbl_1_ci_line_1_simple')} onSort={this.sortHandler('sub_mbl_o_hbl_1_ci_line_1_simple')} total={this.state.tab_sub_mbl_o_hbl_1_ci_line_1_simple_total} totalFields={'ci_line_value,ci_line_qty,ci_line_net_wgt,ci_line_gross_wgt,ci_line_value_currency'.split(',')} edit={this.state.InvoiceLineEditSw} noReplace={"edit"} hidden={!this.showCiSimpleSw()} onDelete={this.deleteInvoiceLine}>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_1_simple-ci_line_no'} field={'ci_line_no'} text={'Inv Line'} width={'52px'} align={'center'} color={'#000000'} dataType={'number'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_1_simple-ci_line_unit_price'} field={'ci_line_unit_price'} text={'Unit Price'} width={'88px'} align={'right'} color={'#000000'} dataType={'number'} onFormat={val=>val?Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(val):''} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_1_simple-ci_line_qty'} field={'ci_line_qty'} text={'Qty 1'} width={'84px'} align={'center'} color={'#000000'} dataType={'number'} onFormat={val=>val?Intl.NumberFormat("en-US",{minimumFractionDigits:2}).format(val):''} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_1_simple-ci_line_value'} field={'ci_line_value'} text={'Line Value'} width={'100px'} align={'right'} color={'#000000'} dataType={'number'} onFormat={val=>val?Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(val):''} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_1_simple-hs_code'} field={'hs_code'} text={'HS Code'} width={'116px'} align={''} color={''} dataType={'text'} foot={false} type={'combo'} combo={{
                                onSearch:ComboSearch('hs_code','q_hts_us',null),
                                searchColumn:'hs_code',
                                width:'384px',
                                header:false,
                                filterColumns:[
                                    {field:'hs_code',width:'96px'},
                                    {field:'hs_code_desc',width:'288px'}
                                ]
                            }} onEdit={(index,val,row,callback)=>{
                                //this.sub_mbl_o_hbl_1_ci_line_1_simple.state.data[index]["product_desc"]=row?row["hs_code_desc"]:"";
                            }}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_1_simple-Q'} field={'Q'} text={'HS'} width={'24px'} align={'center'} color={'#0000ff'} dataType={'number'} onFormat={val=><u className='print-default'>Q</u>} onDoubleClick={this.open('f_hts_us','hs_code',false)} foot={false} type={''} noReplace={"onDoubleClick,disabled,dataType,onFormat"} disabled={true}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_1_simple-ci_line_net_wgt'} field={'ci_line_net_wgt'} text={'Net Wgt Kg'} width={'80px'} align={'center'} color={'#000000'} dataType={'number'} onFormat={val=>val?Intl.NumberFormat("en-US",{minimumFractionDigits:2}).format(val):''} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_1_simple-product_desc'} field={'product_desc'} text={'Product Desc'} width={'312px'} align={'left'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_1_simple-product_code'} field={'product_code'} text={'Product Code'} width={'120px'} align={'left'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_1_simple-ci_line_gross_wgt'} field={'ci_line_gross_wgt'} text={'Gross Kg'} width={'80px'} align={'center'} color={'#000000'} dataType={'number'} onFormat={val=>val?Intl.NumberFormat("en-US",{minimumFractionDigits:2}).format(val):''} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_1_simple-ci_unit_code'} field={'ci_unit_code'} text={'Unit 1'} width={'40px'} align={'center'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_1_simple-ci_line_value_currency'} field={'ci_line_value_currency'} text={'Currency Value'} width={'104px'} align={'center'} color={'#000000'} dataType={'number'} onFormat={val=>val?Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(val):''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_1_simple-ci_line_note'} field={'ci_line_note'} text={'Line Note'} width={'312px'} align={'left'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                        </CTable>
                        <CTable jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex'} absolute={true} x={'20px'} y={'88px'} width={'808px'} height={'412px'} scroll={true} headerTheme={'primary'} hover={true} select={true} sm={true} fontSm={true} source={'v_mbl_hbl_invoice_line'} data={this.state.tab_sub_mbl_o_hbl_1_ci_line_2_complex_data} ref={c=>this.sub_mbl_o_hbl_1_ci_line_2_complex=c} page={this.state.tab_sub_mbl_o_hbl_1_ci_line_2_complex_page} dataCount={this.state.tab_sub_mbl_o_hbl_1_ci_line_2_complex_count} onSelectPage={this.getTableData('sub_mbl_o_hbl_1_ci_line_2_complex','v_mbl_hbl_invoice_line',[{field:'ci_invoice_no',type:'asc'},{field:'ci_line_no',type:'asc'}])} showNumbers={50} edit={this.state.InvoiceLineEditSw} total={this.state.tab_sub_mbl_o_hbl_1_ci_line_2_complex_total} totalFields={'ci_line_qty,ci_line_value,ci_line_unit_price,ci_line_gross_wgt,ci_line_net_wgt,copper_content_value,aluminum_content_value,steel_content_value,no_content_value,ci_line_value_currency'.split(',')} onFilter={this.filterHandler('sub_mbl_o_hbl_1_ci_line_2_complex')} onSort={this.sortHandler('sub_mbl_o_hbl_1_ci_line_2_complex')} noReplace={"edit"} hidden={this.showCiSimpleSw()} onDelete={this.deleteInvoiceLine}>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex-ci_invoice_no'} field={'ci_invoice_no'} text={'Invoice No.'} width={'100px'} align={'left'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex-ci_line_no'} field={'ci_line_no'} text={'Line No.'} width={'52px'} align={'center'} color={'#000000'} dataType={'number'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex-ci_line_unit_price'} field={'ci_line_unit_price'} text={'Unit Price'} width={'80px'} align={'right'} color={'#000000'} dataType={'number'} onFormat={val=>val?Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(val):''} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex-ci_line_qty'} field={'ci_line_qty'} text={'Qty 1'} width={'76px'} align={'center'} color={'#000000'} dataType={'number'} onFormat={val=>val?Intl.NumberFormat("en-US",{minimumFractionDigits:2}).format(val):''} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex-ci_line_value'} field={'ci_line_value'} text={'Line Value'} width={'100px'} align={'right'} color={'#000000'} dataType={'number'} onFormat={val=>val?Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(val):''} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex-hs_code'} field={'hs_code'} text={'HS Code'} width={'116px'} align={''} color={''} dataType={'text'} foot={false} type={'combo'} combo={{
                                onSearch:ComboSearch('hs_code','q_hts_us',null),
                                searchColumn:'hs_code',
                                width:'384px',
                                header:false,
                                filterColumns:[
                                    {field:'hs_code',width:'96px'},
                                    {field:'hs_code_desc',width:'288px'}
                                ]
                            }} onEdit={(index,val,row,callback)=>{
                                //this.sub_mbl_o_hbl_1_ci_line_2_complex.state.data[index]["product_desc"]=row?row["hs_code_desc"]:"";
                            }}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex-Q'} field={'Q'} text={'HS'} width={'24px'} align={'center'} color={'#0000ff'} dataType={'number'} onFormat={val=><u className='print-default'>Q</u>} onDoubleClick={this.open('f_hts_us','hs_code',false)} foot={false} type={''} noReplace={"onDoubleClick,disabled,dataType,onFormat"} disabled={true}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex-ci_mid_id'} field={'ci_mid_id'} text={'MID'} width={'148px'} align={''} color={''} dataType={'number'} foot={false} type={'combo'} combo={{
                                onSearch:ComboSearch('mf_short_name','q_mid_short_name',null),
                                searchColumn:'mf_short_name',
                                width:'739px',
                                header:false,
                                filterColumns:[
                                    {field:'mf_short_name',width:'211px'},
                                    {field:'mid',width:'144px'},
                                    {field:'country_code',width:'48px'},
                                    {field:'city',width:'96px'},
                                    {field:'mf_name',width:'240px'}
                                ]
                            }}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex-ci_line_net_wgt'} field={'ci_line_net_wgt'} text={'Net Wgt Kg'} width={'84px'} align={'center'} color={'#000000'} dataType={'number'} onFormat={val=>val?Intl.NumberFormat("en-US",{minimumFractionDigits:2}).format(val):''} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex-copper_content_value'} field={'copper_content_value'} text={'Copper Value'} width={'80px'} align={'right'} color={'#000000'} dataType={'number'} onFormat={val=>val?Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(val):''} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex-aluminum_content_value'} field={'aluminum_content_value'} text={'Alum Value'} width={'80px'} align={'right'} color={'#000000'} dataType={'number'} onFormat={val=>val?Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(val):''} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex-steel_content_value'} field={'steel_content_value'} text={'Steel Value'} width={'80px'} align={'right'} color={'#000000'} dataType={'number'} onFormat={val=>val?Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(val):''} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex-no_content_value'} field={'no_content_value'} text={'No Content'} width={'80px'} align={'right'} color={'#000000'} dataType={'number'} onFormat={val=>val?Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(val):''} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex-s232_content_sw'} field={'s232_content_sw'} text={'232'} width={'36px'} align={'center'} color={''} dataType={'bool'} onFormat={val=><i className={"text-primary far "+ (!!val?"fa-check-circle":"fa-circle")}/>} foot={false} type={'checkbox'}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex-ci_country_of_origin_code'} field={'ci_country_of_origin_code'} text={'Country Origin'} width={'100px'} align={''} color={''} dataType={'text'} foot={false} type={'combo'} combo={{
                                onSearch:ComboSearch('country_name','q_zun_country_sel_name',null),
                                searchColumn:'country_name',
                                width:'192px',
                                header:false,
                                filterColumns:[
                                    {field:'country_name',width:'144px'},
                                    {field:'country_code',width:'48px'}
                                ]
                            }}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex-product_code'} field={'product_code'} text={'Product Code'} width={'104px'} align={'left'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex-product_desc'} field={'product_desc'} text={'Product Desc'} width={'168px'} align={'left'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex-ci_line_gross_wgt'} field={'ci_line_gross_wgt'} text={'Gross Kg'} width={'80px'} align={'center'} color={'#000000'} dataType={'number'} onFormat={val=>val?Intl.NumberFormat("en-US",{minimumFractionDigits:2}).format(val):''} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex-ci_unit_code'} field={'ci_unit_code'} text={'Unit 1'} width={'40px'} align={'center'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex-ci_line_value_currency'} field={'ci_line_value_currency'} text={'Currency Value'} width={'104px'} align={'center'} color={'#000000'} dataType={'number'} onFormat={val=>val?Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(val):''} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_1_ci_line_2_complex-ci_line_note'} field={'ci_line_note'} text={'Line Note'} width={'313px'} align={'left'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                        </CTable>
                        <Box jsxId={'Box1711'} absolute={true} x={'708px'} y={'12px'} width={'120px'} height={'64px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Input jsxId={'HSCode'} field={'HSCode'} absolute={true} size={'xs'} lang={'en'} x={'720px'} y={'44px'} width={'96px'} tabIndex={'2'} color={'#000000'} disableClear={true} align={'left'} data={this.state.data?.HSCode}/>
                        <Button jsxId={'btn3ApplyHSCode'} absolute={true} size={'xs'} x={'720px'} y={'20px'} width={'96px'} height={'20px'} outline={true} theme={'dark'} tip={null} onClick={this.applyHsCode}>
                            Apply HS Code
                        </Button>
                        <Box jsxId={'Box1966'} absolute={true} x={'20px'} y={'12px'} width={'88px'} height={'64px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Button jsxId={'btn3InvoiceLineDisplaySimple'} absolute={true} size={'xs'} x={'32px'} y={'24px'} width={'64px'} height={'20px'} outline={true} theme={'dark'} tip={null} onClick={()=>{this.setCiLine("1")}}>
                            Simple
                        </Button>
                        <Button jsxId={'btn3InvoiceLineDisplayComplex'} absolute={true} size={'xs'} x={'32px'} y={'48px'} width={'64px'} height={'20px'} outline={true} theme={'primary'} tip={null} onClick={()=>{this.setCiLine("2")}}>
                            Complex
                        </Button>
                        <Button jsxId={'btn3EditCILine'} absolute={true} size={'xs'} x={'548px'} y={'24px'} width={'48px'} height={'44px'} outline={true} theme={'danger'} tip={null} onClick={()=>this.setInvoiceLineEdit(!this.state.InvoiceLineEditSw)}>
                            Edit Mode
                        </Button>
                        <Box jsxId={'Box1722'} absolute={true} x={'612px'} y={'12px'} width={'88px'} height={'64px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Box jsxId={'Box1780'} absolute={true} x={'536px'} y={'12px'} width={'68px'} height={'64px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Button jsxId={'btn1WeightCalculator'} absolute={true} size={'xs'} x={'624px'} y={'24px'} width={'68px'} height={'44px'} outline={true} theme={'primary'} tip={null} onClick={this.openWeightCalculator}>
                            Weight Calculator
                        </Button>
                        <Input jsxId={'house_count1'} field={'house_count'} absolute={true} size={'xs'} lang={'en'} x={'284px'} y={'44px'} width={'44px'} tabIndex={'8'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.house_count} onDblClick={this.openMultiSeller}/>
                        <Input jsxId={'invoice_count1'} field={'invoice_count'} absolute={true} size={'xs'} lang={'en'} x={'184px'} y={'44px'} width={'44px'} tabIndex={'9'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.invoice_count} onDblClick={this.openMultiInvoice}/>
                        <Input jsxId={'mf_count1'} field={'mf_count'} absolute={true} size={'xs'} lang={'en'} x={'236px'} y={'44px'} width={'40px'} tabIndex={'10'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.mf_count} onDblClick={this.openMultiMFR}/>
                        <Input jsxId={'country_of_origin_count'} field={'country_of_origin_count'} absolute={true} size={'xs'} lang={'en'} x={'336px'} y={'44px'} width={'40px'} tabIndex={'11'} color={'#000000'} disableClear={true} align={'center'} data={this.state.data?.country_of_origin_count} onDblClick={this.openMultiCoo}/>
                        <Label jsxId={'Label1667'} sm={true} absolute={true} x={'124px'} y={'44px'} width={'52px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Count'}/>
                        <Box jsxId={'Box1668'} absolute={true} x={'116px'} y={'12px'} width={'272px'} height={'64px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Label jsxId={'Label1686'} sm={true} absolute={true} x={'124px'} y={'20px'} width={'52px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Multiple'}/>
                        <Button jsxId={'btn1COO'} absolute={true} size={'xs'} x={'336px'} y={'20px'} width={'40px'} height={'20px'} outline={true} theme={'primary'} tip={null} onClick={this.openMultiCoo}>
                            COO
                        </Button>
                        <Button jsxId={'btn1Seller'} absolute={true} size={'xs'} x={'284px'} y={'20px'} width={'44px'} height={'20px'} outline={true} theme={'primary'} tip={null} onClick={this.openMultiSeller}>
                            B/Ls
                        </Button>
                        <Button jsxId={'btn1MFR'} absolute={true} size={'xs'} x={'236px'} y={'20px'} width={'40px'} height={'20px'} outline={true} theme={'primary'} tip={null} onClick={this.openMultiMFR}>
                            MFR
                        </Button>
                        <Button jsxId={'btn1Invoice'} absolute={true} size={'xs'} x={'180px'} y={'20px'} width={'52px'} height={'20px'} outline={true} theme={'primary'} tip={null} onClick={this.openMultiInvoice}>
                            Invoice
                        </Button>
                    </TabsContent>
                    <TabsContent jsxId={'MultipleCount'} id={'MultipleCount'} text={'Currecy Rate / ISF Detail'}>
                        <CTable jsxId={'sub_mbl_hbl_isf_mf_hs_coo_list'} absolute={true} x={'24px'} y={'96px'} width={'800px'} height={'196px'} scroll={true} headerTheme={'primary'} hover={true} select={false} sm={true} fontSm={true} source={'v_mbl_hbl_mf_hs_coo_list'} data={this.state.tab_sub_mbl_hbl_isf_mf_hs_coo_list_data} ref={c=>this.sub_mbl_hbl_isf_mf_hs_coo_list=c} page={this.state.tab_sub_mbl_hbl_isf_mf_hs_coo_list_page} dataCount={this.state.tab_sub_mbl_hbl_isf_mf_hs_coo_list_count} onSelectPage={this.getTableData('sub_mbl_hbl_isf_mf_hs_coo_list','v_mbl_hbl_mf_hs_coo_list',null)} showNumbers={50} edit={true} onFilter={this.filterHandler('sub_mbl_hbl_isf_mf_hs_coo_list')} onSort={this.sortHandler('sub_mbl_hbl_isf_mf_hs_coo_list')} onDelete={this.deleteMHsCoo}>
                            <Table.Header jsxId={'sub_mbl_hbl_isf_mf_hs_coo_list-mf_name'} field={'mf_name'} text={'ISF Filing Detail / MFR'} width={'236px'} align={'left'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_hbl_isf_mf_hs_coo_list-mid'} field={'mid'} text={'MID'} width={'144px'} align={'left'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_hbl_isf_mf_hs_coo_list-hs_code'} field={'hs_code'} text={'HS Code'} width={'108px'} align={'center'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_hbl_isf_mf_hs_coo_list-country_of_origin_code'} field={'country_of_origin_code'} text={'COO'} width={'56px'} align={'center'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_hbl_isf_mf_hs_coo_list-mf_short_name'} field={'mf_short_name'} text={' Short Name'} width={'210px'} align={'left'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                        </CTable>
                        <CTable jsxId={'sub_mbl_hbl_multi_mf_list'} absolute={true} x={'20px'} y={'324px'} width={'576px'} height={'172px'} scroll={true} headerTheme={'primary'} hover={true} select={false} sm={true} fontSm={true} source={'v_mbl_hbl_list_multi_invoice'} data={this.state.tab_sub_mbl_hbl_multi_mf_list_data} ref={c=>this.sub_mbl_hbl_multi_mf_list=c} page={this.state.tab_sub_mbl_hbl_multi_mf_list_page} dataCount={this.state.tab_sub_mbl_hbl_multi_mf_list_count} onSelectPage={this.getTableData('sub_mbl_hbl_multi_mf_list','v_mbl_hbl_list_multi_invoice',null)} showNumbers={50} edit={true} total={this.state.tab_sub_mbl_hbl_multi_mf_list_total} totalFields={'invoice_value,invoice_value_currency'.split(',')} onFilter={this.filterHandler('sub_mbl_hbl_multi_mf_list')} onSort={this.sortHandler('sub_mbl_hbl_multi_mf_list')} onDelete={this.deleteMMf}>
                            <Table.Header jsxId={'sub_mbl_hbl_multi_mf_list-input_inv_seq_no'} field={'input_inv_seq_no'} text={'Seq'} width={'48px'} align={'center'} color={'#000000'} dataType={'number'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_hbl_multi_mf_list-invoice_no'} field={'invoice_no'} text={'Invoice No.'} width={'156px'} align={'left'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_hbl_multi_mf_list-invoice_value'} field={'invoice_value'} text={'Invoice Value'} width={'124px'} align={'right'} color={'#000000'} dataType={'number'} onFormat={val=>val?Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(val):''} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_hbl_multi_mf_list-currency_code'} field={'currency_code'} text={'Currency'} width={'64px'} align={'center'} color={'#000000'} dataType={'text'} foot={false} type={''} onFormat={val=>val?Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(val):''}/>
                            <Table.Header jsxId={'sub_mbl_hbl_multi_mf_list-invoice_value_currency'} field={'invoice_value_currency'} text={'Currency Value'} width={'128px'} align={'right'} color={'#000000'} dataType={'number'} onFormat={val=>val?Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(val):''} foot={false} type={''}/>
                        </CTable>
                        <Label jsxId={'Label1830'} sm={true} absolute={true} x={'20px'} y={'308px'} width={'160px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Multiple Invoice List'}/>
                        <CTable jsxId={'sub_mbl_hbl_multi_coo_list'} absolute={true} x={'612px'} y={'324px'} width={'212px'} height={'172px'} scroll={true} headerTheme={'primary'} hover={true} select={false} sm={true} fontSm={true} source={'v_mbl_hbl_list_multi_coo'} data={this.state.tab_sub_mbl_hbl_multi_coo_list_data} ref={c=>this.sub_mbl_hbl_multi_coo_list=c} page={this.state.tab_sub_mbl_hbl_multi_coo_list_page} dataCount={this.state.tab_sub_mbl_hbl_multi_coo_list_count} onSelectPage={this.getTableData('sub_mbl_hbl_multi_coo_list','v_mbl_hbl_list_multi_coo',null)} showNumbers={50} edit={true} onFilter={this.filterHandler('sub_mbl_hbl_multi_coo_list')} onSort={this.sortHandler('sub_mbl_hbl_multi_coo_list')} onDelete={this.deleteCoo}>
                            <Table.Header jsxId={'sub_mbl_hbl_multi_coo_list-country_name'} field={'country_name'} text={'Country of Origin List'} width={'164px'} align={''} color={''} dataType={'text'} foot={false} type={'combo'} combo={{
                                onSearch:ComboSearch('country_name','q_zun_country_sel_name',null),
                                searchColumn:'country_name',
                                width:'192px',
                                header:false,
                                filterColumns:[
                                    {field:'country_name',width:'144px'},
                                    {field:'country_code',width:'48px'}
                                ]
                            }} onEdit={(index,val,row,callback)=>{
                                this.sub_mbl_hbl_multi_coo_list.state.data[index]["country_name"]=row?row["country_name"]:"";
                                this.sub_mbl_hbl_multi_coo_list.state.data[index]["country_code"]=row?row["country_code"]:"";
                            }}/>
                        </CTable>
                        <Label jsxId={'Label1831'} sm={true} absolute={true} x={'612px'} y={'308px'} width={'164px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Multiple COO List'}/>
                        <Label jsxId={'Label2066'} sm={true} absolute={true} x={'24px'} y={'16px'} width={'68px'} height={'16px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Currency'}/>
                        <Box jsxId={'Box2065'} absolute={true} x={'24px'} y={'32px'} width={'68px'} height={'48px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Button jsxId={'btn7QueryExRate'} absolute={true} size={'xs'} x={'332px'} y={'44px'} width={'48px'} height={'24px'} outline={true} theme={'success'} onClick={e=>this.getData(1)} tip={null}>
                            Query
                        </Button>
                        <Label jsxId={'Label2070'} sm={true} absolute={true} x={'224px'} y={'16px'} width={'92px'} height={'16px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Exch Rate'}/>
                        <Input jsxId={'currency_exchange_rate'} field={'currency_exchange_rate'} absolute={true} size={'xs'} lang={'en'} x={'232px'} y={'44px'} width={'76px'} tabIndex={'4'} color={'#000000'} disableClear={true} align={'right'} locked={true} data={this.state.data?.currency_exchange_rate} maxlength={16} onFormat={val=>val?Intl.NumberFormat("en-US",{style:"percent",minimumFractionDigits:2}).format(val):''}/>
                        <Input jsxId={'currency_code'} field={'currency_code'} absolute={true} size={'xs'} lang={'en'} x={'36px'} y={'44px'} width={'44px'} tabIndex={'5'} color={'#000000'} disableClear={true} align={'left'} data={this.state.data?.currency_code} maxlength={3}/>
                        <Box jsxId={'Box1829'} absolute={true} x={'320px'} y={'32px'} width={'72px'} height={'48px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Label jsxId={'Label1836'} sm={true} absolute={true} x={'320px'} y={'16px'} width={'72px'} height={'16px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'ACE Rate'}/>
                        <Button jsxId={'Command1841'} absolute={true} size={'xs'} x={'408px'} y={'44px'} width={'48px'} height={'24px'} outline={true} theme={'success'} tip={null}>
                            Apply
                        </Button>
                        <Box jsxId={'Box1842'} absolute={true} x={'396px'} y={'32px'} width={'72px'} height={'48px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Label jsxId={'Label1843'} sm={true} absolute={true} x={'396px'} y={'16px'} width={'72px'} height={'16px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Calculate'}/>
                        <Input jsxId={'Text1844'} field={'export_date'} absolute={true} size={'xs'} lang={'en'} x={'108px'} y={'44px'} width={'100px'} tabIndex={'7'} color={'#000000'} disableClear={true} align={'center'} locked={true} calendar={{format:'MM-DD-YYYY'}} data={this.state.data?.export_date}/>
                        <Label jsxId={'Label1846'} sm={true} absolute={true} x={'96px'} y={'16px'} width={'124px'} height={'16px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'} text={'Export Date'}/>
                        <Box jsxId={'Box1847'} absolute={true} x={'96px'} y={'32px'} width={'124px'} height={'48px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Box jsxId={'Box1850'} absolute={true} x={'224px'} y={'32px'} width={'92px'} height={'48px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                    </TabsContent>
                    <TabsContent jsxId={'eDoc'} id={'eDoc'} text={'eDoc'}>
                        <CTable jsxId={'sub_mbl_o_hbl_list_doc'} absolute={true} x={'24px'} y={'76px'} width={'800px'} height={'300px'} scroll={true} headerTheme={'primary'} hover={true} select={false} sm={true} fontSm={true} source={'v_doc_query_general'} data={this.state.tab_sub_mbl_o_hbl_list_doc_data} ref={c=>this.sub_mbl_o_hbl_list_doc=c} page={this.state.tab_sub_mbl_o_hbl_list_doc_page} dataCount={this.state.tab_sub_mbl_o_hbl_list_doc_count} onSelectPage={this.getTableData('sub_mbl_o_hbl_list_doc','v_doc_query_general',null)} showNumbers={50} onFilter={this.filterHandler('sub_mbl_o_hbl_list_doc')} onSort={this.sortHandler('sub_mbl_o_hbl_list_doc')} edit={this.state.EdocEditSw} noReplace={"edit"} newBar={false} onDelete={this.deleteEdoc}>
                            <Table.Header jsxId={'sub_mbl_o_hbl_list_doc-doc_id'} field={'doc_id'} text={'Doc ID'} width={'56px'} align={'center'} color={'#000000'} dataType={'number'} foot={false} type={''} disabled={true}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_list_doc-doc_type_code'} field={'doc_type_code'} text={'Doc Type'} width={'84px'} align={''} color={''} dataType={'text'} foot={false} type={'combo'} combo={{
                                onSearch:ComboSearch('doc_type_code','q_doc_tb_type',null),
                                searchColumn:'doc_type_code',
                                width:'268px',
                                header:false,
                                filterColumns:[
                                    {field:'doc_type_desc',width:'192px'},
                                    {field:'doc_type_code',width:'76px'}
                                ]
                            }} onEdit={(index,val,row,callback)=>{
                                this.sub_mbl_o_hbl_list_doc.state.data[index]["doc_type_code"]=row?row["doc_type_code"]:"";
                                this.sub_mbl_o_hbl_list_doc.state.data[index]["doc_type_desc"]=row?row["doc_type_desc"]:"";
                            }}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_list_doc-doc_type_desc'} field={'doc_type_desc'} text={'Doc Type Desc'} width={'128px'} align={'left'} color={'#000000'} dataType={'text'} foot={false} type={''} disabled={true}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_list_doc-created_date'} field={'created_date'} text={'Date Uploaded'} width={'100px'} align={'center'} color={'#000000'} dataType={'number'} onFormat={val=>val?moment(val).format('MM-DD-YYYY'):''} foot={false} type={'calendar'} disabled={true}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_list_doc-doc_note'} field={'doc_note'} text={'Note'} width={'160px'} align={'left'} color={'#000000'} dataType={'text'} foot={false} type={''}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_list_doc-Preview'} field={'Preview'} text={'Preview'} width={'56px'} align={'center'} color={'#0000ff'} dataType={'number'} onFormat={val=><u className='print-default'>{val}</u>} onDoubleClick={this.openPdf} foot={false} type={''} disabled={true} noReplace={"onFormat,onDoubleClick"}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_list_doc-Download'} field={'Download'} text={'Download'} width={'68px'} align={'center'} color={'#0000ff'} dataType={'number'} onFormat={(val,row)=><a className='print-default' href={'/Api/Doc/Download?id='+row["doc_id"]+'&group='+JSON.parse(sessionStorage.getItem("user")).company_code} target='_blank' >{val}</a>} onDoubleClick={this.open('','')} foot={false} type={''} disabled={true} noReplace={"onFormat,onDoubleClick"}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_list_doc-extention_type'} field={'extention_type'} text={'Extention'} width={'64px'} align={'center'} color={'#000000'} dataType={'text'} foot={false} type={''} disabled={true}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_list_doc-file_size'} field={'file_size'} text={'Size'} width={'68px'} align={'center'} color={'#000000'} dataType={'number'} foot={false} type={''} disabled={true}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_list_doc-dis_sw'} field={'dis_sw'} text={'DIS'} width={'40px'} align={'center'} color={''} dataType={'bool'} onFormat={val=><i className={"text-primary far "+ (!!val?"fa-check-circle":"fa-circle")}/>} foot={false} type={'checkbox'} disabled={true}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_list_doc-doc_url'} field={'doc_url'} text={'Doc URL'} width={'148px'} align={'left'} color={'#000000'} dataType={'text'} foot={false} type={''} disabled={true}/>
                            <Table.Header jsxId={'sub_mbl_o_hbl_list_doc-house_no'} field={'house_no'} text={'House No.'} width={'128px'} align={'left'} color={'#000000'} dataType={'text'} foot={false} type={''} disabled={true}/>
                        </CTable>
                        <Button jsxId={'btn9UploadCI'} absolute={true} size={'xs'} x={'752px'} y={'20px'} width={'72px'} height={'40px'} outline={true} theme={'primary'} tip={null} onClick={this.openDoc}>
                            Upload eDoc
                        </Button>
                        <Button jsxId={'btn3VieweDocLine'} absolute={true} size={'xs'} x={'624px'} y={'28px'} width={'52px'} height={'20px'} outline={true} theme={'primary'} tip={null} onClick={()=>{this.setEdocEdis(false)}}>
                            View
                        </Button>
                        <Button jsxId={'btn3EditeDocLine'} absolute={true} size={'xs'} x={'680px'} y={'28px'} width={'52px'} height={'20px'} outline={true} theme={'dark'} tip={null} onClick={()=>{this.setEdocEdis(true)}}>
                            Edit
                        </Button>
                        <Box jsxId={'Box1743'} absolute={true} x={'612px'} y={'12px'} width={'132px'} height={'52px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <TextArea jsxId={'test_note'} field={'test_note'} absolute={true} size={'xs'} lang={'en'} x={'108px'} y={'440px'} width={'128px'} tabIndex={'4'} color={'#000000'} disableClear={true} height={'20px'} data={this.state.data?.test_note} maxlength={200}/>
                        <Label jsxId={'Label1802'} sm={true} absolute={true} x={'44px'} y={'440px'} width={'56px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Brief'}/>
                        <CCheckbox jsxId={'isf_sw'} field={'isf_sw'} absolute={true} x={'316px'} y={'412px'} checked={this.state.data?.isf_sw}/>
                        <Label jsxId={'Label1702'} sm={true} absolute={true} x={'288px'} y={'408px'} width={'24px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'ISF'}/>
                        <CCheckbox jsxId={'ci_sw'} field={'ci_sw'} absolute={true} x={'316px'} y={'444px'} checked={this.state.data?.ci_sw}/>
                        <Label jsxId={'Label1706'} sm={true} absolute={true} x={'288px'} y={'440px'} width={'20px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'CI'}/>
                        <CCheckbox jsxId={'an_sw'} field={'an_sw'} absolute={true} x={'372px'} y={'412px'} checked={this.state.data?.an_sw}/>
                        <Label jsxId={'Label1708'} sm={true} absolute={true} x={'344px'} y={'408px'} width={'24px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'AN'}/>
                        <CCheckbox jsxId={'ci_hs_complete_sw'} field={'ci_hs_complete_sw'} absolute={true} x={'372px'} y={'444px'} checked={this.state.data?.ci_hs_complete_sw}/>
                        <Label jsxId={'Label1710'} sm={true} absolute={true} x={'344px'} y={'440px'} width={'24px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'HS'}/>
                        <Input jsxId={'test_by_code'} field={'test_by_code'} absolute={true} size={'xs'} lang={'en'} x={'108px'} y={'408px'} width={'128px'} tabIndex={'9'} color={'#000000'} disableClear={true} align={'left'} data={this.state.data?.test_by_code} maxlength={20}/>
                        <Label jsxId={'Label1698'} sm={true} absolute={true} x={'44px'} y={'408px'} width={'56px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Test By'}/>
                        <Box jsxId={'Box1778'} absolute={true} x={'28px'} y={'396px'} width={'232px'} height={'80px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Box jsxId={'Box1779'} absolute={true} x={'272px'} y={'396px'} width={'128px'} height={'80px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <TextArea jsxId={'test_rem'} field={'test_rem'} absolute={true} size={'xs'} lang={'en'} x={'536px'} y={'408px'} width={'180px'} tabIndex={'10'} color={'#000000'} disableClear={true} height={'56px'} data={this.state.data?.test_rem} maxlength={250}/>
                        <Box jsxId={'Box1811'} absolute={true} x={'520px'} y={'396px'} width={'212px'} height={'80px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                        <Button jsxId={'btn3HSComplete'} absolute={true} size={'xs'} x={'428px'} y={'416px'} width={'68px'} height={'44px'} outline={true} theme={'primary'} tip={null}>
                            CI Line Complete
                        </Button>
                        <Box jsxId={'Box1809'} absolute={true} x={'416px'} y={'404px'} width={'92px'} height={'64px'} borderColor={'rgb(128,128,128)'} borderWidth={'1px'}/>
                    </TabsContent>
                    <TabsContent jsxId={'iTrace'} id={'iTrace'} text={'iTrace'} onClick={this.iTraceClick}>
                    </TabsContent>
                </Tabs>
                <Box jsxId={'Boxheadline'} absolute={true} x={'0px'} y={'0px'} width={'680px'} height={'24px'} backColor={'rgb(53,88,117)'} borderColor={'rgb(0,0,0)'} borderWidth={'1px'}/>
                <Label jsxId={'abi_entry_id'} sm={true} absolute={true} x={'40px'} y={'0px'} width={'76px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} field={'abi_entry_id'} text={this.state.data?.abi_entry_id}/>
                <Label jsxId={'lbl_efc_branch_id'} sm={true} absolute={true} x={'4px'} y={'0px'} width={'28px'} height={'20px'} align={'left'} color={'rgb(255,255,255)'} text={'Seq'}/>
                <Button jsxId={'btn0Delete'} absolute={true} size={'xs'} x={'736px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'times-circle'} onClick={this.deleteData} theme={'danger'} tip={'Delete'}>
                    
                </Button>
                <Button jsxId={'btn0Clone'} absolute={true} size={'xs'} x={'764px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'clone'} onClick={this.cloneData} theme={'dark'} tip={'Clone'}>
                    
                </Button>
                <Button jsxId={'btn0Reload'} absolute={true} size={'xs'} x={'708px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'sync-alt'} onClick={this.showHandler} theme={'success'} tip={'Refresh'}>
                    
                </Button>
                <Button jsxId={'btn0Save'} absolute={true} size={'xs'} x={'820px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'save'} onClick={this.saveData} theme={'success'} tip={'Save'}>
                    
                </Button>
                <Button jsxId={'btn0Add'} absolute={true} size={'xs'} x={'792px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'folder-plus'} onClick={this.newData} theme={'dark'} tip={'Add'}>
                    
                </Button>
                <Button jsxId={'btn0Print'} absolute={true} size={'xs'} x={'680px'} y={'0px'} width={'28px'} height={'24px'} outline={true} icon={'print'} theme={'dark'} tip={'Print'} onClick={()=>{
                    this.window.resize(1000,800)
                }}>
                    
                </Button>
                <WModal ref={c=>this.modal=c}/>
            </Form>
        );}
}

export default FMblHbl;
