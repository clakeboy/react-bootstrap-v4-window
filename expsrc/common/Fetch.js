import 'es6-promise/auto';
import 'whatwg-fetch';

let DebugURL = '';
if (window.__DEBUG__) {
    DebugURL = window.__URL__ || 'http://localhost:9900';
}

function Fetch(url,data,fn,err) {
    fetch(DebugURL+url,{
        method: 'post',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization':'Bearer MF9eRszJXx0IRmXws3QFExxwFpAtQDCjpHdgMZ9g8hJnimFY-TvrbT6Oi9702QwEAzn9s6iAS3D3D3BFrI28NxB2VKeTTxuaHEZZys0jR8FtNmscLbBLiSTgikNoOk9Cuv93CJTOqFB-tHIIAPJJAQJDKONUNz8QQxKVixrPcnl-AUR8JzO2h7WsnAe9WsWv76HnTiazLL4vXbnScr6Xaa_oRRj358nEfH4Nhv2QURdz0mhjyUbSNQgrTZTDIhY0Zl-THV_i3rCGEY8XlWZBow',
        },
        body: JSON.stringify(data)
    }).then(function(response){
        return response.text();
    }).then(function(text){
        fn(JSON.parse(text));
    }).catch(function(ex){
        if (typeof err === 'function') {
            err(ex);
        } else {
            console.log('error: '+ex);
            if (window.__DEBUG__) alert('远程调用失败，详细请查看控制台输出');
        }
    });

}

export default Fetch;