import { ComponentProps } from '@clake/react-bootstrap4';
import React from 'react';

const defIndex = 100;

interface Props extends ComponentProps {
    
}

interface State {
    showWindows:any[]
}

export class WindowGroup extends React.Component<Props,State> {
    windows:any
    opens:string[]
    windowList:any
    currentActive:string
    constructor(props:any) {
        super(props);

        this.state = {
            showWindows:[],
        };
        //ref window components
        this.windows = {};
        //opened window list
        this.opens = [];
        //windows
        this.windowList = {};
        //current active window
        this.currentActive = '';

        React.Children.map(this.props.children,(item)=>{
            this.windowList[item.props.name] = item;
        });
    }

    componentDidMount() {

    }

    /**
     * open window
     * @param name string
     * @param params object
     */
    open(name:string,params:any) {
        if (this.currentActive) {
            this.windows[this.currentActive].setActive(false);
            this.currentActive = name;
        }
        if (this.opens.indexOf(name) !== -1) {
            this.changeWindowIndex(name);
            this.windows[name].show({
                params:params
            });
            return;
        }

        if (this.windowList[name]) {
            if (this.state.showWindows.indexOf(name) !== -1) {
                this.show(name,params);
                return;
            }
            let showWindows = this.state.showWindows;
            showWindows.push(name);
            this.setState({
                showWindows: showWindows,
            },()=>{
                this.show(name,params);
            });
        }
    }

    show(name:string,params:any) {
        let option = {
            x:this.opens.length*20+10,
            y:this.opens.length*20+10,
            params:params
        };
        this.windows[name].show(option);
        this.opens.push(name);
        this.changeWindowIndex(name);
    }

    changeWindowIndex(name:string) {
        if (this.currentActive) {
            this.windows[this.currentActive].setActive(false);
            this.currentActive = name;
        }
        this.opens.splice(this.opens.indexOf(name),1);
        this.opens.push(name);
        this.opens.forEach((key,index)=>{
            this.windows[key].setActive(key === name);
            this.windows[key].setIndex(defIndex+index);
        });
    }

    removeWindowOpens(name:string) {
        this.opens.splice(this.opens.indexOf(name),1);
        this.opens.forEach((key,index)=>{
            this.windows[key].setIndex(defIndex+index);
        });
        // let showWindows = this.state.showWindows.slice(0);
        // showWindows.splice(showWindows.indexOf(name),1);
        // this.setState({
        //     showWindows: showWindows,
        // });
    }

    close(name:string) {
        if (this.windows[name]) {
            this.windows[name].close();
        }
    }

    render() {
        return this.state.showWindows.map((name)=>{
            let item = this.windowList[name];
            item.props.parent = this;
            item.props.ref = (c:any)=>this.windows[name]=c;
            return React.cloneElement(item,item.props);
        });
    }

    // render() {
    //     return React.Children.map(this.props.children,(item)=>{
    //         item.props.parent = this;
    //         item.props.ref = c=>this.windows[item.props.name]=c;
    //         return React.cloneElement(item,item.props,item.props.children);
    //     })
    // }
}

export default WindowGroup;