import React from 'react';
import ReactBootstrap4,{
    Container,
    Input,
    Button,
    Checkbox,
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
    Box
} from '@clake/react-bootstrap4';
class FAesMaster extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'f_aes_master';
        if (!this.props.width) {
            this.props.width = '833px';
        }
        if (!this.props.height) {
            this.props.height = '476px';
        }        
    }

    componentDidMount() {

    }

    render() {
        return (
            <React.Fragment>
                <Input size={'xs'} absolute={true} x={'95px'} y={'6px'} width={'128px'} combo={{
                    searchColumn:'name',
                    filterColumns:[
                        {field:'',width:'1441px'}        
                    ]
                }}/>
                <Label sm={true} text={'Status'} absolute={true} x={'23px'} y={'6px'} width={'68px'} height={'16px'} color={'rgb(255,255,255)'} backColor={'rgb()'}/>
                <Tabs sm={true} border={true} absolute={true} x={'0px'} y={'37px'} width={'833px'} height={'439px'}>
                    <TabsContent id='AESGENERAL' text='AES GENERAL' active>
                        <Input size={'xs'} absolute={true} x={'148px'} y={'36px'} width={'124px'}/>
                        <Label sm={true} text={'Shipment Ref No.'} absolute={true} x={'16px'} y={'36px'} width={'124px'} height={'20px'} color={'rgb(255,0,0)'} backColor={'rgb()'}/>
                        <Box absolute={true} x={'16px'} y={'96px'} width={'336px'} height={'80px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                        <Box absolute={true} x={'352px'} y={'312px'} width={'276px'} height={'108px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                        <Input size={'xs'} absolute={true} x={'492px'} y={'192px'} width={'112px'}/>
                        <Label sm={true} text={'Departure Date'} absolute={true} x={'368px'} y={'192px'} width={'116px'} height={'20px'} color={'rgb(255,0,0)'} backColor={'rgb()'}/>
                        <Input size={'xs'} absolute={true} x={'492px'} y={'112px'} width={'112px'} combo={{
                            searchColumn:'name',
                            filterColumns:[
                                {field:'',width:'1728px'},
                                {field:'',width:'576px'}        
                            ]
                        }}/>
                        <Label sm={true} text={'Mode Transport'} absolute={true} x={'368px'} y={'112px'} width={'116px'} height={'20px'} color={'rgb(255,0,0)'} backColor={'rgb()'}/>
                        <Input size={'xs'} absolute={true} x={'492px'} y={'328px'} width={'112px'} combo={{
                            searchColumn:'name',
                            filterColumns:[
                                {field:'',width:'1728px'},
                                {field:'',width:'576px'}        
                            ]
                        }}/>
                        <Label sm={true} text={'Type'} absolute={true} x={'448px'} y={'328px'} width={'36px'} height={'20px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                        <Input size={'xs'} absolute={true} x={'492px'} y={'140px'} width={'112px'} combo={{
                            searchColumn:'name',
                            filterColumns:[
                                {field:'',width:'1728px'},
                                {field:'',width:'720px'}        
                            ]
                        }}/>
                        <Label sm={true} text={'State of Origin'} absolute={true} x={'368px'} y={'140px'} width={'116px'} height={'20px'} color={'rgb(255,0,0)'} backColor={'rgb()'}/>
                        <Input size={'xs'} absolute={true} x={'148px'} y={'64px'} width={'124px'}/>
                        <Label sm={true} text={'MAWB/Booking No.'} absolute={true} x={'16px'} y={'64px'} width={'124px'} height={'20px'} color={'rgb(255,0,0)'} backColor={'rgb()'}/>
                        <Box absolute={true} x={'628px'} y={'176px'} width={'184px'} height={'136px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                        <Label sm={true} text={'AES Indicators'} absolute={true} x={'632px'} y={'180px'} width={'108px'} height={'20px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                        <Checkbox absolute={true} x={'780px'} y={'216px'}/>
                        <Label sm={true} text={'Related Companies'} absolute={true} x={'644px'} y={'212px'} width={'128px'} height={'20px'} color={'rgb(18,0,0)'} backColor={'rgb()'}/>
                        <Checkbox absolute={true} x={'780px'} y={'244px'}/>
                        <Label sm={true} text={'Hazardous Cargo'} absolute={true} x={'644px'} y={'240px'} width={'128px'} height={'20px'} color={'rgb(18,0,0)'} backColor={'rgb()'}/>
                        <Checkbox absolute={true} x={'780px'} y={'272px'}/>
                        <Label sm={true} text={'Routed Transaction'} absolute={true} x={'644px'} y={'268px'} width={'128px'} height={'20px'} color={'rgb(18,0,0)'} backColor={'rgb()'}/>
                        <Label sm={true} text={'Predeparture Filing'} absolute={true} x={'644px'} y={'104px'} width={'128px'} height={'20px'} color={'rgb(18,0,0)'} backColor={'rgb()'}/>
                        <Label sm={true} text={'Approved Post Departure'} absolute={true} x={'644px'} y={'132px'} width={'128px'} height={'32px'} color={'rgb(18,0,0)'} backColor={'rgb()'}/>
                        <Box absolute={true} x={'352px'} y={'96px'} width={'276px'} height={'80px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                        <Input size={'xs'} absolute={true} x={'492px'} y={'220px'} width={'112px'} combo={{
                            searchColumn:'name',
                            filterColumns:[
                                {field:'',width:'2160px'},
                                {field:'',width:'720px'},
                                {field:'',width:'2160px'}        
                            ]
                        }}/>
                        <Label sm={true} text={'Port of Export'} absolute={true} x={'368px'} y={'220px'} width={'116px'} height={'20px'} color={'rgb(255,0,0)'} backColor={'rgb()'}/>
                        <Input size={'xs'} absolute={true} x={'492px'} y={'276px'} width={'112px'} combo={{
                            searchColumn:'name',
                            filterColumns:[
                                {field:'',width:'1728px'},
                                {field:'',width:'720px'}        
                            ]
                        }}/>
                        <Label sm={true} text={'Ultimate Country'} absolute={true} x={'368px'} y={'276px'} width={'116px'} height={'20px'} color={'rgb(255,0,0)'} backColor={'rgb()'}/>
                        <Input size={'xs'} absolute={true} x={'492px'} y={'248px'} width={'112px'} combo={{
                            searchColumn:'name',
                            filterColumns:[
                                {field:'',width:'2160px'},
                                {field:'',width:'720px'},
                                {field:'',width:'2160px'}        
                            ]
                        }}/>
                        <Label sm={true} text={'Port of Unlading'} absolute={true} x={'368px'} y={'248px'} width={'116px'} height={'20px'} color={'rgb(0,0,255)'} backColor={'rgb()'}/>
                        <Input size={'xs'} absolute={true} x={'148px'} y={'112px'} width={'124px'} combo={{
                            searchColumn:'name',
                            filterColumns:[
                                {field:'',width:'2880px'},
                                {field:'',width:'864px'}        
                            ]
                        }}/>
                        <Label sm={true} text={'Carrier Name'} absolute={true} x={'32px'} y={'112px'} width={'108px'} height={'20px'} color={'rgb(255,0,0)'} backColor={'rgb()'}/>
                        <Box absolute={true} x={'16px'} y={'312px'} width={'336px'} height={'108px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                        <Input size={'xs'} absolute={true} x={'148px'} y={'140px'} width={'180px'}/>
                        <Label sm={true} text={'Conveyance'} absolute={true} x={'32px'} y={'140px'} width={'108px'} height={'20px'} color={'rgb(255,0,0)'} backColor={'rgb()'}/>
                        <Input size={'xs'} absolute={true} x={'644px'} y={'356px'} width={'144px'}/>
                        <Label sm={true} text={'Submit Date - House Doc #'} absolute={true} x={'632px'} y={'316px'} width={'176px'} height={'20px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                        <Box absolute={true} x={'352px'} y={'176px'} width={'276px'} height={'136px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                        <Input size={'xs'} absolute={true} x={'492px'} y={'356px'} width={'112px'}/>
                        <Label sm={true} text={'Inbond No.'} absolute={true} x={'368px'} y={'356px'} width={'116px'} height={'20px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                        <Input size={'xs'} absolute={true} x={'492px'} y={'384px'} width={'112px'}/>
                        <Label sm={true} text={'Entry Number'} absolute={true} x={'368px'} y={'384px'} width={'116px'} height={'20px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                        <Box absolute={true} x={'532px'} y={'36px'} width={'272px'} height={'44px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                        <Button size={'xs'} absolute={true} x={'732px'} y={'36px'} width={'72px'} height={'44px'}>Submit AES EDI</Button>
                        <Button size={'xs'} absolute={true} x={'660px'} y={'36px'} width={'72px'} height={'44px'}>Submit Delete</Button>
                        <Button size={'xs'} absolute={true} x={'588px'} y={'36px'} width={'72px'} height={'44px'}>Review Status</Button>
                        <Input size={'xs'} absolute={true} x={'280px'} y={'112px'} width={'48px'}/>
                        <Input size={'xs'} absolute={true} x={'148px'} y={'248px'} width={'180px'} combo={{
                            searchColumn:'name',
                            filterColumns:[
                                {field:'',width:'2160px'},
                                {field:'',width:'720px'}        
                            ]
                        }}/>
                        <Label sm={true} text={'Ultimate Cgnee'} absolute={true} x={'32px'} y={'248px'} width={'108px'} height={'20px'} color={'rgb(255,0,0)'} backColor={'rgb()'}/>
                        <Input size={'xs'} absolute={true} x={'148px'} y={'192px'} width={'180px'} combo={{
                            searchColumn:'name',
                            filterColumns:[
                                {field:'',width:'2160px'},
                                {field:'',width:'720px'}        
                            ]
                        }}/>
                        <Label sm={true} text={'Shipper'} absolute={true} x={'32px'} y={'192px'} width={'108px'} height={'20px'} color={'rgb(255,0,0)'} backColor={'rgb()'}/>
                        <Input size={'xs'} absolute={true} x={'148px'} y={'220px'} width={'180px'} combo={{
                            searchColumn:'name',
                            filterColumns:[
                                {field:'',width:'2160px'},
                                {field:'',width:'720px'}        
                            ]
                        }}/>
                        <Label sm={true} text={'Intermediae CN'} absolute={true} x={'32px'} y={'220px'} width={'108px'} height={'20px'} color={'rgb(255,0,0)'} backColor={'rgb()'}/>
                        <Input size={'xs'} absolute={true} x={'148px'} y={'276px'} width={'180px'} combo={{
                            searchColumn:'name',
                            filterColumns:[
                                {field:'',width:'2160px'},
                                {field:'',width:'720px'}        
                            ]
                        }}/>
                        <Label sm={true} text={'Forwarder'} absolute={true} x={'32px'} y={'276px'} width={'108px'} height={'20px'} color={'rgb(255,0,0)'} backColor={'rgb()'}/>
                        <Box absolute={true} x={'16px'} y={'176px'} width={'336px'} height={'136px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                        <Box absolute={true} x={'628px'} y={'312px'} width={'184px'} height={'108px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                        <Input size={'xs'} absolute={true} x={'148px'} y={'328px'} width={'180px'}/>
                        <Label sm={true} text={'License No.'} absolute={true} x={'32px'} y={'328px'} width={'108px'} height={'20px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                        <Input size={'xs'} absolute={true} x={'148px'} y={'384px'} width={'180px'}/>
                        <Label sm={true} text={'Authentication'} absolute={true} x={'32px'} y={'384px'} width={'108px'} height={'20px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                        <Input size={'xs'} absolute={true} x={'148px'} y={'356px'} width={'180px'}/>
                        <Label sm={true} text={'ECCN INFO'} absolute={true} x={'32px'} y={'356px'} width={'108px'} height={'20px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                        <Checkbox absolute={true} x={'424px'} y={'332px'}/>
                        <Label sm={true} text={'Inbond'} absolute={true} x={'368px'} y={'328px'} width={'52px'} height={'20px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                        <Input size={'xs'} absolute={true} x={'644px'} y={'384px'} width={'144px'}/>
                        <Input size={'xs'} absolute={true} x={'280px'} y={'64px'} width={'104px'}/>
                        <Label sm={true} text={'ITN No.'} absolute={true} x={'280px'} y={'36px'} width={'84px'} height={'20px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                    </TabsContent>
                    <TabsContent id='ITEM' text='ITEM'>
                        <Table absolute x={'16px'} y={'80px'} width={'796px'} height={'340px'} scroll={true} headerTheme={'light'} hover={true} select={true} sm={true} fontSm={true}>
                            <Table.Header text={'Seq No.'} field={'aes_detail_id'} width={'56px'}/>
                            <Table.Header text={'Schedule B'} field={'ScheduleB'} width={'92px'}/>
                            <Table.Header text={'Description'} field={'description'} width={'188px'}/>
                            <Table.Header text={'Qty'} field={'qty_1'} width={'60px'}/>
                            <Table.Header text={'Unit'} field={'unit_1'} width={'48px'}/>
                            <Table.Header text={'Value'} field={'value_us'} width={'76px'}/>
                            <Table.Header text={'Gross Wgt'} field={'gross_weight'} width={'76px'}/>
                            <Table.Header text={'Export Code'} field={'export_code'} width={'68px'}/>
                            <Table.Header text={'License Type'} field={'license_type'} width={'72px'}/>
                            <Table.Header text={'Origin'} field={'origin_goods_code'} width={'52px'}/>
                            <Table.Header text={'Vehicle ID'} field={'vehicle_id'} width={'96px'}/>
                            <Table.Header text={'Vehicle Title'} field={'vehicle_title'} width={'96px'}/>
                            <Table.Header text={'Type'} field={'vehicle_id_type'} width={'60px'}/>
                            <Table.Header text={'Vehicle Title State'} field={'vehicle_title_state'} width={'96px'}/>
                        </Table>
                        <Box absolute={true} x={'540px'} y={'32px'} width={'272px'} height={'36px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                        <Button size={'xs'} absolute={true} x={'732px'} y={'32px'} width={'80px'} height={'32px'}>Add Item</Button>
                    </TabsContent>
                    <TabsContent id='CONTAINER' text=' CONTAINER'>
                        <Box absolute={true} x={'440px'} y={'40px'} width={'368px'} height={'80px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                        <Input size={'xs'} absolute={true} x={'456px'} y={'188px'} width={'324px'}/>
                        <Label sm={true} text={'Submit By Email Address'} absolute={true} x={'456px'} y={'164px'} width={'184px'} height={'20px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                        <Box absolute={true} x={'440px'} y={'248px'} width={'368px'} height={'84px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                        <Input size={'xs'} absolute={true} x={'656px'} y={'264px'} width={'124px'}/>
                        <Input size={'xs'} absolute={true} x={'564px'} y={'264px'} width={'84px'}/>
                        <Label sm={true} text={'Created By'} absolute={true} x={'456px'} y={'264px'} width={'100px'} height={'20px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                        <Input size={'xs'} absolute={true} x={'656px'} y={'292px'} width={'124px'}/>
                        <Input size={'xs'} absolute={true} x={'564px'} y={'292px'} width={'84px'}/>
                        <Label sm={true} text={'Modified By'} absolute={true} x={'456px'} y={'292px'} width={'100px'} height={'20px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                        <Table absolute x={'20px'} y={'40px'} width={'420px'} height={'292px'} scroll={true} headerTheme={'light'} hover={true} select={true} sm={true} fontSm={true}>
                            <Table.Header text={'Container No.'} field={'container_no'} width={'136px'}/>
                            <Table.Header text={'Seal Number'} field={'seal_no1'} width={'120px'}/>
                            <Table.Header text={'Type Code'} field={'container_type'} width={'76px'}/>
                        </Table>
                        <Input size={'xs'} absolute={true} x={'624px'} y={'56px'} width={'156px'}/>
                        <Label sm={true} text={'Foreign Trdze  Zone'} absolute={true} x={'456px'} y={'56px'} width={'160px'} height={'20px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                        <Input size={'xs'} absolute={true} x={'708px'} y={'84px'} width={'72px'}/>
                        <Label sm={true} text={'Schedule D/K Number'} absolute={true} x={'456px'} y={'84px'} width={'160px'} height={'20px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                        <Input size={'xs'} absolute={true} x={'624px'} y={'84px'} width={'76px'}/>
                        <Input size={'xs'} absolute={true} x={'624px'} y={'136px'} width={'128px'}/>
                        <Label sm={true} text={'Submit By Code'} absolute={true} x={'456px'} y={'136px'} width={'160px'} height={'20px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                        <Box absolute={true} x={'440px'} y={'120px'} width={'368px'} height={'128px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'}/>
                    </TabsContent>
                </Tabs>
            </React.Fragment>
        );
    }
}

export default FAesMaster;
