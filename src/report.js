import config from './config';
import {generateUniqueId} from './utils';
import {addCache, getCache, clearCache} from './cache';
export const originalProto = XMLHttpRequest.prototype;
export const originalOpen = XMLHttpRequest.prototype.open;
export const originalSend = XMLHttpRequest.prototype.send;
export function isSupportSendBeacon() {
    return 'sendBeacon' in navigator;
}
export function report(data) {
    if (!config.url) {
        console.error('请设置上传 url 地址')
    }
    const reportData = JSON.stringify({
        id: generateUniqueId(),
        data
    })
    // 发送数据, 优先使用 sendBeacon
    const value = beaconRequest(config.url, reportData);
    if (!value) {
        // 上报数据，使用图片的方式
        config.isImageUpload? imgRequest(reportData): xhrRequest(reportData)
    }
}
// 批量上报数据
export function lazyReportBatch(data) {
    addCache(data);
    const dataCache  = getCache();
    if (dataCache.length && dataCache.length> config.batchSize) {
        report(dataCache);
        clearCache();
    }
    // 
}
// 发送图片数据
export function imgRequest(data) {
    const img = new Image();
    // http://127.0.0.1:8080/api?data=encodeURIComponent(data)
    img.src = `${config.url}?data=${encodeURIComponent(JSON.stringify(data))}`

}
// 普通ajax发送请求数据
export function xhrRequest(url, data){
    if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
            const xhr = new XMLHttpRequest();
            originalOpen.call(xhr, 'post', url);
            originalSend.call(xhr, JSON.stringify(data));
        }, { timeout: 3000 });

    } else {
        setTimeout(() =>{
            const xhr = new XMLHttpRequest();
            originalOpen.call(xhr, 'post', url);
            originalSend.call(xhr, JSON.stringify(data));
        });
    }

}


// const sendBeacon = isSupportSendBeacon() ? navigator.sendBeacon : xhrRequest;
export function beaconRequest(data) {
    let flag = true;
    if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
            return flag = sendBeacon(config.url ,data);
        }, { timeout: 3000 });

    } else {
        setTimeout(() =>{
            return  flag = sendBeacon(config.url, data)
        });
    }


}