export interface INFO_DANMU {
    uid: number, // 用户ID
    uname: string, // 用户名称
    msg: string, // 弹幕消息
    timestamp: number, // 发送时间戳
    color: number, // 弹幕文字颜色
    badge: Badge, // 用户勋章
}

export interface INFO_GIFT {
    senderId: number, // 用户ID
    sender: string, // 用户名称
    price: number, // 耗费电池
    timestamp: number, // 送礼时间戳
    comboNow: number, // 当前同用户送礼combo
}

export interface Badge {
    level: number, // 勋章等级
    name: string, // 勋章名字
    from: string, // 勋章来源主播
    roomId: number // 勋章来源房间ID
}

export interface SUPER_CHAT {
    uid: string, // 用户ID
    uname: string, // 用户名
    duration: number, // 持续时间(s)
    price: number, // 耗费电池
}


export interface STAT_PAYLOAD {
    uid: number,
    msg: string,
    weight: number
}


export interface FilterConfig {
    rule: number;
    method: number;
    interval: number;
    thresh$2: number;
    thresh$3: number;
}

export interface CaptainConfig {
    status: boolean;
    votingWeight: number;
}

export interface GiftConfig {
    status: boolean;
    triggerThresh: number;
    color: string;
    votingWeight: number;
}

export interface MessageConfig {
    status: boolean;
    triggerThresh: number;
    votingWeight: number;
}

export enum UserProperty {
    NormalUser,
    Giver,
    Captain,
    RankingUser
}

export interface CaptainInfo {
    uid: string,
    uname: string,
    guardLevel: number,
    medalLevel: number,
}
