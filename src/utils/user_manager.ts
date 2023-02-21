import {UserProperty} from "../api/types";

export class UserManager {
    private store: any;
    private _roomId: string;
    private _speechUserMap: Map<number, number>; // K: uid   V: timestamp
    private _captainUserMap: Set<number>; // uid[]
    private _giftGiverMap: Map<number, number>; // K: uid   V: acc consumed value
    private _speechTimeMap: Map<number, number>; // K: uid   V: speech times


    constructor(roomId: string, instance: any) {
        this._roomId = roomId;
        this.store = instance;
        this._speechUserMap = new Map<number, number>();
        this._captainUserMap = new Set<number>();
        this._giftGiverMap = new Map<number, number>();
        this._speechTimeMap = new Map<number, number>();
    }

    incSpeechTime(uid: number) {
        if (this._speechTimeMap.has(uid)) {
            const now = this._speechTimeMap.get(uid);
            this._speechTimeMap.set(uid, now + 1);
        } else this._speechTimeMap.set(uid, 1)
    }

    updateSpeechTimestamp(uid: number, timestamp: number) {
        this._speechUserMap.set(uid, timestamp);
    }

    hasSpeechRecord(uid: number) {
        return this._speechUserMap.has(uid);
    }

    getSpeechRecord(uid: number) {
        return this._speechUserMap.get(uid);
    }

    getSpeechTime(uid: number) {
        return this._speechTimeMap.get(uid) | 0;
    }

    addCaptain(uid: number) {
        this._captainUserMap.add(uid);
    }

    isCaptain(uid: number) {
        return this._captainUserMap.has(uid);
    }

    addGiftRecord(uid: number, value: number) {
        if (this._giftGiverMap.has(uid)) {
            const now = this._giftGiverMap.get(uid);
            this._giftGiverMap.set(uid, now + value);
        } else this._giftGiverMap.set(uid, value)
    }

    isGiver(uid: number) {
        return this._giftGiverMap.has(uid);
    }

    getGiftRecord(uid: number) {
        return this._giftGiverMap.get(uid) | 0;
    }

    calDanmakuAndWeight(uid: number) {
        let weight = 1, property = UserProperty.NormalUser;
        // 当总开关开启时才进行计算
        if (this.store.specialDanmakuSwitch) {
            // 计算发言次数是否达标
            if (this.getSpeechTime(uid) >= this.store.messageConfig.triggerThresh && this.store.messageConfig.status) {
                weight = Math.max(this.store.messageConfig.votingWeight, weight);
            }
            // 计算是否送过礼物
            if (this.getGiftRecord(uid) >= this.store.giftConfig.triggerThresh && this.store.giftConfig.status) {
                weight = Math.max(this.store.giftConfig.votingWeight, weight);
                property = UserProperty.Giver;
            }
            // 计算是否是舰长
            if (this.isCaptain(uid) && this.store.captainConfig.status) {
                property = UserProperty.Captain
                weight = Math.max(this.store.captainConfig.votingWeight, weight);
            }
        }
        return {
            weight: weight,
            property: property
        };
    }

    get speechUserMap(): Map<number, number> {
        return this._speechUserMap;
    }

    get captainUserMap(): Set<number> {
        return this._captainUserMap;
    }

    get giftGiverMap(): Map<number, number> {
        return this._giftGiverMap;
    }

    get speechTimeMap(): Map<number, number> {
        return this._speechTimeMap;
    }


}
