import useKeyboard from './hooks/useKeyboard';
import useNavigation from './hooks/useNavigation';
import useTasks from './hooks/useTasks';
import useTheme from './hooks/useTheme';

import Nav from './components/Nav';
import List from './components/List';
import StatusLine from './components/StatusLine';
import CommandLine from './components/CommandLine';

const App = () => {
    const theme = useTheme();

    // navigation.list
    // navigation.mode
    // navigation.opened
    // navigation.send()
    const navigation = useNavigation();

    // tasks.lists
    // tasks.lists[navigation.list]
    // tasks.item
    // tasks.send()
    const tasks = useTasks({navigation});

    // Handle the keyboard events.
    useKeyboard({navigation, tasks});

    //  If we are in help or lists, there is no loading.
    if (!['help', 'lists'].includes(navigation.list)) {
        if (tasks.lists === undefined || navigation.list === null || !tasks.lists[navigation.list]) {
            return <div className="line">Loading...</div>;
        }
    }
    return (
        <div className="wrapper">
            <Nav navigation={navigation} />
            <List navigation={navigation} tasks={tasks} />
            <StatusLine navigation={navigation} tasks={tasks} />
            <CommandLine navigation={navigation} tasks={tasks} theme={theme} />
        </div>
    );
}

export default App;
