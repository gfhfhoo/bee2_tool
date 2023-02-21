export enum FILTER {
    LIMIT_SAME_USER_DANMU,
    LIMIT_REPEAT_DANMU
}

export class Filter {
    private readonly type: FILTER;
    private readonly callback: Function;
    private isOn: boolean;

    constructor(type: FILTER, callback: Function, isOn: boolean = true) {
        this.type = type;
        this.callback = callback;
        this.isOn = isOn;
    }

    switch(status: boolean) {
        this.isOn = status;
        return true;
    }

    on() {
        this.isOn = true;
    }

    off() {
        this.isOn = false;
    }

    getType() {
        return this.type;
    }

    async execute(args?: any): Promise<boolean> {
        if (!this.isOn) return true;
        return await this.callback(args)
    }

}

export class FilterManager {
    private filters: Map<FILTER, Filter>;


    constructor() {
        this.filters = new Map<FILTER, Filter>();
    }

    addOrSetFilter(filter: Filter) {
        this.filters.set(filter.getType(), filter);
    }

    setAFilterStatus(type: FILTER, status: boolean) {
        this.filters.has(type) && this.filters.get(type).switch(status);
    }

    async executeAll(source: any) {
        let res = [];
        this.filters.forEach((v) => {
            res.push(v.execute(source))
        })
        res = await Promise.all(res);
        res.push(true);
        return res.reduce((prev, cur) => prev && cur);
    }

    async executeOne(type: FILTER, source: any) {
        if (!this.filters.has(type)) throw Error(`Not found filter type id: ${type}`);
        return await this.filters.get(type).execute(source);
    }
}
