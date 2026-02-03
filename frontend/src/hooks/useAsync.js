import { useState, useCallback } from 'react';
export const useAsync = (asyncFunction, immediate = true) => {
    const [state, setState] = useState({
        data: null,
        loading: immediate,
        error: null,
    });
    const execute = useCallback(async () => {
        setState({ data: null, loading: true, error: null });
        try {
            const response = await asyncFunction();
            setState({ data: response, loading: false, error: null });
            return response;
        }
        catch (error) {
            setState({ data: null, loading: false, error: error });
            throw error;
        }
    }, [asyncFunction]);
    return { ...state, execute };
};
export const useAsyncCallback = (asyncFunction) => {
    const [state, setState] = useState({
        data: null,
        loading: false,
        error: null,
    });
    const execute = useCallback(async (...args) => {
        setState({ data: null, loading: true, error: null });
        try {
            const response = await asyncFunction(...args);
            setState({ data: response, loading: false, error: null });
            return response;
        }
        catch (error) {
            setState({ data: null, loading: false, error: error });
            throw error;
        }
    }, [asyncFunction]);
    return { ...state, execute };
};
