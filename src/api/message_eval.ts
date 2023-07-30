import {emitter} from "./emitter";
import {INFO_DANMU, INFO_GIFT} from "./types";
import {Root} from "protobufjs";
import {fromBase64} from "js-base64";

function strToUint8(str: string) {
    let bytes = [];
    for (let i = 0; i < str.length; i++) {
        let abyte = str.charCodeAt(i) & 0xff;
        bytes.push(abyte);
    }
    return new Uint8Array(bytes);
}

function uint8ToStr(bytes: Uint8Array) {
    let decoder = new TextDecoder();
    return decoder.decode(bytes);
}

emitter.on("ROOM_ID", (e: any) => {
    emitter.emit("APP_ROOM_ID_UPDATE", {data: e.data});
})

emitter.on("DANMU_MSG", (e: any) => {
    // const root: Root = e.root; // protobuf
    const data = e.data.info;
    const danmu: INFO_DANMU = {
        uid: data[2][0],
        uname: data[2][1],
        msg: data[1],
        timestamp: data[0][4],
        color: data[0][3],
        badge: {
            level: data[3][0],
            name: data[3][1],
            from: data[3][2],
            roomId: data[3][3] // real room id
        }
    }
    console.log(danmu)
    emitter.emit("APP_DANMU", {data: danmu});
})

emitter.on("SEND_GIFT", (e: any) => {
    const data = e.data.data;
    if (data.giftName === '辣条' || data.giftName === '人气票') return;
    let gift: INFO_GIFT = {
        sender: data.uname,
        senderId: data.uid,
        price: data.price * data.num / 100,
        timestamp: data.timestamp,
        comboNow: -1
    }
    emitter.emit("APP_GIFT_RECEIVED", {data: gift});
})

emitter.on("SUPER_CHAT_MESSAGE", (e: any) => {
    console.log(e.data.data)
})

emitter.on("ONLINE_RANK_COUNT", (e: any) => {
    const data = e.data.data;
    emitter.emit("APP_ONLINE_COUNT", {data: data.count});
})

emitter.on("ONLINE_RANK_V2", (e: any) => {
    const data = e.data.data.list;
    let map = new Map<number, number>();

    for (let el of data) {
        map.set(el.uid, el.rank);
    }

    emitter.emit("APP_ONLINE_RANK", {data: map});
})
