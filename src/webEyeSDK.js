import performance from './performance/index';
import error from './error/index';
import behavior from './behavior/index';
import { setConfig } from './config';
window.__webEyeSDK__ = {
    version: '0.0.1',
}

// 针对Vue项目的错误捕获
export function install (Vue, options) {
    if (__webEyeSDK__.vue) return;
    __webEyeSDK__.vue = true;
    const handler = Vue.config.errorHandler;
    // vue项目中 通过 Vue.config.errorHandler 捕获错误
    Vue.config.errorHandler = function (err, vm, info) {
        // todo: 上报具体的错误信息
        if (handler) {
            handler.call(this, err, vm, info);
        }
    };
}
// 针对React项目的错误捕获
function errorBoundary(err) {
    if (__webEyeSDK__.react) return;
    __webEyeSDK__.react = true;
    // todo: 上报具体的错误信息

} 
export function init (options) {
    setConfig(options)
    
}


export default {
    install,
    errorBoundary,
    performance,
    error,
    behavior,
    init,
}

// webEyeSDK.init({
//     appId: '10000',
//     batchSize: 50,

// })