import COMMANDS from '../commands.json';

const Help = () => {
    return (
        <>
            <div className="line">Something todo's help:</div>
            <div className="list-container">
                <div className="line help-command">General</div>
                <div className="help-message">  `Something Todo` is a task manager inspired by vim. Everything can and is done using your keyboard. Never lift your fingers from your keyboard ever again. You can create as many lists as you want (using the `/openList` command), but only 3 can be opened at the same time. See the commands below for more informations on the possible actions.</div>
                <div className="help-message"> </div>

                <div className="line help-command">Navigation</div>
                <div className="help-message">  Use the home row (H, J, K, L) or the arrow keys to navigate the UI. The mouse is not supported in the application. Use [tab] for autocompletion while typing a command.</div>
                <div className="help-message"> </div>

                <div className="line help-command">Checking a task</div>
                <div className="help-message">  To check or uncheck a task, highlight the task and press [space].</div>
                <div className="help-message"> </div>
                

                {Object.keys(COMMANDS).map((command, index) => {
                    const data = COMMANDS[command];
                    return (
                        <div key={index}>
                            <div className="line help-command">
                                /{command} {data.arguments.map(a => `<${a.help}>`).join(' ')}
                            </div>
                            <div className="help-message">  {data.message}</div>
                            <div className="help-message"> </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
};

export default Help;
