import React from "react";

import { AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";

import Notification from "../../components/shared/Notification/Notification";
import MainNavigation from "../../components/shared/Navigation/MainNavigation/MainNavigation";

import { useToastContext } from "../../store/toastContext";
import { useAuthContext } from "../../store/authContext";

const Root = (props) => {

    const auth = useAuthContext();
    const toast = useToastContext();

    return (
        <>
            <AnimatePresence key="main-navigation" >
                {
                    auth.loggedIn && 
                    <MainNavigation />
                }
            </AnimatePresence>
            <AnimatePresence key="toast-notification" >
                {
                    (toast.status && toast.message) && 
                    <Notification 
                        status={toast.status} 
                        message={toast.message} 
                    />
                }
            </AnimatePresence>
            <Outlet />
        </>
    );
}

export default Root;

