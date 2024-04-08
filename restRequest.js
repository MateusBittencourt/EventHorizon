import fetch from 'node-fetch';

const IP = process.env.IP;

export const getRequest = async (service, api = "") => {
    const response = await fetch('https://' + IP + '/' + service, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': api
        }
    });
    return response.json(); // Assuming the server responds with JSON
};

export const postRequest = async (service, data, api = "") => {
    const url = 'https://' + IP + '/' + service;
    let body
    try {
        body = JSON.stringify(data)
    } catch (e) {
        body = {}
    }
    const response = await fetch(url, {
        method: 'POST',
        body,
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': api
        }
    });
    return response.json();
};

export const patchRequest = async (service, data, api = "") => {
    const response = await fetch('https://' + IP + '/' + service, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': api
        }
    });
    return response.json();
};

export const updateRequest = async (service, data,  api = "") => {
    const response = await fetch('https://' + IP + '/' + service, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': api
        }
    });
    return response.json();
};

export const deleteRequest = async (service,  api = "") => {
    const response = await fetch('https://' + IP + '/' + service, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': api
        }
    });
    return response.json();
};