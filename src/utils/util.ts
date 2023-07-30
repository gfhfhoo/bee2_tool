import {invoke} from "@tauri-apps/api";
import {CaptainInfo, INFO_DANMU} from "../api/types";
import {get} from "../api/api";
import {fromBase64} from "js-base64";

export const V2ToJson = function (v2: string) {
    try {
        let jString = fromBase64(v2);

    } catch (ex) {
        console.log(ex)
    }

}

export const mapToJSON = function <K, V>(map: Map<K, V>) {
    let obj = Object.create(null);
    for (let key of map.keys()) {
        obj[key] = map.get(key);
    }

    return JSON.stringify(obj);
}

export const JSONToMap = function <K, V>(str: string) {
    let obj = JSON.parse(str);
    let map = new Map<K, V>();
    for (let key of Object.keys(obj)) {
        map.set(key as K, obj[key] as V);
    }
    return map
}

export const calZScore = (li: number[], x: number): number => {
    const n = li.length;
    const mean = li.reduce((a, b) => a + b) / n
    const std = Math.sqrt(li.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
    return (x - mean) / std;
}

export const numberToAbbr = (val: number) => {
    if (val > 1000) {
        return (val / 1000).toFixed(1) + 'k';
    }
    return val;
}

export const msToAbbr = (val: number) => {
    return (val / 1000).toFixed(1) + 's';
}


export const isCaptainByDanmaku = (roomId: number | string, data: INFO_DANMU) => {
    return data.badge.roomId == roomId && data.badge.level >= 21;
}

export const msgToKey = (legend, msg) => {
    let key = "";
    legend.forEach(v => {
        const copy = v.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
        let regex = new RegExp(copy + "+", "g");
        let res = msg.match(regex);
        if (res && res.reduce((p, c) => p + c.length, 0) === msg.length) {
            key = v;
        }
    })
    return key;
}

export const getCaptainInfo = async (uid: string, roomId: string) => {
    let ret: CaptainInfo[] = [];
    for (let page = 1; ; ++page) {
        const res = await get("https://api.live.bilibili.com/xlive/app-room/v2/guardTab/topList", {
            query: {
                ruid: uid,
                roomid: roomId,
                page: page
            }
        }).then(res => res.data);
        const total = res.info.page;
        const now = res.info.now;
        res.list.forEach(v => {
            ret.push({
                uid: v.uid,
                uname: v.username,
                guardLevel: v.guard_level,
                medalLevel: v.medal_info.medal_level
            })
        })
        if (now >= total) break;
    }
    return await Promise.all(ret);
}


export const RULE_LIMIT_SAME_USER_DANMU = async (source: any) => {
    /**
     * @param baseline 下次发言至少的临界时间，-1代表不限制
     */
    const {baseline} = source;

    if (baseline == -1) return true;
    const milli = new Date().getTime();
    return milli >= baseline;
}

/**
 * 过滤刷屏弹幕（仅数字和字母）
 * @constructor
 */
export const RULE_LIMIT_REPEAT_DANMU_BY_NORMAL = async (source: any) => {
    /**
     * @param msg 消息
     * @param charsNumLower 执行判定的消息临界长度
     */
    const {msg, charsNumLower = 6} = source

    if (msg.length < charsNumLower) return true; // pass
    return !(/^[A-Za-z0-9]+$/.test(msg));
}

/**
 * 过滤刷屏弹幕（分词法）
 * @constructor
 *
 */
export const RULE_LIMIT_REPEAT_DANMU_BY_PARTICIPLE = async (source: any) => {
    /**
     * @param msg 消息
     * @param threshold 阈值
     * @param charsNumLower 执行判定的消息临界长度
     */
    const {msg, threshold = 0.8, charsNumLower = 6} = source

    if (msg.length < charsNumLower) return true; // pass

    const result: string[] = await invoke("request_jieba", {msg: msg});

    let totalTime = 0, maxTime = 0;

    result.forEach(v => {
        let regex = new RegExp(v.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"), "gi");
        let time = (msg.match(regex) || []).length;
        totalTime += time;
        maxTime = Math.max(time, maxTime);
    })

    // if (maxTime === totalTime) console.log(`equal happened: ${msg} , ${result}`);
    if (maxTime === totalTime) return msg.length < 2 * charsNumLower;
    // 这里采取一个替代方案，当超过2倍下限才拒绝

    return Math.max(maxTime / msg.length, maxTime / totalTime) <= threshold;
}

/**
 * 过滤刷屏弹幕（字符统计法）
 * @constructor
 */
export const RULE_LIMIT_REPEAT_DANMU_BY_CHARS = (source: any) => {
    /**
     * @param msg 消息
     * @param threshold 阈值
     * @param charsNumLower 执行判定的消息临界长度
     */
    const {msg, threshold = 0.8, charsNumLower = 6} = source

    if (msg.length < charsNumLower) return true; // pass
    let map = new Map<number, number>();
    for (let i = 0; i < msg.length; ++i) {
        let charCode = msg.charCodeAt(i);
        if (map.has(charCode)) {
            let val = map.get(charCode);
            map.set(charCode, val + 1);
        } else {
            map.set(charCode, 0);
        }
    }
    let max_repeat = 0;
    map.forEach((value) => {
        if (value > max_repeat) max_repeat = value;
    })
    return max_repeat / msg.length <= threshold;
}
