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
	Form,
} from '@clake/react-bootstrap4';
import {
    CTable,
	Window,
	WModal
} from '../../../src/index'
import {GetData,ComboSearch,ProcessData,ajaxPostUrl} from '../../common/DataService';
class FHtsUsZzChangeHsCode extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'f_hts_us_zz_change_hs_code';
		this.title = 'Change HS Code - Goods Desc';
        if (!this.props.width) {
            this.width = '600px';
        }
        if (!this.props.height) {
            this.height = '324px';
        }
		this.source = 's_hts_us_zz_change_hs_code';
		this.process = 't_oem_hs_code_summary';
		if (this.props.parent instanceof Window) {
            //window 窗体对像
            this.window = this.props.parent;
            //window 管理对像
            this.manage = this.window.parent;
            this.window.params = this.window.params||{};
            //传送的窗体参数
            this.params = this.window.params;
        }

		this.state = {
			data:{
                hs_code:'1',
                goods_desc:"asdfasd",
                disclaimed_code:'asdfas33',
            }
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
        this.setState({
			data:{
                OldHSCode:this.window.params.hs_code,
                OldGoodsDesc:this.window.params.goods_desc,
                disclaimed_code:this.window.params.disclaimed_code,
                oem_id:this.window.params.type=="O"?this.window.params.master_id:"",
                aem_id:this.window.params.type=="A"?this.window.params.master_id:""
            }
        });
    };

    closeHandler = ()=>{
        
    };

    fieldChangeHandler = (field,val,row,type,textField)=>{
        let data = this.state.data;
        data[field] = val;
        if(field=="hs_code"){
            data["disclaimed_code"]=row?row["disclaimed_code"]??"":"";
        }
        this.setState({data:data});
    };
	
    changeHsCode =()=>{
        // let cvmTypeCode =JSON.parse(sessionStorage.getItem("user")).cvm_type_code;
        let cvmTypeCode="EF"
        if(!(cvmTypeCode=="BR"||cvmTypeCode=="EF"))
        {
            this.modal.alert({content:'Only broker can change',title:"alert"});  
            return;
        }
        if(!this.state.data.hs_code&&!this.state.data.goods_desc&&!this.state.data.disclaimed_code)
        {
            this.modal.alert({content:'HS Code, Goods desc and Discliam Reason is required',title:"alert"});  
        }else{
            this.setState({data:{
                oem_id:this.window.params.type=="O"?this.window.params.master_id:"",
                aem_id:this.window.params.type=="A"?this.window.params.master_id:"",
                OldHSCode:this.window.params.hs_code,
                OldGoodsDesc:this.window.params.goods_desc,
                hs_code:(this.state.data.hs_code??"")==""?this.window.params.hs_code:this.state.data.hs_code,
                goods_desc:(this.state.data.goods_desc??"")==""?this.window.params.goods_desc:this.state.data.goods_desc
            }},()=>{
                this.modal.loading("process...")
                this.modal.close();
                this.window.close();
                // setTimeout(() => {
                //     this.modal.close();
                //     this.window.close();
                // }, 500);
            });
        }
    }
    
    openHts=(code)=>{
        if(code) {
            this.manage.open('f_hts_us',{id:code});
        }
    }

    render() {
        return (
            <Form ref={c=>this.form=c} onChange={this.fieldChangeHandler}>
                <Button tip={'Batch update'} jsxId={'btn3ChangetoNewHS'} absolute={true} size={'xs'} x={'456px'} y={'24px'} width={'112px'} height={'28px'} outline={true} theme={'danger'} onClick={this.changeHsCode}>
                    Batch Update
                </Button>
                <Input jsxId={'oldHSCode'} field={'OldHSCode'} absolute={true} size={'xs'} x={'140px'} y={'116px'} width={'128px'} tabIndex={'2'} align={'center'} readOnly={true} data={this.state.data?.OldHSCode}/>
                <Label jsxId={'Label1018'} sm={true} absolute={true} x={'52px'} y={'116px'} width={'80px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'HS Code'}/>
                <Box jsxId={'Box971'} absolute={true} x={'32px'} y={'88px'} width={'260px'} height={'200px'} borderColor={'rgb(0,0,0)'} borderWidth={'1px'}/>
                <TextArea jsxId={'OldGoodsDesc'} field={'OldGoodsDesc'} absolute={true} size={'xs'} x={'52px'} y={'176px'} width={'216px'} tabIndex={'3'} height={'68px'} readOnly={true} data={this.state.data?.OldGoodsDesc}/>
                <Label jsxId={'Label1023'} sm={true} absolute={true} x={'52px'} y={'152px'} width={'84px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'Goods desc'}/>
                <Label jsxId={'Label976'} sm={true} absolute={true} x={'293px'} y={'68px'} width={'276px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(51,51,51)'} text={'New HS Code / Goods'}/>
                <Label jsxId={'Label1024'} sm={true} absolute={true} x={'32px'} y={'68px'} width={'260px'} height={'20px'} align={'center'} color={'rgb(255,255,255)'} backColor={'rgb(51,51,51)'} text={'Original HS Code - Goods'}/>
                <Box jsxId={'Box1025'} absolute={true} x={'292px'} y={'88px'} width={'276px'} height={'200px'} borderColor={'rgb(0,0,0)'} borderWidth={'1px'}/>
                <TextArea jsxId={'goods_desc'} field={'goods_desc'} absolute={true} size={'xs'} x={'312px'} y={'176px'} width={'236px'} tabIndex={'4'} height={'64px'} data={this.state.data?.goods_desc} maxlength={250}/>
                <Label jsxId={'Label1036'} sm={true} absolute={true} x={'314px'} y={'152px'} width={'132px'} height={'20px'} align={'left'} color={'rgb(0,0,0)'} text={'New Goods Desc'}/>
                <Input jsxId={'hs_code'} field={{key:'hs_code',text_key:'hs_code',combo_key:'hs_code'}} size={'xs'} absolute={true} x={'408px'} y={'116px'} width={'140px'} align={'center'} combo={{
                    onSearch:ComboSearch('hs_code','q_hs_us'),
                    searchColumn:'hs_code',
                    width:'335px',
                    header:false,
                    filterColumns:[
                        {field:'hs_code',width:'105px'},
                        {field:'hs_code_desc',width:'230px'}
                    ]
                }} data={this.state.data?.hs_code} textStyle={{color:'#007bff'}} onDblClick={(e)=>{this.openHts(this.state.data?.hs_code);}}/>
                <Label jsxId={'Label1038'} sm={true} absolute={true} x={'312px'} y={'116px'} width={'88px'} height={'17px'} align={'left'} color={'rgb(0,0,0)'} text={'New HS Code'}/>
				<WModal ref={c=>this.modal=c}/>
            </Form>
        );
    }
}

export default FHtsUsZzChangeHsCode;
