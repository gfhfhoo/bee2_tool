import {defineStore} from 'pinia';
import {CaptainConfig, FilterConfig, GiftConfig, MessageConfig} from "../api/types";
import {Filter, FILTER, FilterManager} from "../utils/filter_manager";
import {
    RULE_LIMIT_REPEAT_DANMU_BY_CHARS,
    RULE_LIMIT_REPEAT_DANMU_BY_NORMAL,
    RULE_LIMIT_REPEAT_DANMU_BY_PARTICIPLE, RULE_LIMIT_SAME_USER_DANMU
} from "../utils/util";
import {DataTransformer} from "../utils/data_transformer";

export const useConfigStore = defineStore('config', {
    state: () => {
        return {
            // 通用状态
            status: "未连接",
            shortRoomId: "",
            roomId: "",
            isOnStat: false,
            countdown: 60,
            filterConfig: {
                rule: 1,
                method: 1,
                interval: -1,
                thresh$2: 0.8,
                thresh$3: 0.8
            } as FilterConfig,
            keys: [],
            filterManager: new FilterManager(),
            specialDanmakuSwitch: false,
            rankingSwitch: false,
            captainConfig: {
                status: false,
                votingWeight: 2,
            } as CaptainConfig,
            giftConfig: {
                status: false,
                triggerThresh: 50,
                votingWeight: 2
            } as GiftConfig,
            messageConfig: {
                status: false,
                triggerThresh: 50,
                votingWeight: 2
            } as MessageConfig,
            showPlayerData: false,
            transformer: new DataTransformer(),
        }
    },
    actions: {
        bindUserSpeechIntervalFn() {
            this.filterManager.addOrSetFilter(new Filter(FILTER.LIMIT_SAME_USER_DANMU, RULE_LIMIT_SAME_USER_DANMU));
        },

        bindUserRepeatDanmakuFn(method, isOn = true) {
            this.filterManager.addOrSetFilter(new Filter(FILTER.LIMIT_REPEAT_DANMU, method, isOn));
        },
        setFilter() {
            switch (this.filterConfig.method) {
                case 1:
                    this.bindUserRepeatDanmakuFn(RULE_LIMIT_REPEAT_DANMU_BY_NORMAL);
                    break;
                case 2:
                    this.bindUserRepeatDanmakuFn(RULE_LIMIT_REPEAT_DANMU_BY_CHARS);
                    break;
                case 3:
                    this.bindUserRepeatDanmakuFn(RULE_LIMIT_REPEAT_DANMU_BY_PARTICIPLE);
                    break;
            }
        },
        setFilterStatus() {
            switch (this.filterConfig.rule) {
                case 1:
                    this.filterManager.setAFilterStatus(FILTER.LIMIT_REPEAT_DANMU, false);
                    break;
                case 2:
                    this.filterManager.setAFilterStatus(FILTER.LIMIT_REPEAT_DANMU, true);
                    break;
            }
        }
    }
})
