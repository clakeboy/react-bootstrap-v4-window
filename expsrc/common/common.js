import React from "react";
export var pad = (num, n) => {
  let len = num?.toString().length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num;
};
 
 

 
export var copyObject = (obj = {}, exlists = []) => {
  let obj1 = {};
  exlists = objectToArray(exlists);
  Object.keys(obj).forEach(function (key) {
    if (exlists.indexOf(key) < 0) {
      obj1[key] = obj[key];
    }
  });
  return obj1;
};
 
export var isNullOrEmpty = (obj) => {
  if (obj === null || obj === undefined || obj === "") return true;
  if (typeof obj === "object") {
    for (let i in obj) {
      return false;
    }
  }
  return false;
};
 
 

export var compare = function (origin, target, num) {
  if (
    origin == null ||
    target == null ||
    origin == undefined ||
    target == undefined
  )
    return origin === target;
  if (!num) num = 1;
  if (num >= 6) return origin === target;
  if (typeof target !== "object") {
    return origin === target;
  }
  if (typeof origin !== "object") {
    return false;
  }
  if (target.$$typeof) return origin === target;
  for (let key of Object.keys(target)) {
    if (!compare(origin[key], target[key], num + 1)) {
      return false;
    }
  }
  return true;
};

export var objectToArray = (obj = {}) => {
  if (Object.prototype.toString.call(obj) === "[object Object]") {
    let obj1 = [];
    Object.keys(obj).forEach(function (key) {
      obj1.push(key);
    });
    return obj1;
  }
  return obj;
};

export var getFirstDom = (obj) => {
  if (typeof obj.type === "string") {
    return obj;
  } else {
    getFirstDom(obj.props.ch);
  }
  return null;
};
export var scroll = () => {
  if (window.pageYOffset != null) {
    return {
      left: window.pageXOffset,
      top: window.pageYOffset,
    };
  } else if (document.compatMode == "CSS1Compat") {
    return {
      left: document.documentElement.scrollLeft,
      top: document.documentElement.scrollTop,
    };
  }
  return {
    left: document.body.scrollLeft,
    top: document.body.scrollTop,
  };
};
 
/**
 * 格式化Total对象数字属性
 * objTotal Total对象
 * totalFields  要格式化的属性
 * fmtObj  指定属性的小数位数
 * defDigits 默认的小数位数
 */
export var totalObjFormat = (objTotal,totalFields, fmtObj,defDigits=2) => {
  if(totalFields?.length>0){
      totalFields.forEach( (element)=> {
        if(objTotal[element]){
            let digit = fmtObj?fmtObj[element]?fmtObj[element]:defDigits:defDigits;
            objTotal[element] = parseFloat(objTotal[element].toFixed(digit)); 
        }
      });
  }
  return objTotal;
};

export var  isObject = (args)=>{
    return typeof args=="object";
};

/**
 * 检查对象是否为空
 * @param {Object} obj - 要检查的对象
 * @returns {boolean} - 如果对象为空（没有可枚举属性）返回 true，否则返回 false
 */
export function isEmptyObject(obj) {
    // 处理 null 和 undefined
    if (obj == null) {
        return true;
    }
    
    // 处理非对象类型
    if (typeof obj !== 'object') {
        return false;
    }
    
    // 使用 Object.keys() 检查是否有可枚举属性
    return Object.keys(obj).length === 0;
}

export function getTime(n){
    var now=new Date();
    var year=now.getFullYear();
    //因为月份是从0开始的,所以获取这个月的月份数要加1才行
    var month=now.getMonth()+1;
    var date=now.getDate();
    var day=now.getDay();
    console.log(date);
    //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
    if(day!==0){
    n=n+(day-1);
    }
    else{
    n=n+day;
    }
    if(day){
    //这个判断是为了解决跨年的问题
    if(month>1){
    month=month;
    }
    //这个判断是为了解决跨年的问题,月份是从0开始的
    else{
    year=year-1;
    month=12;
    }
    }
    now.setDate(now.getDate()-n);
    year=now.getFullYear();
    month=now.getMonth()+1;
    date=now.getDate();
    console.log(n);
    return year+"-"+(month<10?('0'+month):month)+"-"+(date<10?('0'+date):date);
}

 /**
 * 获取数值的小数位数，支持科学计数法（例如 1.23e-2 -> 4 位小数）。
 * @param {number} value - 要检测的数值
 * @returns {number} - 实际的小数位数；无效输入返回 0
 */
export function getDecimalPlaces(value) {
    // 非数字或无穷大时直接返回 0
    if (typeof value !== 'number' || !Number.isFinite(value)) return 0;

    const s = value.toString().toLowerCase();

    // 不含科学计数法
    if (!s.includes('e')) {
        const dot = s.indexOf('.');
        return dot === -1 ? 0 : s.length - dot - 1;
    }

    // 科学计数法：拆分系数与指数
    const [coef, expStr] = s.split('e');
    const exp = parseInt(expStr, 10) || 0;
    const dot = coef.indexOf('.');
    const fracLen = dot === -1 ? 0 : coef.length - dot - 1;

    // 正指数向右移小数点，减少小数位；负指数向左移，增加小数位
    return exp >= 0 ? Math.max(0, fracLen - exp) : fracLen + Math.abs(exp);
}


/**
 * 将数值转换为百分比字符串，保留最少 minDecimals 位小数、最多 maxDecimals 位小数。
 * 会先按最大精度计算，再去除多余的尾随 0，但至少保留最小位数。
 * @param {number} value - 原始数值（如 0.1234 表示 12.34%）
 * @param {number} [minDecimals=2] - 最少保留的小数位
 * @param {number} [maxDecimals=4] - 最多保留的小数位
 * @returns {string} - 格式化后的百分比字符串；无效输入返回空字符串
 */
export function toPercent(value, minDecimals = 2, maxDecimals = 4) {
    // 非数字或无穷大直接返回空字符串
    if (typeof value !== 'number' || !Number.isFinite(value)) return '';

    if(maxDecimals<minDecimals){
      maxDecimals = minDecimals;
    }
    // 归一化精度范围，避免传入异常值
    const minD = Math.max(0, Math.min(minDecimals, maxDecimals));
    const maxD = Math.max(minD,Math.min(getDecimalPlaces(value), maxDecimals));

    // 先按最大精度进行四舍五入
    const pct = value * 100;
    const factor = 10 ** maxD;
    const rounded = Math.round(pct * factor) / factor;

    // 先用最大位数格式化，再去掉多余尾随 0，但保留至少 minD 位
    let str = rounded.toFixed(maxD);
    if (maxD > minD) {
        str = str.replace(/(\.\d*?[1-9])0+$/u, '$1');
        str = str.replace(new RegExp(`\\.(\\d{0,${minD}})$`), (m, digits) =>
            `.${digits.padEnd(minD, '0')}`
        );
    }
    return str + '%';
}

/**
 * 把数值格式化为字符串
 * @param {number|string} value 原始数值
 * @param {number} [minDecimals=2] - 最少保留的小数位，默认 2
 * @param {number} [maxDecimals=4] - 最多保留的小数位，默认 2
 */
export function numberformat(value, minDecimals = 2,maxDecimals=4) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return `0`;

  if(maxDecimals<minDecimals){
    maxDecimals = minDecimals;
  }
  if(maxDecimals!=minDecimals){
    maxDecimals = Math.max(minDecimals,Math.min(getDecimalPlaces(value), maxDecimals));
  }

  return `${amount.toLocaleString(undefined, {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
  })}`;
}

/**
 * 把数值格式化为货币字符串
 * @param {number|string} value 原始数值
 * @param {number} fractionDigits 小数位数，默认 2
 * @param {string} symbol 货币符号，默认 $
 */
export function formatCurrency(value, fractionDigits = 2, symbol = '$') {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return `${symbol}0`;

  return `${symbol}${numberformat(value,fractionDigits,fractionDigits)}`;
}

/**
 * 将日期格式化为指定字符串。
 * 支持的占位符：YYYY、YY、MM、DD、HH、mm、ss。
 * @param {Date|string|number} input - Date 对象或可被 Date 解析的值
 * @param {string} [pattern='YYYY-MM-DD HH:mm:ss'] - 目标格式
 * @returns {string} - 格式化后的日期；无效输入返回空字符串
 */
export function formatDate(input, pattern = 'YYYY-MM-DD HH:mm:ss') {
    if (input == null) return '';
    const date = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(date.getTime())) return '';

    const pad2 = (n) => String(n).padStart(2, '0');
    const tokens = {
        YYYY: date.getFullYear(),
        YY: String(date.getFullYear()).slice(-2),
        MM: pad2(date.getMonth() + 1),
        DD: pad2(date.getDate()),
        HH: pad2(date.getHours()),
        mm: pad2(date.getMinutes()),
        ss: pad2(date.getSeconds()),
    };

    return pattern.replace(/YYYY|YY|MM|DD|HH|mm|ss/g, (token) => tokens[token]);
}
 
export function isFunction(x) {
  return typeof x === "function";
}


export function isUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}


/**
 * 处理占位符参数替换，支持 {0}、{1} 等位置占位符。
 * @param {string} content - 原始模板字符串
 * @param {Array} params - 替换参数数组
 * @returns {string} - 替换后的字符串；入参不合法时返回原文
 */
export function format(content, params) {
    if (!content) return content;
    if (!Array.isArray(params)) return content;

    return content.replace(/\{(\d+)\}/g, (match, index) => {
        const i = Number(index);
        return i in params ? params[i] : match;
    });
}

/**
 * 按钮防重入包装器
 * 用于防止按钮在异步操作完成前被重复点击
 * @param {Object} btnLoading - 按钮加载状态对象 { [btnName]: boolean }
 * @param {Function} setBtnLoading - 设置按钮加载状态的函数
 * @param {string} btnName - 按钮的唯一标识符，用于跟踪按钮状态
 * @param {Function} fn - 需要执行的按钮点击处理函数
 * @returns {Promise|undefined} - 如果fn返回Promise则返回该Promise，否则返回undefined
 */
export function withBtnLoading(btnLoading, setBtnLoading, btnName, fn) {
    // 检查按钮是否正在执行中，如果是则直接返回，防止重复提交
    if(btnLoading?.[btnName]){
        return;
    }
    // 设置按钮为加载中状态
    setBtnLoading({ ...btnLoading, [btnName]: true });
    
    // 定义重置按钮状态的函数
    const resetLoading = () => {
        setBtnLoading({ ...btnLoading, [btnName]: false });
    };

    try {
        // 执行按钮的点击处理函数
        const result = fn();
        // 如果返回的是Promise对象，则在finally中重置按钮状态
        if (result && typeof result.finally === 'function') {
            return result.finally(resetLoading);
        }
        // 如果是同步函数，立即重置按钮状态
        resetLoading();
        return result;
    } catch (error) {
        // 发生异常时也要重置按钮状态
        resetLoading();
        throw error;
    }
}

export default {
  pad: pad,
  copyObject: copyObject,
  isNullOrEmpty: isNullOrEmpty,
  compare: compare,
  objectToArray: objectToArray,
  scroll: scroll,
  totalObjFormat:totalObjFormat,
  isObject:isObject,
  isEmptyObject:isEmptyObject,
  getTime:getTime,
  getDecimalPlaces:getDecimalPlaces,
  toPercent:toPercent,
  numberformat:numberformat,
  formatCurrency:formatCurrency,
  formatDate:formatDate,
  isFunction:isFunction,
  isUrl:isUrl,
  format:format,
  withBtnLoading:withBtnLoading
};