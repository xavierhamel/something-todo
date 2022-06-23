import {useEffect, useState} from "react";

const useTheme = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') ?? 'gruvbox-dark-hard');
    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.querySelector("#root").className = theme;
    }, [theme]);
    return {
        theme,
        set: setTheme,
    };
};

export default useTheme;
