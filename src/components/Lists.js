const Lists = ({tasks}) => {
    const keys = Object.keys(tasks.lists).filter((l) => l !== 'help' && l !== 'lists');
    return (
        <>
            <div className="line">Lists created:</div>
            <div className="list-container">
                {keys.map((listName, index) => {
                    const items = tasks.lists[listName].items;
                    const totalTasks = items.length;
                    const completedTasks = items.filter((task) => task.isChecked).length;
                    return (
                        <div key={index}>
                            <div className="line help-command">{listName}</div>
                            <div className="help-message">  {completedTasks}/{totalTasks} completed</div>
                            <div className="help-message"> </div>
                        </div>
                    );
                })}
            </div>
        </>
    )
}

export default Lists;
