import {useState, useRef, useEffect} from "react";
import COMMANDS from '../commands.json';
import THEMES from '../themes.json';

//const THEMES = [
//    'gruvbox',
//    'nord',
//    'icy',
//    'apathy',
//    'brushtrees',
//    'grayscale',
//    'hopscotch',
//    'macintosh',
//];
const COMMANDS_ERROR = {
    NOT_EXISTS: 'Error: The command does not exists.',
    NO_ARGUMENTS_NEEDED: 'Error: No arguments are needed.',
};

// Parse the command. If an error was found, the error is returned.
const parseCommand = (command) => {
    let [commandName, ...args] = command.trim().split(' ');
    commandName = commandName.replace('/', '');
    if (!Object.keys(COMMANDS).includes(commandName)) {
        return {error: COMMANDS_ERROR.NOT_EXISTS};
    }
    const commandFormat = COMMANDS[commandName];
    if (commandFormat.arguments.length === 0 && args.length > 0) {
        return {error: COMMANDS_ERROR.NO_ARGUMENTS_NEEDED};
    }
    return {
        cmd: commandName,
        argument: args.join(' '),
    };
}

const CommandLine = ({tasks, navigation, theme}) => {
    const [command, setCommand] = useState('');
    const [commandBeforeTab, setCommandBeforeTab] = useState('');
    const [tabLastGuess, setTabLastGuess] = useState(null);
    const [isAutoFillUsed, setIsAutoFillUsed] = useState(false);
    const inputRef = useRef(null);
    
    // This useEffect handle the focus on the input. If the mode is changed to
    // `command`, the input is focused, in every other cases (now it's only
    // `normal`), the input is blured (onfocused).
    // If there is an error, keep the error message, if not the input is
    // cleared when the input is onfocused.
    useEffect(() => {
        if (inputRef.current) {
            if (navigation.mode === 'command') {
                inputRef.current.focus();
                setCommand('');
            } else {
                inputRef.current.blur();
                if (!inputRef.current.value.startsWith('Error: ')) {
                    setCommand('');
                }
            }
        }
    }, [navigation, inputRef]);

    // This useEffect only control the color of the input, if the inputs starts
    // with `Error: `, the color of the text in the input is changed to red.
    // This useEffect also update `commandBeforeTab`. We need to keep track
    // of the content before the tab was pressed. Every update if tab was not
    // pressed, we save the content of the input.
    useEffect(() => {
        if (command.startsWith('Error: ')) {
            inputRef.current.classList.add('line-input__error');
        } else {
            inputRef.current.classList.remove('line-input__error');
        }
        if (!isAutoFillUsed) {
            setCommandBeforeTab(command);
        }
    }, [command, tabLastGuess])
    
    // If an error is returned when a command was executed, the error message
    // is put in `navigation.error`. Therefor, we listen to change on
    // `navigation`. If an error is present, insert the error message.
    useEffect(() => {
        if (navigation.error) {
            setCommand(`Error: ${navigation.error}`);
        }
    }, [navigation]);

    // Execute the command. A command is sent to `navigation` or `tasks`. A
    // lots of command sent to `tasks` are also sent to `navigation` from
    // `tasks`.
    const executeCommand = () => {
        setTabLastGuess()
        let parsedCommand = parseCommand(command);
        if (parsedCommand.error) {
            setCommand(parsedCommand.error);
            return;
        }
        const {cmd, argument} = parsedCommand;
        const dispatch = {
            add: () => tasks.send('task.add', argument),
            remove: () => tasks.send('task.remove'),
            edit: () => tasks.send('task.edit', argument),
            openList: () => tasks.send('list.open', argument),
            closeList: () => navigation.send('list.close'),
            renameList: () => tasks.send('list.rename', argument),
            deleteList: () => tasks.send('list.delete'),
            theme: () => {
                if (THEMES.includes(argument)) {
                    theme.set(argument);
                } else {
                    setCommand('Error: The theme does not exists.');
                }
            },
            help: () => tasks.send('list.open', 'help'),
            lists: () => tasks.send('list.open', 'lists'),
            ls: () => tasks.send('list.open', 'lists'),
        };
        dispatch[cmd]();
        setCommand(value => {
            if (value.startsWith('Error: ')) {
                return value;
            }
            return '';
        });
    }

    // This autocomplete the command prompt when tab is pressed.
    const autoCompleteWithTab = () => {
        setIsAutoFillUsed(true);
        // `strategy` is either `command`, `list`, `theme` or null. Depending on what
        // should be autocompleted.
        let strategy = null;
        const parsedCommand = parseCommand(commandBeforeTab);
        const commandSplited = commandBeforeTab.split(' ');
        if (commandSplited.length === 1) {
            strategy = 'command';
        } else {
            if (parsedCommand.error) {
                return;
            }
            strategy = COMMANDS[parsedCommand.cmd].arguments[0].autocomplete;
        }
        if (strategy === null) {
            return;
        }
        const choices = autoCompleteChoices(strategy);
        setTabLastGuess(last => {
            let next = last;
            if (last >= choices.length - 1 || last === null) {
                next = 0;
            } else {
                next += 1;
            }
            if (choices[next]) {
                if (strategy === 'command') {
                    setCommand(`/${choices[next]}`);
                } else {
                    setCommand(`/${parsedCommand.cmd} ${choices[next]}`);
                }
            }
            return next;
        });
    }

    // Return the choices that are given by the autocomplete.
    const autoCompleteChoices = (strategy) => {
        const parsedCommand = parseCommand(commandBeforeTab);
        let choices = [];
        switch (strategy) {
            case 'command':
                const toComplete = commandBeforeTab.substring(1);
                choices = Object.keys(COMMANDS).filter(c => c.startsWith(toComplete));
                break;
            case 'list':
                if (parsedCommand.error) {
                    break;
                }
                const lists = Object.keys(tasks.lists);
                choices = lists.filter(list => list.startsWith(parsedCommand.argument));
                break;
            case 'theme':
                if (parsedCommand.error) {
                    break;
                }
                choices = THEMES.filter(theme => theme.startsWith(parsedCommand.argument));
                break;
            default:
                break;
        }
        return choices;
    }

    const handleKeyDown = (event) => {
        if (event.code === 'Tab') {
            event.preventDefault();
            autoCompleteWithTab();
        } else {
            setIsAutoFillUsed(false);
            setTabLastGuess(null);
            if (event.code === 'Enter') {
                executeCommand();
            }
        }
    }
    return (
        <div className="command-line-container">
            <input
                ref={inputRef}
                type="text"
                className="line-input"
                placeholder="/"
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => navigation.send('mode.set', 'normal')}
                onFocus={() => {
                    setCommand('');
                    navigation.send('mode.set', 'command');
                }}
            />
        </div>
    )
};

export default CommandLine;
