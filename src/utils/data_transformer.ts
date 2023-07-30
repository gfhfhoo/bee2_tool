import {emitter} from "../api/emitter";

export class DataTransformer {

    private readonly _before: Map<number, number>; // uid -- 参与次数

    constructor() {
        this._before = new Map<number, number>();
    }

    get before(): Map<number, number> {
        return this._before;
    }

    private static mapToObj(map: Map<number, number>) {
        let obj = Object.create(null);
        for (let key of map.keys()) {
            obj[key] = map.get(key);
        }

        return obj;
    }

    load(str: string) {
        if (str === "") return;
        let obj = JSON.parse(str);
        for (let key of Object.keys(obj)) {
            this._before.set(Number(key), obj[key]);
        }
    }

    transform(map: Map<number, number>) {
        for (let key of map.keys()) {
            let v = map.get(key);
            if (v > 15) {
                if (this._before.has(key)) {
                    this._before.set(key, this._before.get(key) + 1);
                } else {
                    this._before.set(key, 1);
                }
            }
        }

        return JSON.stringify(DataTransformer.mapToObj(this._before))
    }

    update() {
        emitter.emit("INTER_GET_VOTING_MAP");
    }
}
