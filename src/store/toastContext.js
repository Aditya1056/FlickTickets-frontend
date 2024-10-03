import React, { useContext } from "react";

const ToastContext = React.createContext({
    status:null,
    message:null,
    openToast:() => {},
    closeToast:() => {}
});

export const useToastContext = () => {
    return useContext(ToastContext);
}

export default ToastContext;