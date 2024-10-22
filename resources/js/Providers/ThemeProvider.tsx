import React, {
    useState,
    useCallback,
    useMemo,
    useEffect,
    ReactNode,
} from "react";
import ThemeContext from "@/Contexts/ThemeContext";

interface ThemeProviderProps {
    children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<string>(() => {
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
    }, [theme]);

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
