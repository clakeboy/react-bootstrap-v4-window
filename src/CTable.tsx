/** @module react-bootstrap-v4-window/CTable */

import React from 'react';
import classNames from 'classnames';
import {
    Icon,
    Pagination,
    Menu,
    Input,
    Button,
    Common,
    i18n,
    CCheckbox,
    Scroll,
    HScroll,
    ComponentProps
} from '@clake/react-bootstrap4';
import './css/CTable.less';
import Drag from "./Drag";
import CTableInput from "./CTableInput";
import CTableLang from './i18n/CTable';
import PageBar from "./PageBar";

let numberCondition:{[propName:string]:string} = {
    '=':'eq',
    '!=':'ne',
    '>':'gt',
    '>=':'gte',
    '<=':'lte',
    '<':'lt'
};

interface Props extends ComponentProps {
    //主题 ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
    theme       ?: string
    //标头主题
    headerTheme ?: string
    //标头css class
    headClass   ?: string
    //数据来源
    data        ?: any[]
    //数据总记录数
    dataCount   ?: number
    //总页数
    page        ?: number
    //第一列是否出现选择项
    select      ?: boolean
    //是否只能选中一项
    selectOnce   ?: boolean
    //是否显示标头
    header      ?: boolean
    //
    center      ?: boolean
    //数据当前页
    currentPage ?: number
    //
    striped     ?: boolean
    //是否显示边框
    bordered    ?: boolean
    //行是否有hover效果
    hover       ?: boolean
    //是否小型化显示列表
    sm          ?: boolean
    //文字最小化
    fontSm      ?: boolean
    responsive  ?: boolean
    //文字列表 left,center,right
    align       ?: string
    //是否显示树结构
    tree        ?: string
    //点击树事件
    onClickTree ?: ()=>void
    //点击事件
    onClick     ?: (row:any,idx:number,id?:string)=>void
    //选择事件
    onCheck     ?: (chk:boolean,row:any,id?:string)=>void
    //选择所有
    onCheckAll  ?: (chk:boolean,data:any[],id?:string)=>void
    //过滤事件
    onFilter    ?: (text:string, field:string, type:string, id?:string)=>void
    //排序事件
    onSort      ?: (field:string,sort_type:string, id?:string)=>void
    //是否列可移动
    move        ?: boolean
    //刷新事件
    onRefresh   ?: ()=>void
    //刷新事件按钮文字
    refreshText ?: string
    //是否漂浮
    absolute    ?: boolean
    //漂浮X坐标
    x           ?: string
    //漂浮Y坐标
    y           ?: string
    //表宽
    width       ?: string
    //表高
    height      ?: string
    // foot        : PropTypes.bool,
    //是否显示列表尾
    foot        ?: any
    //表自动随主体小设置
    position    ?: any
    //显示的页码数
    showPages   ?: number
    //显示的记录条数
    showNumbers ?: number
    //翻页事件
    onSelectPage?: (page:number,id?:string)=>void
    //是否自动换行
    noWrap      ?: boolean
    //是否启用右键菜单
    menu        ?: boolean
    //是否显示每列记录总合数
    total       ?: any
    //是否编辑模式
    edit        ?: boolean
    //是否有新增行功能
    newBar      ?: boolean
    //是否可删除
    nodel    ?: boolean
    //数据删除事件
    onDelete    ?: (row:any,idx:number,callback:(row_index:number)=>void,id?:string)=>void
    //是否启用排序
    sort        ?: boolean
    //是否启用过滤
    filter      ?: boolean
    //自定义右键菜单
    customMenu  ?: any
    //自定义显示语言
    lang        ?: any
    source      ?: string
    sourceFunc  ?: (opt:any,callback:(res:any)=>void)=>void
    //是否显示全部选取
    allSelect  ?: boolean
    //focus 是否显示焦点
    focus?: boolean
    //是否全行点选
    rowCheck?: boolean

    columnStyle?:any
    //唯一ID
    jsxId?: string
}

interface State {
    data     : any[]
    dataCount: number
    page     : number
    select   : boolean
    total    : any
    filter   : any
    selectAll: boolean //选中全部状态
    selectHalf: boolean //半选中状态
    selectRows: any[] //选中的数据列表
    focus: number //当前显示焦点
}

export class CTable extends React.Component<Props,State> {
    static defaultProps:Props = {
        data       : [],
        dataCount  : 1,
        select     : true,
        header     : true,
        foot       : true,
        currentPage: 1,
        hover      : true,
        striped    : true,
        align      : 'left',
        sm         : true,
        fontSm     : true,
        headerTheme: 'primary',
        noWrap     : true,
        bordered   : true,
        move       : true,
        menu       : true,
        showNumbers: 30,
        showPages  : 10,
        total      : null,
        lang       : 'en',
        allSelect  : true,
        rowCheck   : false,
        focus: true,
        newBar:true,
        nodel: false,
    }

    originalData: any[]
    domId:string
    select_all:boolean
    selectRows:any[]
    headerSplits:any
    sortList:any
    is_sort:boolean
    is_filter:boolean
    current_sort:any
    filter_list:any[]
    editRows:any[]
    cacheRow:any
    headers:any
    noClone:any
    lockColumns:any[]
    isLock:boolean
    filter:any
    
    width:string
    tableHeader:HTMLElement
    tableTotal:HTMLElement
    table_rows:HTMLElement
    table_head:HTMLElement
    table_body:HTMLElement
    table_total:HTMLElement
    fullButton:HTMLElement
    split:HTMLElement
    mainDom:HTMLElement
    mainMenu:Menu
    numMenu:Menu
    drag: Drag
    dragColumnLeft:number
    dragWidth:number
    allchk:CCheckbox
    isFull:boolean
    constructor(props:any) {
        
        super(props);
        this.state = {
            data     : this.props.data || [],
            dataCount: this.props.dataCount??0,
            page     : 1,
            select   : this.props.select??false,
            total    : this.props.total,
            filter   : {
                start  : '',
                end    : '',
                contain: ''
            },
            selectAll: false, //选中全部状态
            selectHalf: false, //半选中状态
            selectRows: [], //选中的数据列表
            focus: -1 //当前显示焦点
        };

        this.originalData = this.state.data.slice(0);

        this.domId = 'table-' + Common.RandomString(16);

        this.select_all = false;
        this.selectRows = [];

        this.headerSplits = [];

        this.sortList     = {};
        this.is_sort      = typeof this.props.onSort === 'function' || !!this.props.sort;
        this.is_filter      = typeof this.props.onFilter === 'function' || !!this.props.filter;
        this.current_sort = null;

        this.filter_list = [];
        this.filter = {};
        this.editRows = [];

        this.cacheRow = {};
        //列头数据
        this.headers = {};
        //不需要克隆列
        this.noClone = {};

        this.lockColumns = [];
        //lock column flag
        this.isLock = false;
        this.isFull = false;
        this.initTableWidth();
    }

    componentDidMount() {
        this.bindSplit();
    }

    UNSAFE_componentWillReceiveProps(nextProps:Props) {
        if (this.state.data !== nextProps.data) {
            if (this.props.edit) {
                if (this.equals(this.originalData,nextProps.data)) {
                    return
                }
                this.editRows     = [];
            }
            this.originalData = Common.Clone(nextProps.data);
            // if (this.allchk) {
            //     this.allchk.setHalf(false);
            //     this.selectRows = [];
            // }
            // this.select_all = false;
            // this.selectRows = [];
            let selectRows:any[] = []
            let isHalf = false
            let allchk = false
            if (nextProps.data && nextProps.data.length > 0) {
                nextProps.data.forEach((item,idx)=>{
                    if (item?.set_chk) {
                        selectRows.push(idx)
                    }
                })
                if (selectRows.length === nextProps.data.length) {
                    allchk = true
                } else {
                    if (selectRows.length>0) {
                        isHalf = true
                    }
                }
            }
            this.setState({
                data     : nextProps.data??[],
                dataCount: nextProps.dataCount??0,
                page     : nextProps.page??0,
                total    : nextProps.total,
                selectRows: selectRows,
                selectHalf: isHalf,
                selectAll: allchk,
                focus: -1
            });
        }
    }

    shouldComponentUpdate(nextProps:Props, nextState:State) {
        if (nextState.selectRows !== this.state.selectRows) {
            return true
        }
        if (this.state.filter !== nextState.filter) {
            return true;
        }
        if (nextState.total !== this.state.total) {
            return true
        }
        if (this.props.focus && nextState.focus !== this.state.focus) {
            return true
        }
        return nextState.data !== this.state.data;
    }

    equals = (a:any, b:any):boolean => {
        if (a === b) return true;
        if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
        if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b;
        if (a.prototype !== b.prototype) return false;
        let keys = Object.keys(a);
        if (keys.length !== Object.keys(b).length) return false;
        return keys.every(k => this.equals(a[k], b[k]));
    }

    initTableWidth() {
        if (this.props.width) {
            let width = 0;
            let reg    = /(\d+)(px|rem|cm|mm|pt)$/;
            let matchs = this.props.width.match(reg);
            let unit   = matchs?matchs[2]:'px';
            React.Children.map(this.props.children, (item, key) => {
                if (item.props.width) {
                    let matchs = item.props.width.match(reg);
                    width += parseInt(matchs[1]);
                    this.headers[item.props.field] = item.props;
                    if (item.props.noClone) {
                        this.noClone[item.props.field] = "";
                    }
                }
            });
            if (this.props.select) {
                width += 20;
            }
            this.width = width + unit;
        }
    }

    //inner source ********************
    sourceLoad() {
        if (typeof this.props.sourceFunc !== 'function') return;

        this.props.sourceFunc({
            source:this.props.source,
            page:this.state.page,
            number:this.props.showNumbers,
        },(res)=>{
            this.setState({
                data     : res.data,
                dataCount: res.count,
                page     : res.page,
            })
        });
    }

    sourceFilter() {
        return this.filter_list.map((item)=>{
            switch (item.type) {
                case "start":
                    return {
                        field:item.field,
                        value:`${item.text}%`,
                        flag:'like'
                    };
                case "end":
                    return {
                        field:item.field,
                        value:`%${item.text}`,
                        flag:'like'
                    };
                case "clear":
                    // this.filter = {};
                    break;
                case "":
                    return {
                        field:item.field,
                        value:item.text,
                        flag:'='
                    };
                default:
                    return {
                        field:item.field,
                        value:`%${item.text}%`,
                        flag:'like'
                    }
            }
        });
    }

    sourceOrder() {

    }

    //innter source end ***************************
    //checkbox handler
    changeHandler(row:any, i:number) {
        return (checked:boolean,e:any) => {
            let selectRows = this.setRowCheck(checked,i);
            const [allChecked, half] = this.checkAllCheckHalf(selectRows);
            this.setState({
                selectRows: selectRows,
                selectAll: allChecked,
                selectHalf: half
            })
            if (typeof this.props.onCheck === "function") {
                this.props.onCheck(checked, row,this.props.jsxId);
            }
        };
    }
    checkAllCheckHalf(selectRows:Array<any>) {
        if (!this.state.selectAll && this.props.selectOnce) {
            return [false, false];
        }
        if (selectRows.length > 0 && selectRows.length !== this.state.data.length) {
            return [false, true]
        }
        if (selectRows.length === 0) {
            return [false, false]
        } else if (selectRows.length === this.state.data.length) {
            return [true, false]
        }
        return [false, false]
    }
    setRowCheck(checked:boolean,rowIdx:number) {
        let selectRows = this.props.selectOnce?[]:this.state.selectRows.slice()

        if (checked) {
            if (!selectRows.includes(rowIdx)) {
                selectRows.push(rowIdx);
            }
        } else {
            if (selectRows.includes(rowIdx)) {
                selectRows.splice(selectRows.indexOf(rowIdx),1);
            }
        }
        return selectRows
    }

    selectAll = (checked:boolean) => {
        this.select_all = checked;
        let selectRows:any[] = []
        if (checked) {
            this.state.data.forEach((item,key)=>{
                selectRows.push(key)
            })
        }
        this.setState({
            selectRows: selectRows,
            selectAll: checked,
            selectHalf: false
        },()=>{
            if (typeof this.props.onCheckAll === 'function') {
                this.props.onCheckAll(this.state.selectAll,this.state.data,this.props.jsxId)
            }
        })
    };

    clickHandler(row:any, i:number) {
        return () => {
            if (typeof this.props.onClick === 'function') {
                this.props.onClick(row, i,this.props.jsxId);
            }
            if (this.props.select && this.props.rowCheck) {
                let row:CCheckbox = this.refs['row_'+i] as CCheckbox;
                row.changeHandler(null)
                // this.setRowCheck(!row.getChecked(),i);
                // this.checkAllCheckHalf();
            }
            if (this.props.focus) {
                this.setState({
                    focus:i === this.state.focus?-1:i
                })
            }
        }
    }

    /**
     * sort
     */
    sortHandler = (e:any) => {
        let dom       = e.currentTarget;
        let sort_type = dom.dataset.sort || 'asc';
        this.changeSort(dom, sort_type)
    };

    changeSort(dom:HTMLElement, sort_type:string) {
        if (!dom) {
            return
        }
        if (!dom.dataset.field) {
            return
        }
        this.clearSort(false);
        this.current_sort = dom.dataset.field;
        dom.dataset.sort  = sort_type === 'asc' ? 'desc' : 'asc';
        dom.classList.remove('ck-ctable-sort');
        this.sortList[dom.dataset.field] = sort_type;
        let child                        = dom.querySelector('i');
        if (!child) {
            return
        }
        child.classList.remove('fa-sort', 'fa-sort-alpha-up', 'fa-sort-alpha-down');
        child.classList.add('fa-sort-alpha-' + (sort_type === 'asc' ? 'down' : 'up'));
        if (typeof this.props.onSort === 'function') {
            this.props.onSort(dom.dataset.field, sort_type, this.props.jsxId);
        } else {
            // this.localSort(dom.dataset.field,sort_type)
        }
    }

    clearSort(emitEvt:any) {
        if (this.current_sort) {
            let prv          = document.querySelector(`#${this.domId}-sort-${this.current_sort}`) as HTMLElement;
            if (!prv) return
            prv.dataset.sort = 'asc';
            prv.classList.add('ck-ctable-sort');
            let prv_child = prv.querySelector('i');
            if (!prv_child) return
            prv_child.classList.remove('fa-sort', 'fa-sort-alpha-up', 'fa-sort-alpha-down');
            prv_child.classList.add('fa-sort');
            this.sortList[this.current_sort] = null;
            this.current_sort                = null;
            if (emitEvt && typeof this.props.onSort === 'function') {
                this.props.onSort('','clear');
            } else {
                if (this.props.edit) {
                    this.setState({data:this.originalData.slice(0)})
                }
            }
            return true;
        }
        return false;
    }

    localSort(field:string, sort_type:string) {
        let desc = sort_type === 'desc';
        let data = this.state.data.slice(0);
        data.sort((a:any, b:any):number => {
            if (a[field] > b[field]) return desc ? -1 : 1;
            if (a[field] < b[field]) return desc ? 1 : -1;
            if (a[field] === b[field]) return 0;
            return 0
        });
        this.setState({data: data});
    }

    /**
     * scroll header and total foot
     * @param e
     */
    scrollHandler = (e:any) => {
        this.tableHeader.style.transform = `translateX(-${e.currentTarget.scrollLeft}px)`;
        // this.tableHeader.scrollLeft = e.currentTarget.scrollLeft;
        if (this.tableTotal) {
            // this.tableTotal.scrollLeft = e.currentTarget.scrollLeft;
            this.tableTotal.style.transform = `translateX(-${e.currentTarget.scrollLeft}px)`;
        }
    };
    /**
     * show menu list
     * @param dataType
     */
    menuContextHandler(dataType:string) {
        return (e:any) => {
            e.preventDefault();
            e.stopPropagation();
            let data = {
                field: e.currentTarget.dataset.field || '',
                data : this.state.data[e.currentTarget.dataset.row],
                index: e.currentTarget.dataset.row
            };
            if (dataType === "text") {
                this.mainMenu.show({evt: e, type: 'mouse', data: data});
            } else {
                this.numMenu.show({evt: e, type: 'mouse', data: data});
            }
        }
    }

    menuClickHandler = (field:string, data:any) => {
        switch (field) {
            case "asc":
                this.changeSort(document.querySelector(`#${this.domId}-sort-${data.field}`) as HTMLElement, 'asc');
                break;
            case "desc":
                this.changeSort(document.querySelector(`#${this.domId}-sort-${data.field}`) as HTMLElement, 'desc');
                break;
            case "delete_row":
                this.deleteRowHandler(parseInt(this.mainMenu.data.index));
                break;
            case "clone_row":
                this.cloneRow(parseInt(this.mainMenu.data.index));
                break;
        }
    };

    /**
     * filter
     * */
    localFilter(text:string, field:string, type:string) {
        let reg;
        switch (type) {
            case "start":
                reg = new RegExp(`^${text}`);
                break;
            case "end":
                reg = new RegExp(`${text}$`);
                break;
            default:
                reg = new RegExp(`${text}`);
        }
        let data = this.state.data.slice(0);
        let filter:any[] = [];
        data.forEach((item)=>{
            if (type === 'exclude') {
                if (!reg.test(item[field])) {
                    filter.push(item);
                }
            } else {
                if (reg.test(item[field])) {
                    filter.push(item);
                }
            }
        });
        this.setState({data:filter});
    }

    filterHandler(text:string, field:string, type:string) {
        this.filter_list.push({
            text:text,
            field:field,
            type:type
        });

        this.setState({
            filter: {
                start  : '',
                end    : '',
                contain: '',
                condition: '',
            }
        });
        this.mainMenu.hide(undefined);
        this.numMenu.hide(undefined);
        if (typeof this.props.onFilter === 'function') {
            this.props.onFilter(text, field, type,this.props.jsxId);
        } else {
            this.localFilter(text,field,type);
        }
    }

    clearFilter() {
        this.filter_list = [];
        let is_clean = this.clearSort(true);
        Common.map(this.filter,(item:Input)=>{
            item.setValue('')
        })
        this.setState({
            filter: {
                start  : '',
                end    : '',
                contain: '',
                equal  :'',
            }
        });
        if (typeof this.props.onFilter === 'function') {
            this.props.onFilter('', '', 'clear');
        } else {
            if (!is_clean) {
                this.setState({data:this.originalData.slice(0)});
            }
        }
    }

    filterChangeHandler(field:string) {
        return (val:any) => {
            let filter    = {...this.state.filter};
            filter[field] = val;
            this.setState({
                filter: filter
            })
        }
    }

    selectPageHandler = (page:number) => {
        if (typeof this.props.onSelectPage === 'function') {
            this.props.onSelectPage(page,this.props.jsxId);
        }
    };

    /**
     * edit mode
     */
    addNewHandler = (e:any) => {
        let data = this.state.data.slice(0);
        data.push(Object.assign({}, this.cacheRow));
        this.editRows.push(data.length - 1);
        this.setState({
            data: data,
            dataCount: data.length,
        }, () => {
            document.querySelector<HTMLElement>(`#${this.domId}-edit`)?.previousElementSibling?.querySelector<HTMLInputElement>('input:not([disabled])')?.focus()
        })
    };
    //编辑事件
    editHandler = (e:any, val:any ,row:any) => {
        const dataset = row === 'chk'?e.currentTarget.dataset:e.target.dataset
        let index = parseInt(dataset.row);
        let field = dataset.field;
        //如果是check组件
        if (row === 'chk') {
            val = val?1:0;
        }
        if (this.editRows.indexOf(index) === -1) {
            this.editRows.push(index);
            let data           = this.state.data.slice(0);
            data[index][field] = val;
            this.setState({data: data})
        } else {
            this.state.data[index][field] = val;
        }
        if (this.headers[field] && typeof(this.headers[field].onEdit) === 'function') {
            this.headers[field].onEdit(index,val,row,this.editCallback)
        }
    };
    //自定义 onEdit 事件回调函数
    editCallback = (index:number,editData:any) => {
        if (this.state.data[index]) {
            let data           = this.state.data.slice(0);
            data[index] = Object.assign(data[index],editData);
            this.setState({data: data});
        }
    };

    getEditRows() {
        let list = [];
        for (let row of this.editRows) {
            list.push(this.state.data[row]);
        }
        return list;
    }

    clearEditRows() {
        this.editRows = [];
    }

    deleteRowHandler(row_index:number) {
        if (row_index < 0 || row_index >= this.state.data.length) {
            return
        }
        if (typeof this.props.onDelete === 'function') {
            this.props.onDelete(this.state.data[row_index], row_index,this.deleteRow,this.props.jsxId);
        } else {
            this.deleteRow(row_index)
        }
    }

    deleteRow(row_index:number) {
        if (row_index < 0 || row_index >= this.state.data.length) {
            return
        }
        let data = this.state.data.slice(0);
        data.splice(row_index, 1);
        if (this.editRows.indexOf(row_index) !== -1) {
            this.editRows.splice(this.editRows.indexOf(row_index), 1);
        }
        this.editRows.forEach((item, index) => {
            if (item > row_index) {
                this.editRows[index] = item - 1;
            }
        });

        this.setState({
            data: data,
            dataCount: data.length,
        });
    }

    cloneRow(row_index:number) {
        if (row_index < 0 || row_index >= this.state.data.length) {
            return
        }
        let data = this.state.data.slice(0);
        data.push(Object.assign({}, this.state.data[row_index],this.noClone));
        this.editRows.push(data.length - 1);
        this.setState({
            data: data,
            dataCount: data.length,
        })
    }
    //全屏查看
    fullHandler = ()=>{
        if (this.isFull) {
            this.mainDom.classList.remove('ck-ctable-full')
            this.fullButton.querySelector('i')?.classList.remove("fa-compress")
            this.fullButton.querySelector('i')?.classList.add("fa-expand")
        } else {
            this.mainDom.classList.add('ck-ctable-full')
            this.fullButton.querySelector('i')?.classList.add("fa-compress")
            this.fullButton.querySelector('i')?.classList.remove("fa-expand")
        }
        this.isFull = !this.isFull
    }

    //****************************

    /**
     * 得到所有选中的行
     */
    getSelectRows() {
        return this.state.selectRows.map((item)=>{
            return this.state.data[item];
        });
    }

    /**
     * 设置选中的行
     */
    setSelectRows(key:string, list:any[]) {
        let selectRows:any[] = []
        this.state.data.forEach((row, i) => {
            if (list.includes(row[key])) {
                selectRows.push(i)
            }
        });
        let selectAll = selectRows.length > 1 && selectRows.length === this.state.data.length
        this.setState({
            selectRows: selectRows,
            selectHalf: !selectAll,
            selectAll: selectAll
        })
    }

    /**
     * binding column split
     */
    bindSplit() {
        if (this.props.move) {
            this.headerSplits.forEach((split:any) => {
                if (!this.drag) {
                    this.dragColumnLeft = 0;
                    this.dragWidth      = 0;
                    this.drag           = new Drag(this.split, split, {
                        start: (dragDom, eventDom) => {
                            let xy              = Common.GetDomXY(eventDom, this.mainDom);
                            this.dragWidth      = parseInt((eventDom?.parentNode as HTMLElement).style.width);
                            this.dragColumnLeft = (xy.left - this.table_rows.scrollLeft);
                            dragDom.style.left  = this.dragColumnLeft + 'px';
                            dragDom.classList.remove('d-none');
                            return true;
                        },
                        move : (move, dragDom, eventDom) => {
                            if (this.dragWidth + (move.x - this.dragColumnLeft) < 50) {
                                move.x = this.dragColumnLeft - this.dragWidth + 50;
                            }
                        },
                        end  : (dragDom, eventDom) => {
                            dragDom.classList.add('d-none');
                            let column_key              = eventDom.dataset.key;
                            let diff                    = parseInt(dragDom.style.left) - this.dragColumnLeft;
                            this.width                  = (parseInt(this.width) + diff) + 'px';
                            this.table_head.style.width = this.width;
                            this.table_body.style.width = this.width;
                            if (this.table_total) {
                                this.table_total.style.width = this.width;
                            }
                            document.querySelectorAll(`#${column_key}`).forEach((item:any) => {
                                item.style.width = `${this.dragWidth + diff}px`;
                            });
                            return true;
                        }
                    });
                } else {
                    this.drag.setEventDom(split);
                }
            });
        }
    }

    getClasses(name?:string) {
        let base = 'table ck-table';
        if (!!name) {
            base = classNames(base, name);
        }
        //striped
        if (this.props.striped && !this.props.edit) {
            base = classNames(base, 'table-striped');
        }
        //theme
        if (this.props.theme) {
            base = classNames(base, 'table-' + this.props.theme);
        }
        //bordered
        if (this.props.bordered) {
            base = classNames(base, 'table-bordered');
        }
        //hover
        if (this.props.hover) {
            base = classNames(base, 'table-hover');
        }
        //sm
        if (this.props.sm) {
            base = classNames(base, 'table-sm');
        }
        if (this.props.fontSm) {
            base = classNames(base, 'table-font-sm');
        }
        //responsive
        if (this.props.responsive) {
            base = classNames(base, 'table-responsive');
        }
        //nowrap
        if (this.props.noWrap) {
            base = classNames(base, 'ck-ctable-nowrap');
        }
        return base;
    }

    getMainClasses() {
        let base = 'ck-ctable-main d-flex flex-column';
        if (this.props.bordered) {
            base = classNames(base, 'border');
        }
        return classNames(base, this.props.className);
    }

    getStyles() {
        //default style
        let base:any = {};
        //width
        if (this.props.width) {
            base.width = this.props.width;
        }
        //height
        if (this.props.height) {
            base.height = this.props.height;
        }

        if (this.props.absolute) {
            base.position = 'absolute';
            base.top      = this.props.y;
            base.left     = this.props.x;
            if (typeof this.props.position === 'object') {
                base.top    = this.props.position.top || this.props.y;
                base.left   = this.props.position.left || this.props.x;
                base.right  = this.props.position.right || 'unset';
                base.bottom = this.props.position.bottom || 'unset';
                if (this.props.position.left && this.props.position.right) {
                    base.width = 'unset';
                }
                if (this.props.position.top && this.props.position.bottom) {
                    base.height = 'unset';
                }
            }
        }

        return Common.extend(base, this.props.style)
    }

    getHeaderClasses() {
        let base = 'ck-ctable-header';
        if (this.props.headerTheme) {
            base = classNames(base,'table-' + this.props.headerTheme);
        }
        return classNames(base, this.props.headClass);
    }

    getTableStyles(style?:any) {
        let base:any = {};

        if (this.width) {
            base.width = this.width;
        }

        if (style) {
            base = Object.assign({},base,style);
        }

        return base;
    }

    getBodyClasses() {
        let base = 'ck-ctable-body flex-grow-1 d-flex flex-column';

        return base;
    }

    calcLocalTotal(field:string) {
        return (e:any)=>{
            let list = this.state.data;
            let total = 0;
            list.forEach((item)=>{
                if (!!parseFloat(item[field])) {
                    total += parseFloat(item[field])
                }
            })
            let totalData = Object.assign({},this.state.total);
            totalData[field] = total.toFixed(2)
            this.setState({
                total:totalData
            })
        }
    }

    render() {
        return (
            <div ref={(c:any) => this.mainDom = c} className={this.getMainClasses()} style={this.getStyles()}>
                <div className={this.getBodyClasses()}>
                    {this.renderHeader()}
                    {this.renderRows()}
                    {this.renderTotal()}
                    {<Scroll selector={`#table-body-com-${this.domId}`}/>}
                    {<HScroll selector={`#table-body-com-${this.domId}`}/>}
                </div>
                {this.renderFoot()}
                <div ref={(c:any) => this.split = c} className='ck-split d-none'/>
            </div>
        );
    }

    renderHeader() {
        return (
            <div ref={(c:any) => this.tableHeader = c}>
                <table ref={(c:any) => this.table_head = c} id={`table-head-${this.domId}`} className={this.getClasses('')} style={this.getTableStyles(null)}>
                    <thead className={this.getHeaderClasses()}>
                    <tr>
                        {this.state.select || this.props.edit ?
                            <th style={{width:'20px',textAlign:'center'}}>
                                {this.props.edit || this.props.selectOnce ? <Icon icon='list'/> :
                                    <CCheckbox ref={(c:any) => this.allchk=c} onChange={this.selectAll} checked={this.state.selectAll} half={this.state.selectHalf}/>}
                            </th> : null}
                        {React.Children.map(this.props.children, (item, key) => {
                            this.cacheRow[item.props.field] = '';
                            if (!item || item.props.hide) {
                                return null;
                            }
                            // let align = item.props.align || this.props.align;
                            let style:any = {
                                'textAlign': 'center'
                            };
                            if (item.props.width) {
                                style.width = item.props.width;
                            }
                            let sort_icon = '';
                            if (this.sortList[item.props.field]) {
                                sort_icon = 'sort-alpha-' + (this.sortList[item.props.field] === 'asc' ? 'down' : 'up');
                            }
                            return (
                                <th onContextMenu={this.menuContextHandler('')} id={this.domId + '-' + key} data-key={'head_' + key} style={style}>
                                    {this.is_sort ?
                                        <a className='ck-ctable-sort' href='javascript://' id={`${this.domId}-sort-${item.props.field}`}
                                           data-field={item.props.field}
                                           onClick={this.sortHandler}>
                                            {item.props.text}{'\u0020'}
                                            <Icon icon={sort_icon}/></a> : item.props.text}
                                    {this.props.move ?
                                        <span ref={c => this.headerSplits.push(c)} data-key={this.domId + '-' + key} className='ck-column-split'/> : null}
                                </th>
                            );
                        })}
                    </tr>
                    </thead>
                </table>
            </div>
        )
    }

    renderRows() {
        return (
            <div ref={(c:any) => this.table_rows = c} id={`table-body-com-${this.domId}`} className='flex-grow-1 rows' onScroll={this.scrollHandler}>
                <table ref={(c:any) => this.table_body = c} id={`table-body-${this.domId}`} className={this.getClasses()} style={this.getTableStyles()}>
                    <tbody>
                    {this.state.data.map((row:any, i:number) => {
                        if (this.props.edit) {
                            return this.renderEditRow(row, i)
                        }
                        return this.renderRow(row, i,null);
                    })}
                    {this.props.edit && this.props.newBar ? this.renderEditAddRow() : null}
                    </tbody>
                </table>
                {this.props.menu ? this.renderMenu() : null}
                {this.props.menu ? this.renderNumberMenu() : null}
            </div>
        )
    }

    renderRow(row:any, i:number, parentRow?:any) {
        let checked = this.state.selectRows.indexOf(i) !== -1
        let focus = (i === this.state.focus && this.props.focus)
        let rowClass = focus ? 'ck-table-focus' : checked ? 'ck-table-selected' : undefined 
        return (
            <>
                <tr className={rowClass} onClick={this.clickHandler(row, i)}>
                    {this.state.select ?
                        <th style={{width:'20px',textAlign:'center'}}>
                            <CCheckbox ref={'row_' + i} onChange={this.changeHandler(row, i)} checked={checked}/>
                        </th> : null}
                    {React.Children.map(this.props.children, (item, key) => {
                        if (!item || item.props.hide) {
                            return null;
                        }
                        //set style
                        let style = {...this.props.columnStyle};

                        style.textAlign = item.props.align || this.props.align;
                        if (item.props.width) {
                            style.width = item.props.width;
                        }
                        let dataType;
                        switch (item.props.dataType) {
                            case "number":
                                dataType = "number";
                                break;
                            case "date":
                                dataType = "date";
                                break;
                            default:
                                dataType = "text";
                        }

                        if (item.props.children) {
                            return (
                                <td onContextMenu={this.menuContextHandler(dataType)} id={this.domId + '-' + key} data-row={`${i}`} data-field={item.props.field}
                                    className={item.props.className}
                                    key={'col_' + key}>{React.cloneElement(item, {
                                    text : item.props.text,
                                    row  : row,
                                    value: row[item.props.field]
                                })}</td>
                            );
                        } else {
                            if (item.props.type) {
                                item.props.disabled=true;
                            }
                            return <td onContextMenu={this.menuContextHandler(dataType)} id={this.domId + '-' + key}
                                       data-field={item.props.field}
                                       style={style}
                                       onClick={(e) => {
                                           if (typeof item.props.onClick === 'function') {
                                               item.props.onClick(row);
                                           }
                                       }}
                                       onDoubleClick={(e) => {
                                           if (typeof item.props.onDoubleClick === 'function') {
                                               item.props.onDoubleClick(row);
                                           }
                                       }}
                                       data-row={`${i}`}>
                                {item.props.type ? this.renderEditComponent(item.props,row,i):(item.props.onFormat ? item.props.onFormat(row[item.props.field], row, item.props.field) : row[item.props.field])}
                            </td>;
                        }
                    })}
                </tr>
            </>
        );
    }

    renderEditRow(row:any, i:number) {
        return (
            <>
                <tr className={this.props.onClick ? 'click-row' : undefined} onClick={this.clickHandler(row, i)}>
                    <th style={{width:'20px',textAlign:'center'}}>
                        {this.editRows.indexOf(i) === -1 ? null :
                            <Icon id={`${this.domId}-edit-row-icon-${i}`} icon='edit' className='text-danger'/>}
                    </th>
                    {React.Children.map(this.props.children, (item, key) => {
                        if (!item || item.props.hide) {
                            return null;
                        }
                        //set style
                        let style = {...this.props.columnStyle};

                        style.textAlign = item.props.align || this.props.align;
                        if (item.props.width) {
                            style.width = item.props.width;
                        }
                        let dataType = 'text';
                        return (
                            <td onContextMenu={this.menuContextHandler(dataType)}
                                className={item.props.disabled ? 'disabled' : ''} id={this.domId + '-' + key}
                                data-field={item.props.field}
                                style={style}
                                onClick={(e) => {
                                    if (typeof item.props.onClick === 'function') {
                                        item.props.onClick(row);
                                    }
                                }}
                                onDoubleClick={(e) => {
                                    if (typeof item.props.onDoubleClick === 'function') {
                                        item.props.onDoubleClick(row);
                                    }
                                }}
                                data-row={`${i}`}>
                                {item.props.disabled?
                                    (item.props.onFormat ? item.props.onFormat(row[item.props.field], row, item.props.field) : row[item.props.field]):
                                    this.renderEditComponent(item.props, row, i)}
                            </td>
                        );
                    })}
                </tr>
            </>
        );
    }

    renderEditAddRow() {
        return (
            <tr id={this.domId + '-edit'}>
                <th style={{width:'20px',textAlign:'center'}}><Icon icon='chevron-circle-right'/></th>
                {React.Children.map(this.props.children, (item, key) => {
                    if (!item || item.props.hide) {
                        return null;
                    }
                    let style = {
                        width: item.props.width
                    };
                    return (
                        <td style={style}>
                            <CTableInput onFocus={this.addNewHandler}/>
                        </td>
                    );
                })}
            </tr>
        )
    }

    renderEditComponent(item:any, row:any, i:number) {
        switch (item.type) {
            case "combo":
                return (
                    <CTableInput onChange={this.editHandler} data-row={i}
                                 data-field={item.field} data={row[item.field]}
                                 align={item.align} disabled={item.disabled}
                                 combo={item.combo} comboData={item.comboData}/>
                );
            case "calendar":
                return (
                    <CTableInput onChange={this.editHandler} data-row={i}
                                 data-field={item.field} data={row[item.field]}
                                 align={item.align} disabled={item.disabled}
                                 calendarFormat={item.calendarFormat} calendar/>
                );
            case "checkbox":
                return (
                    <CCheckbox className='d-inline' width='20px' onChange={(chk,e)=>{this.editHandler(e,chk,'chk')}} data-row={i}
                               data-field={item.field} checked={!!row[item.field]} disabled={item.disabled} tabIndex="0"/>
                )
            default:
                return (
                    <CTableInput onChange={this.editHandler} data-row={i} data-field={item.field}
                                 data={row[item.field]} align={item.align} disabled={item.disabled}
                                 onBlur={this.state.total&&this.state.total.hasOwnProperty(item.field)?this.calcLocalTotal(item.field):undefined}
                    />
                )
        }
    }

    renderFoot() {
        if (!this.props.foot) {
            return null;
        }
        return (
            <div className='ck-ctable-foot d-flex align-items-center'>
                <PageBar page={this.state.page} dataCount={this.state.dataCount}
                         onSelect={this.selectPageHandler}
                         showNumbers={this.props.showNumbers??0}
                         showPages={this.props.showPages??0} noPage={this.props.edit??false}/>
                <div ref={(c:any)=>{this.fullButton = c}} className='full-btn align-self-center ms-auto pe-2 text-primary' onClick={()=>{
                    this.fullHandler()
                }}><Icon icon='expand'/></div>
            </div>
        )
    }

    renderTotal() {
        if (!this.state.total) {
            return null;
        }
        let total = this.state.total;
        return (
            <div ref={(c:any) => this.tableTotal = c} className='ck-ctable-total'>
                <table ref={(c:any)  => this.table_total = c} id={`table-total-${this.domId}`} className={this.getClasses()} style={this.getTableStyles()}>
                    <tbody>
                    <tr>
                        {this.state.select || this.props.edit ?
                            <td width='20px'><Icon icon='chart-line'/></td> : null}
                        {React.Children.map(this.props.children, (item, key) => {
                            if (!item || item.props.hide) {
                                return null;
                            }
                            let align = item.props.align || this.props.align;
                            let style:any = {
                                'textAlign': align
                            };
                            if (item.props.width) {
                                style.width = item.props.width;
                            }
                            return (
                                <td id={this.domId + '-' + key} data-field={item.props.field} style={style}>
                                    {item.props.onFormat ? item.props.onFormat(total[item.props.field], total, item.props.field) : total[item.props.field]}
                                </td>
                            );
                        })}
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    renderMenu() {
        let lang;
        if (!this.props.lang) {
            let i18 = i18n.getLang();
            let langStr = typeof lang === 'string'?lang:i18.short;
            lang = CTableLang[langStr];
        } else {
            if (typeof this.props.lang === 'string') {
                lang = CTableLang[this.props.lang]
            } else {
                lang = this.props.lang
            }
        }
        return <>
            <Menu ref={(c:any)  => this.mainMenu = c} onClick={this.menuClickHandler}>
                <Menu.Item field="copy" onClick={() => {
                    document.execCommand("copy");
                }}><Icon className='me-1' icon='copy'/>{lang['Copy']}</Menu.Item>
                {this.is_filter?<Menu.Item field='' step/>:null}
                {this.is_filter?<Menu.Item field='select_filter' onClick={(e, field, data) => {
                    let select = document.getSelection();
                    if (!select) return
                    this.filterHandler(select.toString(), data.field, 'contain');
                }}><Icon className='me-1' icon='filter'/>{lang['Filter By Selection']}</Menu.Item>:null}
                {this.is_filter?<Menu.Item field='select_exclude' onClick={(e, field, data) => {
                    let select = document.getSelection();
                    if (!select) return
                    this.filterHandler(select.toString(), data.field, 'exclude');
                }}><Icon className='me-1' icon='filter'/>{lang['Filter Excluding Selection']}</Menu.Item>:null}
                {this.is_filter||this.is_sort?<Menu.Item field='clear_filter' onClick={() => {
                    this.clearFilter();
                }}><span className='text-danger'><Icon className='me-1' icon='brush'/>{lang['Clear Filter / Sort']}</span></Menu.Item>:null}
                {this.is_filter?<Menu.Item field='' step/>:null}
                {this.is_filter?<Menu.Item field="equal">
                    {this.state.filter.equal}
                    <span className='me-1' style={inputStyle}>{lang['Equal With']}</span>
                    <Input ref={(c:Input)=>this.filter.equal=c} className='me-1' size='xs' width='120px'
                           data={this.state.filter.equal}
                           onChange={this.filterChangeHandler('equal')}
                           onMouseDown={stopEvent}
                           onEnter={() => {
                                this.filterHandler(this.state.filter.equal, this.mainMenu.data.field, 'equal');
                           }}
                    />
                    <Button size='xs' onMouseDown={stopEvent} onClick={(e) => {
                        this.filterHandler(this.state.filter.equal, this.mainMenu.data.field, 'equal');
                    }} icon='search'/>
                </Menu.Item>:null}
                {this.is_filter?<Menu.Item field="filter">
                    <span className='me-1' style={inputStyle}>{lang['Start With']}</span>
                    <Input ref={(c:Input)=>this.filter.start=c} className='me-1' size='xs' width='120px'
                           data={this.state.filter.start}
                           onChange={this.filterChangeHandler('start')}
                           onMouseDown={stopEvent}
                           onEnter={() => {
                               this.filterHandler(this.state.filter.start, this.mainMenu.data.field, 'start');
                           }}
                    />
                    <Button size='xs' onMouseDown={stopEvent} onClick={(e) => {
                        this.filterHandler(this.state.filter.start, this.mainMenu.data.field, 'start');
                    }} icon='search'/>
                </Menu.Item>:null}
                {this.is_filter?<Menu.Item field="filter">
                    <span className='me-1' style={inputStyle}>{lang['End With']}</span>
                    <Input ref={(c:Input)=>this.filter.end=c} className='me-1' size='xs' width='120px'
                           data={this.state.filter.end}
                           onChange={this.filterChangeHandler('end')}
                           onMouseDown={stopEvent}
                           onEnter={() => {
                               this.filterHandler(this.state.filter.end, this.mainMenu.data.field, 'end');
                           }}
                    />
                    <Button size='xs' onMouseDown={stopEvent} onClick={(e) => {
                        this.filterHandler(this.state.filter.end, this.mainMenu.data.field, 'end');
                    }} icon='search'/>
                </Menu.Item>:null}
                {this.is_filter?<Menu.Item field="filter">
                    <span className='me-1' style={inputStyle}>{lang['Contain with']}</span>
                    <Input ref={(c:Input)=>this.filter.contain=c} className='me-1' size='xs' width='120px'
                           data={this.state.filter.contain}
                           onChange={this.filterChangeHandler('contain')}
                           onMouseDown={stopEvent}
                           onEnter={() => {
                               this.filterHandler(this.state.filter.contain, this.mainMenu.data.field, 'contain');
                           }}
                    />
                    <Button size='xs' onMouseDown={stopEvent} onClick={(e) => {
                        this.filterHandler(this.state.filter.contain, this.mainMenu.data.field, 'contain');
                    }} icon='search'/>
                </Menu.Item>:null}
                {this.is_filter? <Menu.Item field='' step/> : null}
                {this.is_filter?<Menu.Item field="filter" className='flex-column'>
                    <div className='w-100'>{lang['Condition Filter']}</div>
                    <Input size='xs' width='100%'
                           data={this.state.filter.condition}
                           onChange={this.filterChangeHandler('condition')}
                           onMouseDown={stopEvent}
                           onEnter={() => {
                               this.filterHandler(this.state.filter.condition, this.mainMenu.data.field, 'condition');
                           }}
                    />
                </Menu.Item>:null}
                {this.props.edit && (!this.props.nodel || this.props.newBar) ? <Menu.Item field='' step/> : null}
                {this.props.edit && !this.props.nodel ? <Menu.Item field="delete_row">{lang['Delete Row']}</Menu.Item> : null}
                {this.props.edit && this.props.newBar ? <Menu.Item field="clone_row">{lang['Clone Row']}</Menu.Item> : null}
                {this.props.customMenu?<Menu.Item field='' step/>:null}
                {this.props.customMenu?this.props.customMenu.map((menu:any)=>{
                    return this.explainCustomMenu(menu)
                }):null}
            </Menu>
        </>
    }
    // MARK:-生成数字菜单
    renderNumberMenu() {
        let lang;
        if (!this.props.lang) {
            let i18 = i18n.getLang();
            let langStr = typeof lang === 'string'?lang:i18.short;
            lang = CTableLang[langStr];
        } else {
            if (typeof this.props.lang === 'string') {
                lang = CTableLang[this.props.lang]
            } else {
                lang = this.props.lang
            }
        }
        
        
        return <>
            <Menu ref={(c:any) => this.numMenu = c} onClick={this.menuClickHandler}>
                <Menu.Item field="copy" onClick={() => {
                    document.execCommand("copy");
                }}><Icon className='me-1' icon='copy'/>{lang['Copy']}</Menu.Item>
                {this.is_filter?<Menu.Item field='' step/>:null}
                {this.is_filter?<Menu.Item field='select_filter' onClick={(e, field, data) => {
                    let select = document.getSelection();
                    if (!select) return
                    this.filterHandler(select.toString(), data.field, 'contain');
                }}><Icon className='me-1' icon='filter'/>{lang['Filter By Selection']}</Menu.Item>:null}
                {this.is_filter?<Menu.Item field='select_exclude' onClick={(e, field, data) => {
                    let select = document.getSelection();
                    if (!select) return
                    this.filterHandler(select.toString(), data.field, 'exclude');
                }}><Icon className='me-1' icon='filter'/>{lang['Filter Excluding Selection']}</Menu.Item>:null}
                {this.is_filter||this.is_sort?<Menu.Item field='clear_filter' onClick={() => {
                    this.clearFilter();
                }}><span className='text-danger'><Icon className='me-1' icon='brush'/>{lang['Clear Filter / Sort']}</span></Menu.Item>:null}
                {this.is_filter?<Menu.Item field='' step/>:null}
                {this.is_filter?<Menu.Item field="filter" className='flex-column'>
                    <div className='w-100'>{lang['Condition Filter']}</div>
                    <Input size='xs' width='100%'
                           data={this.state.filter.condition}
                           onChange={this.filterChangeHandler('condition')}
                           onMouseDown={stopEvent}
                           onEnter={() => {
                                let reg = /(>=|<=|<|>|=|!=)+\s*(\d+)/i
                                let m = String(this.state.filter.condition).match(reg)
                                if (m) {
                                    this.filterHandler(m[2], this.numMenu.data.field, numberCondition[m[1]]);    
                                } else {
                                    this.filterHandler(this.state.filter.condition, this.numMenu.data.field, 'condition');    
                                }
                           }}
                    />
                    <div>and,or,between,&gt;,&gt;=,&lt;,&lt;=,=</div>
                </Menu.Item>:null}
            </Menu>
        </>
    }

    explainCustomMenu(menu:any) {
        if (menu.children && menu.children instanceof Array) {
            return <Menu.Item field={menu.field} text={menu.text} child>{menu.children.map((item:any)=>{
                return this.explainCustomMenu(item)
            })}</Menu.Item>
        } else {
            return <Menu.Item field={menu.field} onClick={menu.click}>{menu.text}</Menu.Item>
        }
    }
}

const inputStyle = {width: '80px'};
const stopEvent  = function (e:any) {
    e.stopPropagation();
};

export default CTable;