import {useReducer} from "react";

// This is the default state on the first launch of the app.
const defaultState = JSON.stringify({
    list: 'work',
    mode: 'normal',
    opened: ['work', 'home'],
    error: null,
});

const initialNavigationState = JSON.parse(
    localStorage.getItem('navigation') ?? defaultState
);

// Save the data to the disk at every update.
const save = (state) => {
    localStorage.setItem('navigation', JSON.stringify({
        ...state,
        mode: 'normal',
        error: null,
    }));
};

const reducer = (state, {type, payload}) => {
    const listIndex = state.opened.indexOf(state.list);
    switch (type) {
        case 'error.set':
            state.error = payload;
            break;
        case 'error.clear':
            state.error = null;
            break;
        case 'mode.set':
            state.mode = payload;
            if (payload === 'command') {
                state.error = null;
            }
            break;
        case 'list.previous':
            if (listIndex - 1 > -1) {
                state.list = state.opened[listIndex - 1];
            }
            break;
        case 'list.next':
            if (listIndex + 1 < state.opened.length) {
                state.list = state.opened[listIndex + 1];
            }
            break;
        case 'list.open':
            if (state.list === payload) {
                state.error = 'The list is already opened.';
                break;
            }
            if (state.opened.indexOf(payload) === -1) {
                if (state.opened.length < 3) {
                    state.opened.push(payload);
                } else {
                    state.opened[state.opened.indexOf(state.list)] = payload;
                }
            }
            state.list = payload;
            break;
        case 'list.close':
            if (state.opened.length === 1) {
                state.error = 'One list should opened.';
            } else {
                state.opened.splice(state.opened.indexOf(state.list), 1);
                state.list = state.opened[0];
            }
            break;
        case 'opened.set':
            if (payload.length === 0 || state.opened.length > 0) {
                break;
            }
            state.opened = payload;
            state.list = payload[0];
            break;
        default:
            break;
    }
    save(state);
    return {...state};
}

// This hook contains everything that is related to the navigation. The
// dispatcher (`send`) handle the events of the navigation.
const useNavigation = () => {
    const [state, dispatch] = useReducer(reducer, initialNavigationState);
    const send = (type, payload) => dispatch({type, payload});
    return {
        ...state,
        send,
    }
};

export default useNavigation;
