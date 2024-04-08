import {
    input,
    password as pwd,
    select
} from '@inquirer/prompts';

import subscribe from './subscriber.js';
import { loginRequest } from './accessRequests.js';
import { setCalorieGoal } from './userRequest.js';
import { addHistory } from './historyRequest.js';
import { makeStep } from './workoutRequests.js';

let token = '';
let userId = '';
let flag = true;
let walking = false;

const set_calorie_goal_question = async () => {
    const calorie_goal = await input({
        message: 'Enter your calorie goal',
    });

    const response = await setCalorieGoal(calorie_goal, token);
    if (response.success) {
        console.log('Calorie goal set successfully');
    }
};

const add_history_individually = async () => {
    const foodId = await input({
        message: 'Enter the food id',
    });
    const weight = await input({
        message: 'Enter the weight',
    });
    const meal = await select({
        message: 'Select an option',
        choices: [
            {
                name: 'Breakfast',
                value: 'Breakfast'
            },
            {
                name: 'Lunch',
                value: 'Lunch'
            },
            {
                name: 'Afternoon Tea',
                value: 'Afternoon Tea'
            },
            {
                name: 'Dinner',
                value: 'Dinner'
            }
        ],
    });
    const response = await addHistory({ foodId, weight, meal }, token);
    if (response.success) {
        console.log('History added successfully');
    }
};

const add_history_predefined = async () => {
    await addHistory({ foodId: '50', weight: '100', meal: 'Breakfast' }, token);
    await addHistory({ foodId: '230', weight: '30', meal: 'Breakfast' }, token);
    await addHistory({ foodId: '364', weight: '200', meal: 'Lunch' }, token);
    await addHistory({ foodId: '401', weight: '150', meal: 'Lunch' }, token);
};


const add_history_question = async () => {
    const choice = await select({
        message: 'How you want to add the history',
        choices: [
            {
                name: 'Individually',
                value: 'individually'
            },
            {
                name: 'Predefined',
                value: 'predefined'
            }
        ],
    });
    switch (choice) {
        case 'individually':
            await add_history_individually();
            break;
        case 'predefined':
            await add_history_predefined();
            break;
    }   
};

const listen_events_question = async () => {
    console.log('Listening to events');
    subscribe(`notification:${userId}`, userId, (message) => {
        console.log(message);
    });

    subscribe(`alert:${userId}`, userId, (message) => {
        console.log(message);
    });

    flag = false;
};

const starting_question = async () => {
    const answer = await select({
        message: 'Select an option',
        choices: [
            {
                name: 'Add History',
                value: 'addHistory',
                description: 'Add a new history entry',
            },
            {
                name: 'Set Calorie Goal',
                value: 'calorieGoal',
                description: 'Set a new calorie goal',
            },
            {
                name: walking ? 'Stop walking' : 'Start walking',
                value: 'walk',
                description: 'Start or stop walking',
            },
            {
                name: 'Listen to events',
                value: 'listenEvents',
                description: 'Start listening to events',
            }
        ],
    });
    console.log(answer);

    if (answer === 'login') {
        await login_question();
    } else if (answer === 'addHistory') {
        await add_history_question();
    } else if (answer === 'calorieGoal') {
        await set_calorie_goal_question();
    } else if (answer === 'listenEvents') {
        await listen_events_question();
    } else if (answer === 'walk') {
        walking = !walking;
    }
};

setInterval(() => {
    if (walking) {
        makeStep(token);
    }
}, 5000);

while (flag) {
    if (token === '') {
        const username = await input({
            message: 'Enter your username',
        });
        const password = await pwd({
            message: 'Enter your password',
        });
    
        const login = await loginRequest(username, password);
        if(login.success) {
            token = login.data.accessToken;
            userId = login.data.userId;
            console.log('Login successful');
            console.log('Token:', token);
            console.log('UserId:', userId);
        }
    } else {
        await starting_question();
    }
};
