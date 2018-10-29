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
class AEfcConsole extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'a_efc_console';
        if (!this.props.width) {
            this.props.width = '600px';
        }
        if (!this.props.height) {
            this.props.height = '536px';
        }        
    }

    componentDidMount() {

    }

    render() {
        return (
            <React.Fragment>
                <Button size={'xs'} absolute={true} x={'48px'} y={'52px'} width={'116px'} height={'48px'}>Build Table Field && Index Relation</Button>
                <Button size={'xs'} absolute={true} x={'240px'} y={'104px'} width={'116px'} height={'48px'}>Update  efc=>S_efc</Button>
                <Button size={'xs'} absolute={true} x={'48px'} y={'108px'} width={'116px'} height={'44px'}>Update Table efc=>S_efc</Button>
                <Box absolute={true} x={'16px'} y={'40px'} width={'176px'} height={'176px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'} backColor={'255,255,255'}/>
                <Label sm={true} text={'Maintain Table'} absolute={true} x={'16px'} y={'16px'} width={'176px'} height={'20px'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'}/>
                <Box absolute={true} x={'208px'} y={'40px'} width={'180px'} height={'172px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'} backColor={'255,255,255'}/>
                <Label sm={true} text={'Maintain Form'} absolute={true} x={'208px'} y={'16px'} width={'180px'} height={'20px'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'}/>
                <Input size={'xs'} absolute={true} x={'64px'} y={'496px'} width={'520px'}/>
                <Label sm={true} text={'Status'} absolute={true} x={'16px'} y={'496px'} width={'48px'} height={'20px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                <Button size={'xs'} absolute={true} x={'436px'} y={'108px'} width={'112px'} height={'44px'}>Build T4</Button>
                <Button size={'xs'} absolute={true} x={'240px'} y={'52px'} width={'116px'} height={'44px'}>Build Form<br/>ALL Tasks</Button>
                <Box absolute={true} x={'404px'} y={'40px'} width={'180px'} height={'172px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'} backColor={'255,255,255'}/>
                <Label sm={true} text={'Maintain Label'} absolute={true} x={'404px'} y={'16px'} width={'180px'} height={'20px'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'}/>
                <Button size={'xs'} absolute={true} x={'44px'} y={'264px'} width={'112px'} height={'36px'}>Convert<br/>SQL Table</Button>
                <Button size={'xs'} absolute={true} x={'176px'} y={'264px'} width={'112px'} height={'36px'}>Convert<br/>SQL View</Button>
                <Box absolute={true} x={'16px'} y={'244px'} width={'568px'} height={'232px'} borderWidth={'1px'} borderColor={'rgb(0,0,0)'} backColor={'255,255,255'}/>
                <Label sm={true} text={'Convert To SQL'} absolute={true} x={'16px'} y={'224px'} width={'568px'} height={'16px'} color={'rgb(255,255,255)'} backColor={'rgb(128,128,128)'}/>
                <Input size={'xs'} absolute={true} x={'128px'} y={'376px'} width={'436px'}/>
                <Label sm={true} text={'SQL string'} absolute={true} x={'44px'} y={'376px'} width={'80px'} height={'20px'} color={'rgb(0,0,0)'} backColor={'rgb()'}/>
                <Button size={'xs'} absolute={true} x={'304px'} y={'264px'} width={'124px'} height={'36px'}>Convert Data<br/>OP Only</Button>
                <Button size={'xs'} absolute={true} x={'444px'} y={'264px'} width={'120px'} height={'36px'}>Convert<br/>All Data</Button>
                <Button size={'xs'} absolute={true} x={'444px'} y={'312px'} width={'120px'} height={'36px'}>Clean Database</Button>
                <Button size={'xs'} absolute={true} x={'44px'} y={'312px'} width={'112px'} height={'36px'}>Build Relation</Button>
                <Button size={'xs'} absolute={true} x={'436px'} y={'52px'} width={'112px'} height={'48px'}>Ben' Temperately Build Label</Button>
                <Button size={'xs'} absolute={true} x={'176px'} y={'312px'} width={'112px'} height={'36px'}>Convert Data<br/>t_z</Button>
                <Button size={'xs'} absolute={true} x={'304px'} y={'312px'} width={'124px'} height={'36px'}>Clean && Convert OP only</Button>
                <Button size={'xs'} absolute={true} x={'44px'} y={'404px'} width={'80px'} height={'48px'}>Convert<br/>All Table && Data</Button>
                <Button size={'xs'} absolute={true} x={'240px'} y={'160px'} width={'116px'} height={'40px'}>Build Button TIP</Button>
                <Button size={'xs'} absolute={true} x={'48px'} y={'160px'} width={'116px'} height={'44px'}>Run SQL</Button>
                <Button size={'xs'} absolute={true} x={'436px'} y={'160px'} width={'116px'} height={'40px'}>Set Primay Key<br/>CargoTest</Button>
            </React.Fragment>
        );
    }
}

export default AEfcConsole;
