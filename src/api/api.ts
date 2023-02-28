import {fetch} from '@tauri-apps/api/http';

export const get = async (url: string, params?: any): Promise<any> => {
    return fetch(url, {
        method: "GET",
        ...params
    }).then(res => res.data);
}

export const post = async (url: string, obj: any, params?: any): Promise<any> => {
    return fetch(url, {
        method: "POST",
        body: obj,
        ...params
    }).then(res => res.data);
}
