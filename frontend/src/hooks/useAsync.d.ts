export declare const useAsync: <T>(asyncFunction: () => Promise<T>, immediate?: boolean) => {
    execute: () => Promise<T>;
    data: T;
    loading: boolean;
    error: Error | null;
};
export declare const useAsyncCallback: <T, Args extends any[]>(asyncFunction: (...args: Args) => Promise<T>) => {
    execute: (...args: Args) => Promise<T>;
    data: T;
    loading: boolean;
    error: Error | null;
};
