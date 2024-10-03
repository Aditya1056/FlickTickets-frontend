import React from "react";

import { motion } from "framer-motion";

import { IoClose } from "react-icons/io5";

import styles from "./SideDrawer.module.css";

import NavLinks from "../NavLinks/NavLinks";
import Backdrop from "../../../UI/Backdrop/Backdrop";

const SideDrawer = (props) => {

    return (
        <>
            <Backdrop onClick={props.onClose} />
            <motion.div 
                className={styles['side-drawer']} 
                initial={{x:"-100%"}} 
                animate={{x:"0%"}} 
                exit={{x:"-100%"}} 
                transition={{duration: 0.4, type:"keyframes"}}
                onClick={props.onClose} 
            >
                <div className={styles['drawer-closer']} >
                    <button 
                        type="button" 
                        className={styles['close-btn']} 
                    >
                        <IoClose />
                    </button>
                </div>
                <NavLinks 
                    leftNav 
                    rightNav 
                    sideDrawer 
                />
            </motion.div>
        </>
    );
}

export default SideDrawer;