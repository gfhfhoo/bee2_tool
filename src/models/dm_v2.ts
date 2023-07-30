import {INFO_DANMU} from "../api/types"

export class DM_V2 {
    static from_json(json: Object): INFO_DANMU {
        return {
            badge: undefined, color: 0, msg: "", timestamp: 0, uid: 0, uname: ""
        }
    }
}