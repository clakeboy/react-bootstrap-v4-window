import React from 'react';
import PropTypes, {object} from 'prop-types';
import classNames from 'classnames/bind';
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
    HScroll
} from '@clake/react-bootstrap4';
import './css/CTable.less';
import Drag from "./Drag";
import CTableInput from "./CTableInput";
import CTableLang from './i18n/CTable';
import PageBar from "./PageBar";
class CTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data     : this.props.data || [],
            dataCount: this.props.dataCount,
            page     : 1,
            select   : this.props.select,
            total    : this.props.total,
            filter   : {
                start  : '',
                end    : '',
                contain: ''
            }
        };

        this.originalData = this.state.data.slice(0);

        this.domId = 'table-' + Common.RandomString(16);

        this.select_all = false;
        this.selectRows = [];

        this.headerSplits = [];

        this.sortList     = {};
        this.is_sort      = typeof this.props.onSort === 'function' || this.props.sort;
        this.is_filter      = typeof this.props.onFilter === 'function' || this.props.filter;
        this.current_sort = null;

        this.filter_list = [];

        this.editRows = [];

        this.cacheRow = {};
        //列头数据
        this.headers = {};
        //不需要克隆列
        this.noClone = {};

        this.lockColumns = [];
        //lock column flag
        this.isLock = false;

        this.initTableWidth();
    }

    componentDidMount() {
        this.bindSplit();
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.data !== nextProps.data) {
            if (this.props.edit) {
                if (this.equals(this.originalData,nextProps.data)) {
                    return
                }
                this.editRows     = [];
                this.originalData = Common.Clone(nextProps.data);
            }
            if (this.allchk) {
                this.allchk.setHalf(false);
                this.selectRows = [];
            }
            this.select_all = false;
            this.selectRows = [];
            this.setState({
                data     : nextProps.data,
                dataCount: nextProps.dataCount,
                page     : nextProps.page,
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.filter !== nextState.filter) {
            return true;
        }
        return nextState.data !== this.state.data;
    }

    equals = (a, b) => {
        if (a === b) return true;
        if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
        if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b;
        if (a.prototype !== b.prototype) return false;
        let keys = Object.keys(a);
        if (keys.length !== Object.keys(b).length) return false;
        return keys.every(k => this.equals(a[k], b[k]));
    };

    initTableWidth() {
        if (this.props.width) {
            this.width = 0;
            let reg    = /(\d+)(px|rem|cm|mm|pt)$/;
            let matchs = this.props.width.match(reg);
            let unit   = matchs[2];
            React.Children.map(this.props.children, (item, key) => {
                if (item.props.width) {
                    let matchs = item.props.width.match(reg);
                    this.width += parseInt(matchs[1]);
                    this.headers[item.props.field] = item.props;
                    if (item.props.noClone) {
                        this.noClone[item.props.field] = "";
                    }
                }
            });
            if (this.props.select) {
                this.width += 20;
            }
            this.width += unit;
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
                    this.filter = [];
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
    changeHandler(row, i) {
        return (checked,e) => {
            this.setRowCheck(checked,i);
            this.checkAllCheckHalf();
            if (typeof this.props.onCheck === "function") {
                this.props.onCheck(e.target.checked, row);
            }
        };
    }
    checkAllCheckHalf() {
        if (this.selectRows.length > 0 && this.selectRows.length !== this.state.data.length) {
            this.allchk.setHalf(true);
        }
        if (this.selectRows.length === 0) {
            this.allchk.setHalf(false);
            this.allchk.setChecked(false);
        } else if (this.selectRows.length === this.state.data.length) {
            this.allchk.setHalf(false);
            this.allchk.setChecked(true);
        }
    }
    setRowCheck(checked,rowIdx) {
        if (checked) {
            if (this.selectRows.indexOf(rowIdx) === -1) {
                this.selectRows.push(rowIdx);
            }
            // this.selectRows[rowIdx] = this.state.data[rowIdx];
        } else {
            if (this.selectRows.indexOf(rowIdx) !== -1) {
                this.selectRows.splice(this.selectRows.indexOf(rowIdx),1);
            }
        }
        let row = this.refs['row_'+rowIdx];
        if (checked) {
            ReactDOM.findDOMNode(row).parentNode.parentNode.classList.add('ck-table-selected');
        } else {
            ReactDOM.findDOMNode(row).parentNode.parentNode.classList.remove('ck-table-selected');
        }
    }

    clickHandler(row, i) {
        return () => {
            if (typeof this.props.onClick === 'function') {
                this.props.onClick(row, i);
            }
        }
    }

    /**
     * sort
     */
    sortHandler = (e) => {
        let dom       = e.currentTarget;
        let sort_type = dom.dataset.sort || 'asc';
        this.changeSort(dom, sort_type)
    };

    changeSort(dom, sort_type) {
        if (!dom) {
            return
        }

        this.clearSort(false);
        this.current_sort = dom.dataset.field;
        dom.dataset.sort  = sort_type === 'asc' ? 'desc' : 'asc';
        dom.classList.remove('ck-ctable-sort');
        this.sortList[dom.dataset.field] = sort_type;
        let child                        = dom.querySelector('i');
        child.classList.remove('fa-sort', 'fa-sort-alpha-up', 'fa-sort-alpha-down');
        child.classList.add('fa-sort-alpha-' + (sort_type === 'asc' ? 'down' : 'up'));
        if (typeof this.props.onSort === 'function') {
            this.props.onSort(dom.dataset.field, sort_type);
        } else {
            // this.localSort(dom.dataset.field,sort_type)
        }
    }

    clearSort(emitEvt) {
        if (this.current_sort) {
            let prv          = document.querySelector(`#${this.domId}-sort-${this.current_sort}`);
            prv.dataset.sort = 'asc';
            prv.classList.add('ck-ctable-sort');
            let prv_child = prv.querySelector('i');
            prv_child.classList.remove('fa-sort', 'fa-sort-alpha-up', 'fa-sort-alpha-down');
            prv_child.classList.add('fa-sort');
            this.sortList[this.current_sort] = null;
            this.current_sort                = null;
            if (emitEvt && typeof this.props.onSort === 'function') {
                this.props.onSort('','clear');
            } else {
                this.setState({data:this.originalData.slice(0)})
            }
            return true;
        }
        return false;
    }

    localSort(field, sort_type) {
        let desc = sort_type === 'desc';
        let data = this.state.data.slice(0);
        data.sort((a, b) => {
            if (a[field] > b[field]) return desc ? -1 : 1;
            if (a[field] < b[field]) return desc ? 1 : -1;
            if (a[field] === b[field]) return 0;
        });
        this.setState({data: data});
    }

    /**
     * scroll header and total foot
     * @param e
     */
    scrollHandler = (e) => {
        this.tableHeader.style.transform = `translateX(-${e.currentTarget.scrollLeft}px)`;
        // this.tableHeader.scrollLeft = e.currentTarget.scrollLeft;
        if (this.tableTotal) {
            // this.tableTotal.scrollLeft = e.currentTarget.scrollLeft;
            this.tableTotal.style.transform = `translateX(-${e.currentTarget.scrollLeft}px)`;
        }
    };
    /**
     * show menu list
     * @param e
     */
    menuContextHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let data = {
            field: e.currentTarget.dataset.field || '',
            data : this.state.data[e.currentTarget.dataset.row],
            index: e.currentTarget.dataset.row
        };
        this.mainMenu.show({evt: e, type: 'mouse', data: data});
    };

    menuClickHandler = (field, data) => {
        switch (field) {
            case "asc":
                this.changeSort(document.querySelector(`#${this.domId}-sort-${data.field}`), 'asc');
                break;
            case "desc":
                this.changeSort(document.querySelector(`#${this.domId}-sort-${data.field}`), 'desc');
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
    localFilter(text, field, type) {
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
        let filter = [];
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

    filterHandler(text, field, type) {
        this.filter_list.push({
            text:text,
            field:field,
            type:type
        });

        this.setState({
            filter: {
                start  : '',
                end    : '',
                contain: ''
            }
        });
        this.mainMenu.hide();
        if (typeof this.props.onFilter === 'function') {
            this.props.onFilter(text, field, type);
        } else {
            this.localFilter(text,field,type);
        }
    }

    clearFilter() {
        this.filter_list = [];
        let is_clean = this.clearSort(true);
        this.setState({
            filter: {
                start  : '',
                end    : '',
                contain: ''
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

    filterChangeHandler(field) {
        return (val) => {
            let filter    = this.state.filter;
            filter[field] = val;
            this.setState({
                filter: filter
            })
        }
    };

    selectPageHandler = (page) => {
        if (typeof this.props.onSelectPage === 'function') {
            this.props.onSelectPage(page);
        }
    };

    /**
     * edit mode
     */
    addNewHandler = (e) => {
        let data = this.state.data.slice(0);
        data.push(Object.assign({}, this.cacheRow));
        this.editRows.push(data.length - 1);
        this.setState({
            data: data,
            dataCount: data.length,
        }, () => {
            document.querySelector(`#${this.domId}-edit`).previousElementSibling.querySelector('input:not([disabled])').focus()
        })
    };
    //编辑事件
    editHandler = (e, val,row) => {
        let index = parseInt(e.target.dataset.row);
        let field = e.target.dataset.field;
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
    editCallback = (index,editData) => {
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

    deleteRowHandler(row_index) {
        if (row_index < 0 || row_index >= this.state.data.length) {
            return
        }
        if (typeof this.props.onDelete === 'function') {
            this.props.onDelete(this.state.data[row_index], row_index,this.deleteRow);
        } else {
            this.deleteRow(row_index)
        }
    }

    deleteRow(row_index) {
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

    cloneRow(row_index) {
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

    //****************************

    selectAll = (checked) => {
        this.select_all = checked;
        Common.map(this.refs, (item,key,idx) => {
            item.setChecked(this.select_all);
            this.setRowCheck(this.select_all,idx);
        });
    };

    /**
     * 得到所有选中的行
     * @returns {*}
     */
    getSelectRows() {
        return this.selectRows.map((item)=>{
            return this.state.data[item];
        });
    }

    /**
     * 设置选中的行
     * @param key 对应行数据的KEY值
     * @param list 要选中的数据值
     */
    setSelectRows(key, list) {
        this.state.data.forEach((row, i) => {
            if (list.indexOf(row[key]) !== -1) {
                this.refs['row_' + i].setChecked(true);
                this.setRowCheck(true,i);
            } else {
                this.refs['row_' + i].setChecked(false);
                this.setRowCheck(false,i);
            }
        });
        this.checkAllCheckHalf();
    }

    /**
     * binding column split
     */
    bindSplit() {
        if (this.props.move) {
            this.headerSplits.forEach((split) => {
                if (!this.drag) {
                    this.dragColumnLeft = 0;
                    this.dragWidth      = 0;
                    this.drag           = new Drag(this.split, split, {
                        start: (dragDom, eventDom) => {
                            let xy              = Common.GetDomXY(eventDom, this.mainDom);
                            this.dragWidth      = parseInt(eventDom.parentNode.style.width);
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
                            document.querySelectorAll(`#${column_key}`).forEach((item) => {
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

    getClasses() {
        let base = 'table ck-table';
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
        let base = {};
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
            base = classNames(base,'thead-' + this.props.headerTheme);
        }
        return classNames(base, this.props.headClass);
    }

    getTableStyles(style) {
        let base = {};

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

    render() {
        return (
            <div ref={c => this.mainDom = c} className={this.getMainClasses()} style={this.getStyles()}>
                <div className={this.getBodyClasses()}>
                    {this.renderHeader()}
                    {this.renderRows()}
                    {this.renderTotal()}
                    {<Scroll selector={`#table-body-com-${this.domId}`}/>}
                    {<HScroll selector={`#table-body-com-${this.domId}`}/>}
                </div>
                {this.renderFoot()}
                <div ref={c => this.split = c} className='ck-split d-none'/>
            </div>
        );
    }

    renderHeader() {
        return (
            <div ref={c => this.tableHeader = c}>
                <table ref={c => this.table_head = c} id={`table-head-${this.domId}`} className={this.getClasses()} style={this.getTableStyles()}>
                    <thead className={this.getHeaderClasses()}>
                    <tr>
                        {this.state.select || this.props.edit ?
                            <th style={{width:'20px',textAlign:'center'}}>
                                {this.props.edit ? <Icon icon='list'/> :
                                    <CCheckbox ref={c=>this.allchk=c} onChange={this.selectAll}/>}
                            </th> : null}
                        {React.Children.map(this.props.children, (item, key) => {
                            this.cacheRow[item.props.field] = '';
                            if (!item || item.props.hide) {
                                return null;
                            }
                            // let align = item.props.align || this.props.align;
                            let style = {
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
                                <th onContextMenu={this.menuContextHandler} id={this.domId + '-' + key} data-key={'head_' + key} style={style}>
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
            <div ref={c => this.table_rows = c} id={`table-body-com-${this.domId}`} className='flex-grow-1 rows' onScroll={this.scrollHandler}>
                <table ref={c => this.table_body = c} id={`table-body-${this.domId}`} className={this.getClasses()} style={this.getTableStyles()}>
                    <tbody>
                    {this.state.data.map((row, i) => {
                        if (this.props.edit) {
                            return this.renderEditRow(row, i)
                        }
                        return this.renderRow(row, i);
                    })}
                    {this.props.edit ? this.renderEditAddRow() : null}
                    </tbody>
                </table>
                {this.props.menu ? this.renderMenu() : null}
            </div>
        )
    }

    renderRow(row, i, parentRow) {
        return (
            <React.Fragment>
                <tr className={this.props.onClick ? 'click-row' : null} onClick={this.clickHandler(row, i)}>
                    {this.state.select ?
                        <th style={{width:'20px',textAlign:'center'}}>
                            <CCheckbox ref={'row_' + i} onChange={this.changeHandler(row, i)}/>
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

                        if (item.props.children) {
                            return (
                                <td onContextMenu={this.menuContextHandler} id={this.domId + '-' + key} data-row={`${i}`} data-field={item.props.field}
                                    className={item.props.className} style={{'text-align': align}}
                                    key={'col_' + key}>{React.cloneElement(item, {
                                    text : item.props.text,
                                    row  : row,
                                    value: row[item.props.field]
                                })}</td>
                            );
                        } else {
                            return <td onContextMenu={this.menuContextHandler} id={this.domId + '-' + key}
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
                                       data-row={`${i}`}>{item.props.onFormat ? item.props.onFormat(row[item.props.field], row, item.props.field) : row[item.props.field]}</td>;
                        }
                    })}
                </tr>
            </React.Fragment>
        );
    }

    renderEditRow(row, i) {
        return (
            <React.Fragment>
                <tr className={this.props.onClick ? 'click-row' : null} onClick={this.clickHandler(row, i)}>
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
                        return (
                            <td onContextMenu={this.menuContextHandler}
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
            </React.Fragment>
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

    renderEditComponent(item, row, i) {
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
                break;
            default:
                return (
                    <CTableInput onChange={this.editHandler} data-row={i} data-field={item.field} data={row[item.field]} align={item.align} disabled={item.disabled}/>
                )
        }
    }

    renderFoot() {
        if (!this.props.foot) {
            return null;
        }
        return (
            <div>
                <PageBar page={this.state.page} dataCount={this.state.dataCount}
                         onSelect={this.selectPageHandler}
                         showNumbers={this.props.showNumbers}
                         showPages={this.props.showPages} noPage={this.props.edit}/>
            </div>
        )
    }

    renderTotal() {
        if (!this.state.total) {
            return null;
        }
        let total = this.state.total;
        return (
            <div ref={c => this.tableTotal = c}>
                <table ref={c => this.table_total = c} id={`table-total-${this.domId}`} className={this.getClasses()} style={this.getTableStyles()}>
                    <tbody>
                    <tr>
                        {this.state.select ?
                            <td width='20px'><Icon icon='chart-line'/></td> : null}
                        {React.Children.map(this.props.children, (item, key) => {
                            if (!item || item.props.hide) {
                                return null;
                            }
                            let align = item.props.align || this.props.align;
                            let style = {
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
        let lang = this.props.lang;
        if (!lang) {
            let i18 = i18n.getLang();
            let langStr = typeof lang === 'string'?lang:i18.short;
            lang = CTableLang[langStr];
        }
        return (
            <Menu ref={c => this.mainMenu = c} onClick={this.menuClickHandler}>
                <Menu.Item field="copy" onClick={() => {
                    document.execCommand("copy");
                }}><Icon className='mr-1' icon='copy'/>{lang['Copy']}</Menu.Item>
                <Menu.Item field="cut" onClick={() => {
                    document.execCommand("cut");
                }}><Icon className='mr-1' icon='cut'/>{lang['Cut']}</Menu.Item>
                {this.is_filter?<Menu.Item step/>:null}
                {this.is_filter?<Menu.Item field='select_filter' onClick={(e, field, data) => {
                    let select = document.getSelection();
                    this.filterHandler(select.toString(), data.field, 'contain');
                }}><Icon className='mr-1' icon='filter'/>{lang['Filter By Selection']}</Menu.Item>:null}
                {this.is_filter?<Menu.Item field='select_exclude' onClick={(e, field, data) => {
                    let select = document.getSelection();
                    this.filterHandler(select.toString(), data.field, 'exclude');
                }}><Icon className='mr-1' icon='filter'/>{lang['Filter Excluding Selection']}</Menu.Item>:null}
                {this.is_filter||this.is_sort?<Menu.Item field='clear_filter' onClick={() => {
                    this.clearFilter();
                }}><span className='text-danger'><Icon className='mr-1' icon='brush'/>{lang['Clear Filter / Sort']}</span></Menu.Item>:null}
                {this.is_filter?<Menu.Item step/>:null}
                {this.is_filter?<Menu.Item field="equal">
                    <span className='mr-1' style={inputStyle}>{lang['Equal With']}</span>
                    <Input className='mr-1' size='xs' width='120px'
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
                    <span className='mr-1' style={inputStyle}>{lang['Start With']}</span>
                    <Input className='mr-1' size='xs' width='120px'
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
                    <span className='mr-1' style={inputStyle}>{lang['End With']}</span>
                    <Input className='mr-1' size='xs' width='120px'
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
                    <span className='mr-1' style={inputStyle}>{lang['Contain with']}</span>
                    <Input className='mr-1' size='xs' width='120px'
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
                {this.is_sort?<Menu.Item step/>:null}
                {this.is_sort?<Menu.Item field="asc"><Icon className='mr-1' icon='sort-alpha-down'/>{lang['Sort Ascending']}</Menu.Item>:null}
                {this.is_sort?<Menu.Item field="desc"><Icon className='mr-1' icon='sort-alpha-up'/>{lang['Sort Descending']}</Menu.Item>:null}
                {this.props.edit ? <Menu.Item step/> : null}
                {this.props.edit ? <Menu.Item field="delete_row">{lang['Delete Row']}</Menu.Item> : null}
                {this.props.edit ? <Menu.Item field="clone_row">{lang['Clone Row']}</Menu.Item> : null}
                {this.props.customMenu?<Menu.Item step/>:null}
                {this.props.customMenu?this.props.customMenu.map((menu)=>{
                    return this.explainCustomMenu(menu)
                }):null}
            </Menu>
        )
    }

    explainCustomMenu(menu) {
        if (menu.children && menu.children instanceof Array) {
            return <Menu.Item field={menu.field} text={menu.text} child>{menu.children.map((item)=>{
                return this.explainCustomMenu(item)
            })}</Menu.Item>
        } else {
            return <Menu.Item field={menu.field} onClick={menu.click}>{menu.text}</Menu.Item>
        }
    }
}

const inputStyle = {width: '80px'};
const stopEvent  = function (e) {
    e.stopPropagation();
};

CTable.propTypes = {
    //主题
    theme       : PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']),
    //标头主题
    headerTheme : PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']),
    //标头css class
    headClass   : PropTypes.string,
    //数据来源
    data        : PropTypes.array,
    //数据总记录数
    dataCount   : PropTypes.number,
    //总页数
    page        : PropTypes.number,
    //第一列是否出现选择项
    select      : PropTypes.bool,
    //是否显示标头
    header      : PropTypes.bool,
    //
    center      : PropTypes.bool,
    //数据当前页
    currentPage : PropTypes.number,
    //
    striped     : PropTypes.bool,
    //是否显示边框
    bordered    : PropTypes.bool,
    //行是否有hover效果
    hover       : PropTypes.bool,
    //是否小型化显示列表
    sm          : PropTypes.bool,
    //文字最小化
    fontSm      : PropTypes.bool,
    responsive  : PropTypes.bool,
    //文字列表 left,center,right
    align       : PropTypes.string,
    //是否显示树结构
    tree        : PropTypes.string,
    //点击树事件
    onClickTree : PropTypes.func,
    //点击事件
    onClick     : PropTypes.func,
    //选择事件
    onCheck     : PropTypes.func,
    //过滤事件
    onFilter    : PropTypes.func,
    //排序事件
    onSort      : PropTypes.func,
    //是否列可移动
    move        : PropTypes.bool,
    //刷新事件
    onRefresh   : PropTypes.func,
    //刷新事件按钮文字
    refreshText : PropTypes.string,
    //是否漂浮
    absolute    : PropTypes.bool,
    //漂浮X坐标
    x           : PropTypes.string,
    //漂浮Y坐标
    y           : PropTypes.string,
    //表宽
    width       : PropTypes.string,
    //表高
    height      : PropTypes.string,
    // foot        : PropTypes.bool,
    //是否显示列表尾
    foot        : PropTypes.object,
    //表自动随主体小设置
    position    : PropTypes.object,
    //显示的页码数
    showPages   : PropTypes.number,
    //显示的记录条数
    showNumbers : PropTypes.number,
    //翻页事件
    onSelectPage: PropTypes.func,
    //是否自动换行
    noWrap      : PropTypes.bool,
    //是否启用右键菜单
    menu        : PropTypes.bool,
    //是否显示每列记录总合数
    total       : PropTypes.object,
    //是否编辑模式
    edit        : PropTypes.bool,
    //数据删除事件
    onDelete    : PropTypes.func,
    //是否启用排序
    sort        : PropTypes.bool,
    //是否启用过滤
    filter      : PropTypes.bool,
    //自定义右键菜单
    customMenu  : PropTypes.array,
    //自定义显示语言
    lang        : PropTypes.object,
    source      : PropTypes.string,
    sourceFunc  : PropTypes.func,
};

CTable.defaultProps = {
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
    headerTheme: 'light',
    noWrap     : true,
    bordered   : true,
    move       : true,
    menu       : true,
    showNumbers: 30,
    showPages  : 10,
    source     : null
};

export default CTable;