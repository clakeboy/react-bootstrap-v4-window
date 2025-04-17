import React,{ Component } from "react"; 
import PropTypes from 'prop-types';
import {
    Load,
    Common
} from '@clake/react-bootstrap4';

export class Loader extends Component {
    static defaultProps = {
        loadPath:PropTypes.string.isRequired
    };

    constructor(prop) {
        super(prop);
        this.state = {
            instance:undefined,
            noFound:false
        };
    }

    componentDidMount() {
        this.loadComponent(this.props.loadPath);
    }

    UNSAFE_componentWillReceiveProps(nextProp) {
        if (this.props.loadPath !== nextProp.loadPath) {
            this.setState({
                instance:undefined,
                noFound:false
            },()=>{
                this.loadComponent(nextProp.loadPath);
            });
        }
    }

    explainUrl(path) {
        const arr = path.split('/');
        arr.shift();
        let module = arr.pop();
        module = Common.under2hump(module??'')
        const ext_path = arr.length > 0 ? '/' : '';
        return ext_path + arr.join('/') + "/" + module;
    }

    loadComponent(loadPath) {
        const filePath = this.explainUrl(loadPath);
        this.props.import(filePath).then(component=>{
            if (typeof component === "string") {
                this.setState({
                    noFound:true
                });
            } else {
                this.setState({
                    instance:component
                });
            }
        });
    }

    render() {
        if (this.state.instance) {
            return this.renderComponent(this.state.instance)
        } else {
            return (
                // eslint-disable-next-line react/react-in-jsx-scope
                <div className='text-center mt-5'>
                    {this.state.noFound?'没有找到模块':<Load>模块加载中</Load>}
                </div>
            );
        }
    }

    renderComponent(instance) {
        const Instance = instance;
        const props = Object.assign({},this.props,{import:null})
        return <Instance {...props}/>;
    }
}

export default Loader;