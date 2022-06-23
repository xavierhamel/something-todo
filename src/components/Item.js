import React from 'react';

const Item = ({isChecked, title, isActive}, ref) => {
    let containerStyle = `item-container line ${isChecked ? 'item-container__active' : ''}`;
    if (isActive) {
        containerStyle += ' line__active';
    }
    return (
        <div className={containerStyle} ref={ref}>
            <div className="item-checkbox">
                {isChecked ? ' [x] ' : ' [ ] '}
            </div>
            <div className="item-title">{title}</div>
        </div>
    )
};

export default React.forwardRef(Item);
