import React from 'react';
import { motion } from "framer-motion";

import styles from './Button.module.css';

const Button = (props) => {

    let classes = `${styles['btn']} ${props.className}`;

    return (
        <motion.button 
            key={props.id} 
            type={props.type ? props.type : "button"} 
            disabled={props.disabled ? props.disabled : false}  
            className={classes} 
            onClick = {props.onClick ? props.onClick : undefined} 
            initial={props.animate ? {opacity: 0, x:"70%"} : undefined} 
            animate={props.animate ? {opacity : props.disabled ? 0.7 : 1, x:"0%"} : undefined} 
            transition={{duration:0.6, type:"spring", delay: props.delay}} 
        >
            {props.children}
        </motion.button>
    );
}

export default Button;