import { postRequest } from './restRequest.js';

export const makeStep = async (api) => {
    return await postRequest('workout/v1/makeStep', {}, api);
}