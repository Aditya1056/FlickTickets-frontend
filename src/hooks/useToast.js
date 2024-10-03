import { useCallback, useEffect, useState } from "react";

const useToast = () => {

    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState(null);

    const openToast = useCallback((status, message) => {
        setStatus(status);
        setMessage(message);
    }, []);

    const closeToast = useCallback(() => {
        setStatus(null);
        setMessage(null);
    }, []);

    useEffect(() => {
        let closeToastTimer = null;

        if(status){
            setTimeout(closeToast, 4000);
        }
        else{
            clearTimeout(closeToastTimer);
        }
        
        return () => {
            clearTimeout(closeToastTimer);
        }
    }, [status, closeToast]);

    return {
        status,
        message,
        openToast,
        closeToast
    };
}

export default useToast;