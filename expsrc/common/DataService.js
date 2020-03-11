import Fetch from "./Fetch";

export function GetData(table,page,number,conditions,cb) {
    Fetch('/service/def/get_data',{
        table_name:table,
        page:page,
        number:number,
        conditions:conditions
    },(res)=>{
        cb(res)
    },(e)=>{
        cb(e)
    })
}

export function ComboSearch(source,rowSource) {
    let condition = {
        field:source,
        value:'',
        flag:'like'
    };
    condition[source] = '';
    return (search,callback)=>{
        condition.value = search+'%';
        GetData(rowSource,1,50,[
            condition
        ],(res)=>{
            if (res.status) {
                callback(res.data.list);
            } else {
                callback(null);
            }
        });
    };
}