import { postRequest } from './restRequest.js';

export const loginRequest = async (username, password) => {
    return await postRequest('access/v1/', {username, password});
}