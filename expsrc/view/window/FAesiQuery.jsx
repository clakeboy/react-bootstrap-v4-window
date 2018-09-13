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
class FAesiQuery extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'f_aesi_query';
        this.parent = this.props.parent || null;
        if (!this.props.width) {
            this.props.width = '867px';
        }
        if (!this.props.height) {
            this.props.height = '444px';
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <React.Fragment>
                <Table absolute x={'0px'} y={'44px'} width={'865px'} height={'392px'} scroll={true} headerTheme={'light'} hover={true} select={true} sm={true} fontSm={true}>
                    <Table.Header text={'Seq No.'} field={'cvm_address_id'} width={'60px'}/>
                    <Table.Header text={'Company Name'} field={'company_name'} width={'168px'}/>
                    <Table.Header text={'Type'} field={'cvm_type_desc'} width={'120px'}/>
                    <Table.Header text={'City'} field={'city'} width={'84px'}/>
                    <Table.Header text={'State'} field={'us_state_desc'} width={'72px'}/>
                    <Table.Header text={'Short Name'} field={'cvm_short_name'} width={'132px'}/>
                    <Table.Header text={'First Name'} field={'contact_first_name'} width={'72px'}/>
                    <Table.Header text={'Last Name'} field={'contact_last_name'} width={'72px'}/>
                    <Table.Header text={'Phone'} field={'phone'} width={'88px'}/>
                    <Table.Header text={'Country'} field={'country_desc'} width={'108px'}/>
                    <Table.Header text={'Group Code'} field={'group_code'} width={'76px'}/>
                    <Table.Header text={'Created By'} field={'created_by_code'} width={'79px'}/>
                    <Table.Header text={'Created Date'} field={'created_date'} width={'79px'}/>
                    <Table.Header text={'Modified By'} field={'modified_by_code'} width={'79px'}/>
                    <Table.Header text={'Modified Date'} field={'modified_date'} width={'79px'}/>
                </Table>
                <Input size={'xs'} absolute={true} x={'80px'} y={'5px'} width={'136px'}/>
                <Label sm={true} text={'Company'} absolute={true} x={'12px'} y={'5px'} width={'60px'} height={'19px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                <Input size={'xs'} absolute={true} x={'340px'} y={'5px'} width={'112px'} combo={{
                    searchColumn:'name',
                    filterColumns:[
                        {field:'',width:'1440px'},
                        {field:'',width:'720px'}        
                    ]
                }}/>
                <Label sm={true} text={'Status'} absolute={true} x={'248px'} y={'5px'} width={'84px'} height={'19px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                <Input size={'xs'} absolute={true} x={'340px'} y={'29px'} width={'112px'}/>
                <Label sm={true} text={'Short Name'} absolute={true} x={'248px'} y={'29px'} width={'84px'} height={'19px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                <Input size={'xs'} absolute={true} x={'80px'} y={'29px'} width={'136px'} combo={{
                    searchColumn:'name',
                    filterColumns:[
                        {field:'',width:'2736px'},
                        {field:'',width:'720px'}        
                    ]
                }}/>
                <Label sm={true} text={'Type'} absolute={true} x={'12px'} y={'29px'} width={'60px'} height={'19px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                <Input size={'xs'} absolute={true} x={'548px'} y={'5px'} width={'96px'} combo={{
                    searchColumn:'name',
                    filterColumns:[
                        {field:'',width:'1728px'},
                        {field:'',width:'720px'}        
                    ]
                }}/>
                <Label sm={true} text={'Country'} absolute={true} x={'484px'} y={'5px'} width={'56px'} height={'19px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                <Input size={'xs'} absolute={true} x={'548px'} y={'29px'} width={'96px'} combo={{
                    searchColumn:'name',
                    filterColumns:[
                        {field:'',width:'1584px'},
                        {field:'',width:'720px'}        
                    ]
                }}/>
                <Label sm={true} text={'State'} absolute={true} x={'484px'} y={'29px'} width={'56px'} height={'19px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
            </React.Fragment>
        );
    }
}

export default FAesiQuery;
