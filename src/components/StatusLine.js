const StatusLine = ({tasks, navigation}) => {
    const items = tasks.lists[navigation.list]?.items ?? [];
    const totalTasks = items.length;
    const completedTasks = items.filter((task) => task.isChecked).length;
    let ratio = Math.round((completedTasks / totalTasks) * 100);
    if (totalTasks === 0) {
        ratio = 0;
    }

    return (
        <div className={`airline-container line airline-container__${navigation.mode}`}>
            <div className="airline-primary"> {navigation.mode} </div>
            <div className="airline-secondary"> {navigation.list} </div>
            <div className="airline-separator" />
            <div className="airline-thirdary"> {ratio}% completed </div>
            <div className="airline-primary"> {completedTasks}/{totalTasks} </div>
        </div>
    )
};

export default StatusLine;
