import {useReducer, useEffect} from "react";

// This is the default state on the first launch of the app.
const defaultLists = JSON.stringify({
    work: {items: []},
    home: {items: []},
});

const initialTasksState = {
    lists: JSON.parse(localStorage.getItem('todos') ?? defaultLists),
    item: 0,
};

// Save the data to the disk at every update.
const save = (state) => {
    localStorage.setItem('todos', JSON.stringify(state));
};

// Handle all the action that the tasks can have.
const reducer = (state, {type, payload, navigation}) => {
    if (['help', 'lists'].includes(navigation.list) &&
        (type.split('.')[0] === 'task' || ['list.delete', 'list.rename'].includes(type))) {
        navigation.send('error.set', 'This action cannot be performed.');
        return state;
    }
    if (!state.lists[navigation.list] && !['help', 'lists'].includes(navigation.list)) {
        return state;
    }
    switch (type) {
        case 'task.toggle':
            if (state.lists[navigation.list].items[state.item]) {
                state.lists[navigation.list].items[state.item].isChecked 
                    = !state.lists[navigation.list].items[state.item].isChecked;
            }
            break;
        case 'highlighted.next':
            const listLength = state.lists[navigation.list].items.length;
            if (state.item + 1 < listLength) {
                state.item += 1;
            }
            break;
        case 'highlighted.previous':
            if (state.item - 1 > -1) {
                state.item -= 1;
            }
            break;
        case 'task.add':
            state.lists[navigation.list].items.push({
                isChecked: false,
                title: payload,
            })
            break;
        case 'task.remove':
            state.lists[navigation.list].items.splice(state.item, 1);
            const length = state.lists[navigation.list].items.length;
            if (state.item >= length) {
                state.item = length - 1;
            }
            break;
        case 'task.edit':
            if (state.lists[navigation.list].items[state.item]) {
                state.lists[navigation.list].items[state.item].title = payload;
            }
            break;
        case 'list.open':
            if (!state.lists[payload] && payload !== 'help' && payload !== 'lists') {
                state.lists[payload] = {items: []};
            }
            navigation.send('list.open', payload);
            break;
        case 'list.rename':
            state.lists[payload] = state.lists[navigation.list];
            delete state.lists[navigation.list];
            navigation.send('list.open', payload);
            break;
        case 'list.delete':
            delete state.lists[navigation.list];
            navigation.send('list.close');
            break;
        case 'list.previous':
        case 'list.next':
            state.item = 0;
            navigation.send(type);
            break;
        default:
            break;
    }
    save(state.lists);
    return {...state};
}

// This hook contains everything related to tasks.
const useTasks = ({navigation}) => {
    const [state, dispatch] = useReducer(reducer, initialTasksState);
    const send = (type, payload) => dispatch({type, payload, navigation});

    useEffect(() => {
        navigation.send('opened.set', Object.keys(state.lists).slice(0, 3));
    }, []);
    
    return {
        ...state,
        send,
    };
};

export default useTasks;
