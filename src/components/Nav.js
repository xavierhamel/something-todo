
const Nav = ({navigation}) => {
    const lists = navigation.opened.map((list, index) => {
        const isActive = list === navigation.list;
        return (
            <div className={`nav-button ${isActive ? 'nav-button__active' : ''}`} key={index}>
                {list}
            </div>
        )
    });
    return (
        <div className="nav-container line">
            {lists}
        </div>
    );
};

export default Nav;
