import { createContext, useContext, ReactNode } from "react";

// Define the shape of the context value
interface ThemeContextType {
    theme: string;
    toggleTheme: () => void;
}

// Create the context with an initial value of `undefined`
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use the ThemeContext
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

export default ThemeContext;
