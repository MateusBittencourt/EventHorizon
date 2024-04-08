import { getRequest, patchRequest } from './restRequest.js';

export const setCalorieGoal = async (caloriesGoal_string, api) => {
    const caloriesGoal = parseInt(caloriesGoal_string);
    const data = { caloriesGoal };
    return await patchRequest('user/v1/caloriesGoal', data, api);
};

export const getCalorieGoal = async (api) => {
    return await getRequest('user/v1/caloriesGoal', api);
};

