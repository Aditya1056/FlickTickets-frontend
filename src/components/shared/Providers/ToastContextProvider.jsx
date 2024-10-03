import ToastContext from "../../../store/toastContext";

import useToast from "../../../hooks/useToast";

const ToastContextProvider = (props) => {

    const { status, message, openToast, closeToast } = useToast();

    return (
        <ToastContext.Provider 
            value={{
                status, 
                message,
                openToast,
                closeToast 
            }}
        >
            {props.children}
        </ToastContext.Provider>
    );
}

export default ToastContextProvider;