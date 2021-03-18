import {useEffect, useRef} from "react";


// Interval hook
export const useInterval = (callback: () => void, msecs: number) => {
    const savedCallback = useRef<() => void>();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        const tick = () => {
            savedCallback.current && savedCallback.current();
        }

        const id = setInterval(tick, msecs);
        return () => clearInterval(id);

    }, [msecs]);
}
