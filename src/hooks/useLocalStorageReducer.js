import { useReducer, useEffect } from "react";

const useLocalStorageReducer = (key, reducer, defaultValue) => {
    // Initialize state from localStorage or use default
    const getInitialState = () => {
        try {
            const value = localStorage.getItem(key);
            if (value) {
                return JSON.parse(value);
            } else {
                localStorage.setItem(key, JSON.stringify(defaultValue));
                return defaultValue;
            }
        } catch (error) {
            console.error(`Error loading ${key} from localStorage:`, error);
            localStorage.setItem(key, JSON.stringify(defaultValue));
            return defaultValue;
        }
    };

    const [state, dispatch] = useReducer(reducer, getInitialState());

    // Sync to localStorage whenever state changes
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
        }
    }, [key, state]);

    return [state, dispatch];
};

export default useLocalStorageReducer;
