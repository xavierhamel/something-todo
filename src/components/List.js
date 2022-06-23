import React, { useLayoutEffect } from 'react';
import Item from './Item';
import Help from './Help';
import Lists from './Lists';

const List = ({navigation, tasks}) => {
    const activeItemRef = React.createRef();
    const items = tasks.lists[navigation.list]?.items;
    // The useLayoutEffect is used to scroll to the element when it's outside
    // of the view. After each render, this method is called and the dom is
    // updated to scroll to the element if it's outside the view.
    useLayoutEffect(() => {
        if (activeItemRef.current) {
            activeItemRef.current.scrollIntoView({
                behavior: 'instant',
                block: 'nearest',
                inline: 'nearest',
            });
        }
    }, [activeItemRef]);
    if (navigation.list === 'help') {
        return <Help />
    }
    if (navigation.list === 'lists') {
        return <Lists tasks={tasks} />;
    }
    return (
        <>
            <div className="line">Tasks in {navigation.list}:</div>
            <div className="list-container">
                {items.map(({isChecked, title}, index) => {
                    const isActive = tasks.item === index;
                    return (
                        <Item
                            ref={isActive ? activeItemRef : null}
                            isChecked={isChecked}
                            title={title}
                            key={index}
                            isActive={tasks.item === index}
                        />
                    )
                })}
            </div>
        </>
    )
}

export default List;
