/**
 * Created by clakeboy on 2017/4/19.
 */
let Storage = {
    set   : function (key, value) {
        if (window.localStorage) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    },
    get   : function (key) {
        if (window.localStorage) {
            return JSON.parse(localStorage.getItem(key));
        } else {
            return null;
        }
    },
    clear : function () {
        if (window.localStorage) {
            localStorage.clear();
        }
    },
    remove: function (key) {
        if (window.localStorage) {
            localStorage.removeItem(key);
        }
    }
};
export default Storage;