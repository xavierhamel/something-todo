import {useEffect} from "react";

const MODE = {
    NORMAL: 'normal',
    INSERT: 'insert',
    COMMAND: 'command',
};

// The `useKeyboard` hook handle the keyboard events and dispatch the event to
// the `navigation` and `tasks`. It's only a dispatcher to have only one
// keyboard listener for the app and not one in each hook/component.
const useKeyboard = ({navigation, tasks}) => {
    useEffect(() => {
        const listenerHandler = (event) => {
            // Event that can happen even when the mode is in COMMAND.
            switch (event.code) {
                case 'Escape':
                case 'Enter':
                    navigation.send('mode.set', MODE.NORMAL);
                    break;
                default:
                    break;
            }
            if (navigation.mode === MODE.COMMAND) {
                return;
            }
            // Event that can only happen when the mode is not NORMAL
            switch (event.code) {
                case 'ArrowLeft':
                case 'KeyH':
                    tasks.send('list.previous');
                    break;
                case 'ArrowRight':
                case 'KeyL':
                    tasks.send('list.next');
                    break;
                case 'ArrowUp':
                case 'KeyK':
                    event.preventDefault();
                    tasks.send('highlighted.previous');
                    break;
                case 'ArrowDown':
                case 'KeyJ':
                    event.preventDefault();
                    tasks.send('highlighted.next');
                    break;
                case 'Space':
                    event.preventDefault();
                    tasks.send('task.toggle');
                    break;
                case 'Slash':
                    navigation.send('mode.set', MODE.COMMAND);
                    break;
                default:
                    break;
            };
        }
        window.addEventListener('keydown', listenerHandler);
        return () => window.removeEventListener('keydown', listenerHandler);
    }, [navigation, tasks]);

}

export default useKeyboard;
