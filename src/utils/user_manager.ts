import {UserProperty} from "../api/types";

export interface timestamp {
    first: number,
    now: number,
    diff: number
}

export class UserManager {
    private store: any;
    private statStore: any;
    private _roomId: string;
    private _speechUserMap: Map<number, timestamp>; // K: uid   V: timestamp
    private _captainUserMap: Set<number>; // uid[]
    private _giftGiverMap: Map<number, number>; // K: uid   V: acc consumed value
    private _speechTimeMap: Map<number, number>; // K: uid   V: speech times
    private _votingTimeMap: Map<number, number>; // K: uid   V: acc voting times
    private _onlineRankingMap: Map<number, number>;
    private _maxVotingTimes: number;


    constructor(roomId: string, instance: any, instance1: any) {
        this._roomId = roomId;
        this.store = instance;
        this.statStore = instance1;
        this._maxVotingTimes = 0;
        this._speechUserMap = new Map<number, timestamp>();
        this._captainUserMap = new Set<number>();
        this._giftGiverMap = new Map<number, number>();
        this._speechTimeMap = new Map<number, number>();
        this._votingTimeMap = new Map<number, number>();
        this._onlineRankingMap = new Map<number, number>();
    }

    incVotingTime(uid: number) {
        if (this._votingTimeMap.has(uid)) {
            const now = this._votingTimeMap.get(uid);
            this._votingTimeMap.set(uid, now + 1);
            this._maxVotingTimes = Math.max(now + 1, this._maxVotingTimes);
        } else {
            this._votingTimeMap.set(uid, 1)
            this._maxVotingTimes = Math.max(1, this._maxVotingTimes);
        }

        // update calculating rule
        if (this._maxVotingTimes !== 0) {
            this.statStore._votingRatio = this.statStore._votingDanmaku / (this._maxVotingTimes * this.statStore.maxOnline);
        }
    }

    incSpeechTime(uid: number) {
        if (this._speechTimeMap.has(uid)) {
            const now = this._speechTimeMap.get(uid);
            this._speechTimeMap.set(uid, now + 1);
        } else this._speechTimeMap.set(uid, 1);

        let valueSum = 0;
        for (let value of this._speechTimeMap.values()) {
            valueSum += value;
        }
        this.statStore.speechedNum = this._speechTimeMap.size;
        this.statStore.speechedTime = valueSum;
    }

    updateSpeechTimestamp(uid: number, timestamp: number) {

        const rec = this._speechUserMap.get(uid);
        const last = rec ? rec.first : timestamp;
        this._speechUserMap.set(uid, {
            first: last,
            now: timestamp,
            diff: timestamp - last,
        });

        let keySum = 0, valueSum = 0;
        for (let value of this._speechUserMap.values()) {
            if (value.diff > 0) keySum++;
            valueSum += value.diff;
        }

        this.statStore._avgEffStay = keySum === 0 ? 0 : valueSum / keySum;
    }

    hasSpeechRecord(uid: number) {
        return this._speechUserMap.has(uid);
    }

    getSpeechRecord(uid: number) {
        return this._speechUserMap.get(uid).now;
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

        this.statStore._giftValues += value;

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

            let rank = this._onlineRankingMap.get(uid);

            if (rank && this.store.rankingSwitch) {
                property = UserProperty.RankingUser;
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

    set onlineRankingMap(value: Map<number, number>) {
        this._onlineRankingMap = value;
    }

}
