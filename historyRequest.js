import { getRequest, postRequest, deleteRequest } from './restRequest.js';

export const getHistory = async (api) => {
    return await getRequest('history/v1/', api);
}

export const addHistory = async (data, api) => {
    return await postRequest('history/v1/', data, api);
}

export const deleteHistory = async (data, api) => {
    return await deleteRequest('history/v1/', data, api);
}