import {emitter} from "./emitter";
import {get} from "./api";
import {BrotliDecode} from "../utils/decode"
import WebSocket from "tauri-plugin-websocket-api";
import {load, Root} from "protobufjs";

interface Packet {
    packetLen?: number
    headerLen?: number
    ver?: number
    op?: number
    seq?: number
    body: MessageBody
}

type MessageBody = CountMessageData | MessageData | MessageData[]

const WS_CODE = {
    // 心跳包
    WS_OP_HEARTBEAT: 2,

    // 心跳应答包
    WS_OP_HEARTBEAT_REPLY: 3,

    // 消息包
    WS_OP_MESSAGE: 5,

    // 用户认证包
    WS_OP_USER_AUTHENTICATION: 7,

    // 连接成功通知包
    WS_OP_CONNECT_SUCCESS: 8,

    // 包头大小
    WS_PACKAGE_HEADER_TOTAL_LENGTH: 16,

    // 包偏移
    WS_PACKAGE_OFFSET: 0,

    // 包头偏移
    WS_HEADER_OFFSET: 4,

    // 版本号偏移
    WS_VERSION_OFFSET: 6,

    // OP 偏移
    WS_OPERATION_OFFSET: 8,

    // 序列号偏移
    WS_SEQUENCE_OFFSET: 12,

    // 普通消息体(json格式)
    WS_BODY_PROTOCOL_VERSION_NORMAL: 0,

    // BROTLI消息体(采用Brotli编码的)
    WS_BODY_PROTOCOL_VERSION_BROTLI: 3,

    // 消息头默认版本
    WS_HEADER_DEFAULT_VERSION: 1,

    // 消息头默认OP
    WS_HEADER_DEFAULT_OPERATION: 1,

    // 消息头默认序列号
    WS_HEADER_DEFAULT_SEQUENCE: 1,

    // 认证成功
    WS_AUTH_OK: 0,

    // 认证token错误
    WS_AUTH_TOKEN_ERROR: -101
}

const wsBinaryHeaderList: WSBinaryHeader[] = [
    {
        name: "Header Length",
        key: "headerLen",
        bytes: 2,
        offset: 4,
        value: 16
    },
    {
        name: "Protocol Version",
        key: "ver",
        bytes: 2,
        offset: 6,
        value: 1
    },
    {
        name: "Operation",
        key: "op",
        bytes: 4,
        offset: 8,
        value: 1
    },
    {
        name: "Sequence Id",
        key: "seq",
        bytes: 4,
        offset: 12,
        value: 1
    }
]

interface WSBinaryHeader {
    name: string
    key: "headerLen" | "ver" | "op" | "seq"
    bytes: number
    offset: number
    value: number
}

interface MessageData {
    cmd: string
}

interface CountMessageData {
    count: number
}

const convertObj = (buff: ArrayBuffer) => {

    const decoder = new TextDecoder();
    const dataView = new DataView(buff);
    const data: Packet = {
        body: [],
    }

    data.packetLen = dataView.getInt32(WS_CODE.WS_PACKAGE_OFFSET)
    wsBinaryHeaderList.forEach(head => {
        if (head.bytes === 4) {
            data[head.key] = dataView.getInt32(head.offset)
        } else if (head.bytes === 2) {
            data[head.key] = dataView.getInt16(head.offset)
        }
    })

    if (!data.op || WS_CODE.WS_OP_MESSAGE !== data.op && data.op !== WS_CODE.WS_OP_CONNECT_SUCCESS) {
        if (data.op === WS_CODE.WS_OP_HEARTBEAT_REPLY) {
            data.body = {
                count: dataView.getInt32(WS_CODE.WS_PACKAGE_HEADER_TOTAL_LENGTH)
            }
        }
    } else {
        let a = 0
        let u: MessageBody | null = null
        for (let i = WS_CODE.WS_PACKAGE_OFFSET, s = data.packetLen; i < buff.byteLength; i += s) {
            s = dataView.getInt32(i)
            a = dataView.getInt16(i + WS_CODE.WS_HEADER_OFFSET)
            try {
                if (data.ver === WS_CODE.WS_BODY_PROTOCOL_VERSION_NORMAL) {
                    const c = decoder.decode(buff.slice(i + a, i + s))
                    u = 0 !== c.length ? JSON.parse(c) : null
                } else if (data.ver === WS_CODE.WS_BODY_PROTOCOL_VERSION_BROTLI) {
                    const l = buff.slice(i + a, i + s)
                    const h = BrotliDecode(new Uint8Array(l));
                    u = convertObj(h.buffer).body
                }
                u && (data.body as unknown[]).push(u)
            } catch (err) {
                console.log("decode body error:", new Uint8Array(buff), data, err)
            }
        }
    }

    return data
}

const getCertification = (json) => {
    let encoder = new TextEncoder();    //编码器
    let jsonView = encoder.encode(json);    //utf-8编码
    let buff = new ArrayBuffer(jsonView.byteLength + 16);    //数据包总长度：16位头部长度+bytes长度
    let view = new DataView(buff);    //新建操作视窗
    view.setUint32(0, jsonView.byteLength + 16);    //整个数据包长度
    view.setUint16(4, 16);    //头部长度
    view.setUint16(6, 1);    //协议版本
    view.setUint32(8, 7);    //类型,7为加入房间认证
    view.setUint32(12, 1);    //填1
    for (let r = 0; r < jsonView.byteLength; r++) {
        view.setUint8(16 + r, jsonView[r]);    //填入数据
    }
    return Array.prototype.slice.call(new Uint8Array(buff));
}

export class BilibiliWebsocket {
    private readonly _roomId: string;
    private readonly _affairId: number;
    private realRoomId: string;
    private roomOwner: number;
    private key: string;
    private host: string;
    private instance: WebSocket;
    private timer: any;
    private _connected: boolean;

    private protoUrl: string;
    private root: Root;

    constructor(roomId: string, proto: string) {
        this._roomId = roomId;
        this._affairId = parseInt((Math.random() * 1e6).toFixed(0));
        this.protoUrl = proto
        this.connect()
        emitter.on("WS_BREAK", (e: any) => {
            this.fail(e.id);
        })
    }

    private async getConfig() {
        const url0 = `https://api.live.bilibili.com/room/v1/Room/room_init?id=${this._roomId}`;
        const data0 = await get(url0).then(res => res.data);
        this.realRoomId = data0['room_id'];
        this.roomOwner = data0['uid'];
        emitter.emit("ROOM_ID", {data: this.realRoomId});
        const url1 = `https://api.live.bilibili.com/room/v1/Danmu/getConf?room_id=${this.realRoomId}&platform=pc&player=web`
        const data1 = await get(url1).then(res => res.data);
        this.key = data1['token']
        this.host = data1['host'];
    }

    async verify() {
        let cert = {
            'uid': this.roomOwner,
            "roomid": this.realRoomId,
            "protover": 3,
            "platform": "web",
            "type": 2,
            "key": this.key
        }
        console.log(cert)
        await this.instance.send(getCertification(JSON.stringify(cert)));
        this.timer = setInterval(() => {
            let buff = new ArrayBuffer(16);
            let i = new DataView(buff);
            i.setUint32(0, 0);
            i.setUint16(4, 16);
            i.setUint16(6, 1);
            i.setUint32(8, 2);
            i.setUint32(12, 1);
            this.instance.send(Array.prototype.slice.call(new Uint8Array(buff)));
        }, 30000)
    }

    async connect() {
        this.root = await load(this.protoUrl);
        await this.getConfig();
        this.instance = await WebSocket.connect(`wss://${this.host}/sub`);
        this.instance.addListener((e: any) => {
            const buffer = e.data;
            if (buffer.length == 0) return;
            let res = convertObj(new Uint8Array(buffer).buffer);

            if (res.op === 5) {
                let arr = res.body[0];
                for (let j = 0; j < arr.length; ++j) {
                    emitter.emit(arr[j].cmd, {root: this.root, affairId: this._affairId, data: arr[j]});
                }
            }
        })
        await this.verify();
        this._connected = true;
    }

    async disconnect() {
        await this.instance.disconnect();
        this._connected = false;
        if (this.timer != null) {
            clearInterval(this.timer);
        }
    }

    private fail(id: number) {
        id === this._affairId && this.disconnect();
    }

    get affairId(): number {
        return this._affairId;
    }

    get connected(): boolean {
        return this._connected;
    }
}
