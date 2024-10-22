import React, {
    useContext,
    createContext,
    useState,
    useCallback,
    useMemo,
    useEffect,
} from "react";

export const ThemeContext = createContext({});

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const initialTheme = localStorage.getItem("theme");
        return initialTheme || "light";
    });

    const toggleTheme = useCallback(() => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === "light" ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            return newTheme;
        });
    }, []);

    const contextValue = useMemo(
        () => ({ theme, toggleTheme }),
        [theme, toggleTheme]
    );

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme && savedTheme !== theme) {
            setTheme(savedTheme);
        }
    }, []);

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const value = useContext(ThemeContext);
    if (!value) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return value;
};

export default ThemeProvider;
