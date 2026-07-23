# react-bootstrap-v4-window

基于 React + Bootstrap 4 的企业级桌面级 UI 组件库，提供 Window、CTable、WModal 等核心组件，适用于构建后台管理系统、数据看板等场景。

## 安装

```bash
npm install @clake/react-bootstrap4  # 基础依赖
npm install react bootstrap         # React + Bootstrap 4
```

## 组件总览

| 组件 | 说明 |
|------|------|
| [Window](#window) | 可拖拽、可缩放、可最大化的浮动窗口 |
| [WindowGroup](#windowgroup) | 多窗口管理器，负责窗口层级和状态管理 |
| [TopMenu](#topmenu) | 顶部导航菜单 |
| [CTable](#ctable) | 功能丰富的数据表格（排序、过滤、编辑、分页、右键菜单） |
| [WModal](#wmodal) | 模态对话框（Alert / Confirm / Loading / View） |
| [CTableInput](#ctableinput) | CTable 编辑模式下的输入框 |
| [CTableTextArea](#ctabletextarea) | CTable 编辑模式下的多行文本框 |
| [WCombo](#wcombo) | 下拉选择框（浮层渲染） |
| [WCalendar](#wcalendar) | 日期选择器（浮层渲染） |
| [PageBar](#pagebar) | 分页栏 |
| [IconButton](#iconbutton) | 图标按钮 |
| [Drag](#drag) | 拖动控制类（TS Class） |

---

## Window

可拖拽、可缩放、可最大化的浮动窗口组件，支持窗口层级管理。

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | `string` | `'Window'` | 窗口标题 |
| width | `string` | `'600px'` | 窗口宽度 |
| height | `string` | `'400px'` | 窗口高度 |
| x | `string` | — | 初始 X 坐标 |
| y | `string` | — | 初始 Y 坐标 |
| backColor | `string` | — | 背景颜色 |
| name | `string` | — | 窗口唯一标识（用于 WindowGroup 管理） |
| parent | `any` | — | 父级 WindowGroup 实例 |
| marginTop | `any` | — | 顶部安全区域偏移 |
| isMaxBtn | `boolean` | `true` | 显示最大化按钮 |
| isCloseBtn | `boolean` | `true` | 显示关闭按钮 |

### Static Properties

| 属性 | 值 | 说明 |
|------|-----|------|
| `Window.EVT_RESIZE` | `'resize'` | 窗口缩放事件 |
| `Window.EVT_MAXWINDOW` | `'max_window'` | 窗口最大化事件 |
| `Window.EVT_SHOW` | `'show'` | 窗口显示事件 |
| `Window.EVT_CLOSE` | `'close'` | 窗口关闭事件 |
| `Window.EVT_BEFORE_CLOSE` | `'before_close'` | 关闭前事件 |

### Methods

| 方法 | 签名 | 说明 |
|------|------|------|
| `show` | `(option: { params?: any; x?: number; y?: number }) => void` | 显示窗口 |
| `close` | `() => void` | 关闭窗口 |
| `hide` | `() => void` | 隐藏窗口 |
| `resize` | `(width: number, height: number) => void` | 调整窗口大小 |
| `move` | `(x: number, y: number) => void` | 移动窗口位置 |
| `max` | `(flag: boolean) => void` | 最大化/还原窗口 |
| `setIndex` | `(index: number) => void` | 设置层级 z-index |
| `setTitle` | `(title: string) => void` | 修改标题 |
| `setActive` | `(active: boolean) => void` | 设置激活状态 |
| `getPosition` | `() => { left: number; top: number }` | 获取窗口位置 |
| `on` | `(name: string, fn: Function) => void` | 绑定事件 |
| `off` | `(name: string) => void` | 解绑事件 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `show` | `params` | 窗口显示后触发 |
| `close` | — | 窗口关闭后触发 |
| `before_close` | — | 关闭前触发（返回 false 可阻止关闭） |
| `max_window` | — | 最大化时触发 |
| `resize` | `width, height` | 缩放时触发 |

### Usage

```jsx
import { Window, WindowGroup } from '@clake/react-bootstrap-v4-window';

function App() {
  const winRef = React.useRef(null);

  React.useEffect(() => {
    // 窗口挂载后打开
    if (winRef.current) {
      winRef.current.show({ x: 100, y: 100 });
    }
  }, []);

  return (
    <WindowGroup>
      <Window
        ref={winRef}
        name="myWindow"
        title="我的窗口"
        width="800px"
        height="500px"
        isMaxBtn={true}
        isCloseBtn={true}
      >
        <p>窗口内容区域</p>
      </Window>
    </WindowGroup>
  );
}
```

---

## WindowGroup

多窗口管理器，负责窗口的显示、隐藏、层级排序。

### Props

无特殊 Props，通过 `children` 传入 Window 组件。

### Methods

| 方法 | 签名 | 说明 |
|------|------|------|
| `open` | `(name: string, params?: any) => void` | 打开指定窗口 |
| `show` | `(name: string, params?: any) => void` | 显示窗口（含定位） |
| `close` | `(name: string) => void` | 关闭指定窗口 |
| `changeWindowIndex` | `(name: string) => void` | 调整窗口层级 |

### Usage

```jsx
import { Window, WindowGroup } from '@clake/react-bootstrap-v4-window';

function App() {
  const groupRef = React.useRef(null);

  const handleOpen = () => {
    groupRef.current.open('settings', { userId: 1 });
  };

  return (
    <div>
      <button onClick={handleOpen}>打开设置窗口</button>
      <WindowGroup ref={groupRef}>
        <Window name="settings" title="系统设置" width="600px" height="400px">
          <p>设置内容</p>
        </Window>
        <Window name="help" title="帮助" width="400px" height="300px">
          <p>帮助文档</p>
        </Window>
      </WindowGroup>
    </div>
  );
}
```

---

## TopMenu

顶部导航菜单组件，支持子菜单浮层展示。

### TopMenu Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| top | `boolean` | `false` | 是否为置顶样式 |
| onClick | `(key: string) => void` | — | 点击菜单项回调 |

### TopMenu.Item Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| name | `string` | — | 菜单项唯一标识 |
| text | `string` | — | 显示文本 |
| onClick | `(key: string) => void` | — | 点击回调 |

### Usage

```jsx
import { TopMenu } from '@clake/react-bootstrap-v4-window';

function App() {
  const handleClick = (key) => {
    console.log('选中菜单:', key);
  };

  return (
    <TopMenu top={false} onClick={handleClick}>
      <TopMenu.Item name="home" text="首页" />
      <TopMenu.Item name="about" text="关于" />
      <TopMenu.Item name="contact" text="联系">
        {/* 子菜单 */}
      </TopMenu.Item>
    </TopMenu>
  );
}
```

---

## CTable

功能丰富的数据表格组件，支持排序、过滤、编辑、分页、右键菜单、列拖拽、多选等功能。

### CTable Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | `any[]` | `[]` | 表格数据源 |
| dataCount | `number` | `1` | 数据总记录数 |
| page | `number` | — | 当前页码 |
| currentPage | `number` | `1` | 第一页 |
| select | `boolean` | `true` | 第一列是否显示复选框 |
| selectOnce | `boolean` | `false` | 是否只能选中一项 |
| header | `boolean` | `true` | 是否显示表头 |
| foot | `any` | `true` | 是否显示表尾（分页栏） |
| striped | `boolean` | `true` | 斑马纹样式 |
| bordered | `boolean` | `true` | 是否显示边框 |
| hover | `boolean` | `true` | 行 hover 效果 |
| sm | `boolean` | `true` | 小型化显示 |
| fontSm | `boolean` | `true` | 文字最小化 |
| responsive | `boolean` | `false` | 响应式容器 |
| align | `string` | `'left'` | 文字对齐方式（left/center/right） |
| tree | `string` | — | 是否显示树结构 |
| center | `boolean` | `false` | 居中对齐 |
| noWrap | `boolean` | `true` | 是否自动换行 |
| menu | `boolean` | `true` | 是否启用右键菜单 |
| total | `any` | `null` | 每列汇总数据 |
| totalFields | `string[]` | — | 显示汇总的字段列表 |
| edit | `boolean` | `false` | 是否启用编辑模式 |
| newBar | `boolean` | `true` | 是否显示新增行 |
| nodel | `boolean` | `false` | 是否隐藏删除按钮 |
| sort | `boolean` | `false` | 是否启用排序 |
| filter | `boolean` | `false` | 是否启用过滤 |
| move | `boolean` | `true` | 列宽是否可拖拽 |
| theme | `string` | — | 主题（primary/secondary/success/danger/warning/info/light/dark） |
| headerTheme | `string` | `'primary'` | 表头主题 |
| headClass | `string` | — | 表头 CSS 类 |
| width | `string` | — | 表格宽度 |
| height | `string` | — | 表格高度 |
| rowHeight | `string` | — | 行高 |
| absolute | `boolean` | `false` | 是否绝对定位 |
| x | `string` | — | 绝对定位 X 坐标 |
| y | `string` | — | 绝对定位 Y 坐标 |
| position | `any` | — | 定位对象（top/left/right/bottom） |
| showPages | `number` | `10` | 分页器显示页数 |
| showNumbers | `number` | `30` | 每页显示条数 |
| focus | `boolean` | `true` | 是否显示焦点行 |
| rowCheck | `boolean` | `false` | 是否全行点选 |
| allSelect | `boolean` | `true` | 是否显示全选 |
| lang | `any` | `'en'` | 自定义语言 |
| columnStyle | `any` | — | 列统一样式 |
| jsxId | `string` | — | 唯一标识 |
| hidden | `boolean` | `false` | 是否隐藏表格 |
| disabled | `boolean` | `false` | 是否禁用 |

### CTable Events

| 事件 | 签名 | 说明 |
|------|------|------|
| `onClick` | `(row, idx, jsxId) => void` | 行点击事件 |
| `onCheck` | `(checked, row, jsxId) => void` | 行选择事件 |
| `onCheckAll` | `(checked, data, jsxId) => void` | 全选事件 |
| `onFilter` | `(text, field, type, jsxId) => void` | 过滤事件 |
| `onSort` | `(field, sort_type, jsxId) => void` | 排序事件 |
| `onSelectPage` | `(page, jsxId) => void` | 翻页事件 |
| `onRefresh` | `() => void` | 刷新事件 |
| `onDelete` | `(row, idx, callback, jsxId) => void` | 删除事件 |
| `onChange` | `(idx, field, row, all_data, jsxId) => void` | 数据修改事件 |
| `sourceFunc` | `(opt, callback) => void` | 数据源函数（分页/过滤） |
| `source` | `string` | — | 数据源标识 |
| `customMenu` | `any[]` | — | 自定义右键菜单 |

### CTable Sub-components

| 组件 | 说明 |
|------|------|
| `CTable.Toolbar` | 工具栏（位于表尾） |
| `CTable.Btnbar` | 工具栏按钮 |

### CTable Columns (children) Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| field | `string` | — | 数据字段名（必填） |
| text | `string` | — | 列头文本 |
| width | `string` | — | 列宽 |
| align | `string` | — | 对齐方式 |
| dataType | `string` | — | 数据类型（text/number/date） |
| type | `string` | — | 字段类型（用于编辑模式） |
| combo | `any` | — | 下拉配置 |
| comboData | `any` | — | 下拉数据 |
| calendar | `boolean` | — | 日期选择 |
| calendarFormat | `string` | — | 日期格式 |
| hide | `boolean` | `false` | 隐藏列 |
| disabled | `boolean` | `false` | 编辑模式下禁用 |
| color | `string` | — | 文字颜色 |
| bgColor | `string` | — | 背景颜色 |
| HeaderColor | `string` | — | 表头文字颜色 |
| HeaderBgColor | `string` | — | 表头背景颜色 |
| onFormat | `(value, row, field) => ReactNode` | — | 格式化渲染 |
| onEdit | `(idx, val, row, callback) => void` | — | 编辑回调 |
| onClick | `(row) => void` | — | 单元格点击 |
| onDoubleClick | `(row) => void` | — | 单元格双击 |
| className | `string` | — | 单元格类名 |
| def | `any` | — | 默认值 |
| children | `ReactNode` | — | 自定义渲染 |

### CTable Methods

| 方法 | 签名 | 说明 |
|------|------|------|
| `getSelectRows` | `() => any[]` | 获取选中行数据 |
| `setSelectRows` | `(key: string, list: any[]) => void` | 设置选中行 |
| `setData` | `(data: any[]) => void` | 设置数据 |
| `reset` | `(data?: any[]) => void` | 重置数据 |
| `getEditRows` | `() => any[]` | 获取编辑行 |
| `clearEditRows` | `() => void` | 清空编辑行 |

### Usage

```jsx
import { CTable } from '@clake/react-bootstrap-v4-window';

function App() {
  const [data, setData] = React.useState([
    { id: 1, name: 'Alice', age: 25, dept: 'Engineering' },
    { id: 2, name: 'Bob', age: 30, dept: 'Marketing' },
  ]);

  const handleClick = (row) => {
    console.log('点击行:', row);
  };

  const handleCheck = (checked, row) => {
    console.log(checked ? '选中' : '取消', row);
  };

  const handleSort = (field, sortType) => {
    console.log('排序:', field, sortType);
  };

  return (
    <CTable
      data={data}
      dataCount={data.length}
      select={true}
      edit={false}
      sort={true}
      filter={true}
      bordered={true}
      hover={true}
      striped={true}
      onClick={handleClick}
      onCheck={handleCheck}
      onSort={handleSort}
      showNumbers={10}
      showPages={5}
    >
      <CTable.Column
        field="name"
        text="姓名"
        width="150px"
        align="left"
      />
      <CTable.Column
        field="age"
        text="年龄"
        width="80px"
        dataType="number"
        align="center"
      />
      <CTable.Column
        field="dept"
        text="部门"
        width="120px"
      />
    </CTable>
  );
}
```

**编辑模式示例：**

```jsx
<CTable
  data={data}
  dataCount={data.length}
  edit={true}
  newBar={true}
  onChange={(idx, field, row, allData) => {
    console.log('修改:', idx, field, row);
  }}
>
  <CTable.Column field="name" text="姓名" />
  <CTable.Column field="age" text="年龄" dataType="number" />
  <CTable.Column field="combo" text="下拉" combo={{ data: ['A', 'B', 'C'] }} />
  <CTable.Column field="date" text="日期" calendar calendarFormat="YYYY-MM-DD" />
  <CTable.Column field="desc" text="描述" type="textarea" rows={3} />
  <CTable.Column field="check" text="是否" type="checkbox" />
</CTable>
```

---

## WModal

模态对话框组件，支持 Alert、Confirm、Loading、View 四种类型。

### WModal Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| onOpen | `() => void` | — | 打开回调 |
| onClose | `() => void` | — | 关闭回调 |
| center | `boolean` | `false` | 居中显示 |
| fade | `boolean` | `true` | 淡入淡出动画 |
| blurSelector | `string` | — | 模糊选择器 |
| width | `string` | `'300px'` | 弹窗宽度 |

### Methods (静态方法)

| 方法 | 签名 | 说明 |
|------|------|------|
| `alert` | `(opt: { title?, content?, callback?, center?, fade?, header?, width?, btns? } \| string, cb?: Function) => void` | 提示弹窗 |
| `confirm` | `(opt: { title?, content?, callback?, center?, fade?, header?, width?, btns? } \| string, cb?: Function) => void` | 确认弹窗 |
| `loading` | `(opt: { title?, content?, center?, fade?, header?, width?, btns? } \| string) => void` | 加载弹窗 |
| `view` | `(opt: { title?, content?, callback?, center?, fade?, header?, width?, btns? }) => void` | 视图弹窗 |

### ModalOptions

| 属性 | 类型 | 说明 |
|------|------|------|
| title | `string` | 弹窗标题 |
| content | `any` | 弹窗内容 |
| callback | `Function` | 回调函数 |
| center | `boolean` | 居中 |
| fade | `boolean` | 动画 |
| header | `boolean` | 显示头部 |
| width | `string` | 宽度 |
| btns | `Object` | 按钮文本配置（ok/cancel） |
| isCloseBtn | `boolean` | 显示关闭按钮 |
| type | `number` | 类型（0=Alert, 1=Confirm, 2=Loading, 3=View） |

### Usage

```jsx
import { WModal } from '@clake/react-bootstrap-v4-window';

function App() {
  const modalRef = React.useRef(null);

  const showAlert = () => {
    WModal.alert({
      title: '提示',
      content: '这是一条提示信息',
      callback: () => console.log('确认'),
    });
  };

  const showConfirm = () => {
    WModal.confirm({
      title: '确认',
      content: '确定要删除吗？',
      btns: { ok: '删除', cancel: '取消' },
      callback: (flag) => {
        console.log(flag ? '已删除' : '取消');
      },
    });
  };

  const showLoading = () => {
    WModal.loading({
      title: '加载中',
      content: '正在处理数据...',
    });
    setTimeout(() => WModal.close(), 2000);
  };

  return (
    <div>
      <button onClick={showAlert}>Alert</button>
      <button onClick={showConfirm}>Confirm</button>
      <button onClick={showLoading}>Loading</button>
      <WModal ref={modalRef} />
    </div>
  );
}
```

---

## CTableInput

CTable 编辑模式下的输入框组件。

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | `any` | — | 输入值 |
| align | `string` | — | 对齐方式 |
| disabled | `boolean` | `false` | 是否禁用 |
| combo | `any` | — | 下拉配置 |
| comboData | `any` | — | 下拉数据 |
| calendar | `boolean` | `false` | 是否显示日期选择 |
| calendarFormat | `string` | — | 日期格式 |
| onChange | `(evt, val, row?) => void` | — | 值变化回调 |
| onSelect | `() => void` | — | 选择回调 |
| onFocus | `(e) => void` | — | 聚焦回调 |
| onBlur | `(e) => void` | — | 失焦回调 |
| readOnly | `boolean` | `false` | 只读 |
| number | `boolean` | `false` | 只能输入数字 |

### Usage

```jsx
import CTableInput from '@clake/react-bootstrap-v4-window/CTableInput';

function App() {
  return (
    <CTableInput
      data="默认值"
      align="right"
      onChange={(evt, val) => console.log('值:', val)}
    />
  );
}
```

**带下拉选择：**

```jsx
<CTableInput
  data={selectedValue}
  combo={{ data: ['选项1', '选项2', '选项3'] }}
  comboData={comboList}
  onChange={(evt, val) => setSelectedValue(val)}
/>
```

**带日期选择：**

```jsx
<CTableInput
  data={dateValue}
  calendar
  calendarFormat="YYYY-MM-DD"
  onChange={(evt, val) => setDateValue(val)}
/>
```

---

## CTableTextArea

CTable 编辑模式下的多行文本框组件。

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | `any` | — | 输入值 |
| align | `string` | — | 对齐方式 |
| disabled | `boolean` | `false` | 是否禁用 |
| onChange | `(evt, val, row?) => void` | — | 值变化回调 |
| onSelect | `() => void` | — | 选择回调 |
| onFocus | `(e) => void` | — | 聚焦回调 |
| onBlur | `(e) => void` | — | 失焦回调 |
| readOnly | `boolean` | `false` | 只读 |
| rows | `number` | `1` | 行数 |

### Usage

```jsx
import CTableTextArea from '@clake/react-bootstrap-v4-window/CTableTextArea';

function App() {
  return (
    <CTableTextArea
      data="多行文本内容"
      rows={5}
      onChange={(evt, val) => console.log('值:', val)}
    />
  );
}
```

---

## WCombo

下拉选择框组件，浮层渲染，支持搜索过滤。

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | `any` | — | 下拉数据源 |
| combo | `any` | — | 底层 Combo 配置 |
| noSearch | `boolean` | `false` | 是否隐藏搜索框 |
| onSelect | `(val, row, evt) => void` | — | 选择回调 |

### Methods

| 方法 | 签名 | 说明 |
|------|------|------|
| `show` | `(search: string, e: Event) => void` | 显示下拉面板 |
| `hide` | `() => void` | 隐藏下拉面板 |
| `filter` | `(val: any) => void` | 过滤选项 |

### Usage

```jsx
import WCombo from '@clake/react-bootstrap-v4-window/WCombo';

function App() {
  const handleSelect = (val, row, evt) => {
    console.log('选中:', val, row);
  };

  return (
    <WCombo
      combo={{ data: ['Apple', 'Banana', 'Orange'] }}
      data={comboList}
      onSelect={handleSelect}
    />
  );
}
```

---

## WCalendar

日期选择器组件，浮层渲染。

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | `any` | — | 选中日期值 |
| combo | `any` | — | 下拉配置 |
| noSearch | `boolean` | `false` | 隐藏搜索 |
| format | `string` | — | 日期格式 |
| onSelect | `(val, row) => void` | — | 选择回调 |

### Methods

| 方法 | 签名 | 说明 |
|------|------|------|
| `show` | `(e: Event) => void` | 显示日期面板 |
| `hide` | `() => void` | 隐藏日期面板 |
| `format` | `() => string` | 获取格式化后的日期 |
| `setCurrentDate` | `(d: Date) => void` | 设置当前日期 |

### Usage

```jsx
import WCalendar from '@clake/react-bootstrap-v4-window/WCalendar';

function App() {
  const handleSelect = (val, evt) => {
    console.log('选中日期:', val);
  };

  return (
    <WCalendar
      value="2024-01-01"
      format="YYYY-MM-DD"
      onSelect={handleSelect}
    />
  );
}
```

---

## PageBar

分页栏组件。

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | `number` | — | 当前页码（必填） |
| dataCount | `number` | — | 总记录数（必填） |
| showNumbers | `number` | — | 每页显示条数（必填） |
| onSelect | `(page: number) => void` | — | 翻页回调（必填） |
| showPages | `number` | — | 显示页数 |
| noPage | `boolean` | `false` | 是否隐藏翻页控件 |

### Usage

```jsx
import PageBar from '@clake/react-bootstrap-v4-window/PageBar';

function App() {
  const [page, setPage] = React.useState(1);
  const dataCount = 100;

  return (
    <PageBar
      page={page}
      dataCount={dataCount}
      showNumbers={10}
      showPages={5}
      onSelect={(p) => setPage(p)}
    />
  );
}
```

---

## IconButton

图标按钮组件。

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| icon | `string` | — | 图标名称（必填） |
| iconType | `string` | `'solid'` | 图标类型（solid/regular/light/brands） |
| color | `string` | — | 颜色 |
| onClick | `(evt) => void` | — | 点击回调 |

### Usage

```jsx
import IconButton from '@clake/react-bootstrap-v4-window/IconButton';

function App() {
  return (
    <div>
      <IconButton icon="home" onClick={() => console.log('home')} />
      <IconButton icon="user" iconType="regular" color="red" />
      <IconButton icon="react" iconType="brands" />
    </div>
  );
}
```

---

## Drag

拖动控制类（TypeScript Class），用于实现元素拖拽功能。

### Constructor

```typescript
constructor(dragDom: HTMLElement | string, eventDom: HTMLElement | string, events: MoveEvent)
```

| 参数 | 类型 | 说明 |
|------|------|------|
| dragDom | `HTMLElement \| string` | 被拖动元素（DOM 或选择器） |
| eventDom | `HTMLElement \| string` | 触发拖动的事件元素（DOM 或选择器） |
| events | `MoveEvent` | 事件回调对象 |

### MoveEvent

| 属性 | 签名 | 说明 |
|------|------|------|
| `start` | `(dragDom, eventDom, event) => boolean` | 拖动开始（返回 false 取消） |
| `move` | `(move, dragDom, eventDom, event) => void` | 拖动中 |
| `end` | `(dragDom, eventDom, event) => boolean` | 拖动结束 |

### Methods

| 方法 | 签名 | 说明 |
|------|------|------|
| `setDragDom` | `(dom: HTMLElement \| string) => void` | 设置被拖动元素 |
| `setEventDom` | `(dom: HTMLElement \| string) => void` | 设置事件元素 |
| `unbind` | `() => void` | 解绑事件 |

### Usage

```typescript
import Drag from '@clake/react-bootstrap-v4-window/Drag';

// 使用 DOM 元素
const dragDom = document.querySelector('.draggable') as HTMLElement;
const eventDom = document.querySelector('.header') as HTMLElement;

const drag = new Drag(dragDom, eventDom, {
  start: (dragDom, eventDom, event) => {
    console.log('开始拖动');
    return true;
  },
  move: (move, dragDom, eventDom, event) => {
    console.log('拖动中:', move);
  },
  end: (dragDom, eventDom, event) => {
    console.log('拖动结束');
  },
});

// 解绑
drag.unbind();
```

---

## 完整示例

```jsx
import React from 'react';
import { Window, WindowGroup, CTable } from '@clake/react-bootstrap-v4-window';

function App() {
  const [tableData, setTableData] = React.useState([
    { id: 1, name: 'Alice', age: 25, status: 'Active' },
    { id: 2, name: 'Bob', age: 30, status: 'Inactive' },
    { id: 3, name: 'Charlie', age: 28, status: 'Active' },
  ]);

  const handleRowClick = (row) => {
    console.log('点击:', row);
  };

  const handleCheck = (checked, row) => {
    console.log(checked ? '选中' : '取消', row);
  };

  const handleDelete = (row, idx, callback) => {
    if (window.confirm(`确定删除 ${row.name}？`)) {
      const newData = tableData.filter((_, i) => i !== idx);
      setTableData(newData);
      callback(idx);
    }
  };

  return (
    <WindowGroup>
      <Window
        name="mainWindow"
        title="用户管理"
        width="900px"
        height="600px"
        isMaxBtn={true}
        isCloseBtn={true}
      >
        <CTable
          data={tableData}
          dataCount={tableData.length}
          select={true}
          edit={false}
          sort={true}
          filter={true}
          menu={true}
          bordered={true}
          hover={true}
          striped={true}
          onClick={handleRowClick}
          onCheck={handleCheck}
          onDelete={handleDelete}
          showNumbers={10}
          showPages={5}
        >
          <CTable.Column field="name" text="姓名" width="150px" />
          <CTable.Column field="age" text="年龄" width="80px" dataType="number" />
          <CTable.Column field="status" text="状态" width="100px" />
        </CTable>
      </Window>
    </WindowGroup>
  );
}

export default App;
```
