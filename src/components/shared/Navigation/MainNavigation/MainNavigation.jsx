import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { RiMovie2Fill } from "react-icons/ri";
import { LuMenu } from "react-icons/lu";

import styles from "./MainNavigation.module.css";

import NavLinks from "../NavLinks/NavLinks";
import SideDrawer from "../SideDrawer/SideDrawer";

import { useAuthContext } from "../../../../store/authContext";

const MainNavigation = (props) => {

    const auth = useAuthContext();

    const [showSideDrawer, setShowSideDrawer] = useState(false);

    const toggleSideDrawer = () => {
        setShowSideDrawer((prev) => !prev);
    }

    let headerTextClasses = styles['header-text'];

    if(auth.userRole === 'admin'){
        headerTextClasses += ' ' + styles['admin'];
    }

    return (
        <>
            <AnimatePresence key="side-drawer-toggle" >
                {
                    showSideDrawer && <SideDrawer onClose={toggleSideDrawer} />
                }
            </AnimatePresence>
            <motion.div 
                className={styles['main-nav']} 
                initial={{y:"-100%"}} 
                animate={{y:"0%"}} 
                exit={{y:"-100%"}} 
                transition={{duration: 0.2, type:"keyframes"}} 
            >
                <div className={styles['main-nav-header']} >
                    <button 
                        type="button" 
                        className={styles['menu-btn']} 
                        onClick={toggleSideDrawer} 
                    >
                        <LuMenu />
                    </button>
                    <div className={headerTextClasses} >
                        <RiMovie2Fill className={styles['reel-logo']} /> <p>Flick Tickets</p>
                    </div>
                    <div className={styles['nav-links-left']} >
                        <NavLinks leftNav mainNav />
                    </div>
                </div>
                <div className={styles['nav-links-right']} >
                    <NavLinks rightNav mainNav />
                </div>
            </motion.div>
        </>
    );
}

export default MainNavigation;