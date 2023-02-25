import {defineStore} from "pinia";
import {msToAbbr, numberToAbbr} from "../utils/util";

export const useStatStore = defineStore('stat', {
    state: () => {
        return {
            _votingDanmaku: 0,
            _giftValues: 0,
            online: 0, // 高能榜
            maxOnline: 0, // 高能榜maxOnline
            speechedNum: 0, // 发言过的人
            speechedTime: 0, // 发言过的次数
            _avgEffStay: 0, // 平均停留时长
            _votingRatio: 0,
        }
    },
    actions: {
        incAccVotingDanmaku() {
            this._votingDanmaku++;
        }
    },
    getters: {
        attendance: (state) => {
            return numberToAbbr(state.online);
        },
        votingDanmaku: (state) => {
            return numberToAbbr(state._votingDanmaku);
        },
        giftValues: (state) => {
            return numberToAbbr(state._giftValues);
        },
        speechRate: (state) => {
            if (state.online === 0 || state.speechedNum > state.online) return 0;
            return state.speechedNum * 100 / state.maxOnline;
        },
        avgSpeechTimes: (state) => {
            if (state.speechedNum === 0) return '0';
            return (state.speechedTime / state.speechedNum).toFixed(1);
        },
        avgEffStay: (state) => {
            return msToAbbr(state._avgEffStay);
        },
        attendVotingRatio: (state) => {
            if (state._votingRatio === 0) return 0;
            return state._votingRatio * 100;
        }
    }
})
