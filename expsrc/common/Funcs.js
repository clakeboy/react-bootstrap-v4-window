export function GetComponent(path) {
    return import('../view'+path).then(component=>{
        return component.default;
    }).catch(error=>{
        console.log(path);
        return 'An error occurred while loading the component '+error
    });
}

export function GetQuery(str) {
    let query = {};
    if (!str) {
        return query;
    }
    let search = str.substring(1);
    let arr = search.split('&');
    arr.forEach(function(item){
        let itemVal = item.split("=");
        query[itemVal[0]] = itemVal[1];
    });

    return query;
}