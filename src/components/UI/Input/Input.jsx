import React, { useState } from "react";
import { motion } from "framer-motion";

import { VscEye } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";
import { MdErrorOutline } from "react-icons/md";

import styles from "./Input.module.css";


const Input = (props) => {

    const [passwordType, setPasswordType] = useState("password");

    const showPassword = () => {
        setPasswordType("text");
    }

    const hidePassword = () => {
        setPasswordType("password");
    }

    let inputClasses = styles['form-item__input'];

    if(props.isInvalid){
        inputClasses += ' ' + styles['error'];
    }

    return (
        <motion.div 
            key={props.id} 
            className={styles['form-item']} 
            initial={props.animate ? {opacity: 0, x:"70%"} : undefined} 
            animate={props.animate ? {opacity: 1, x: "0%"} : undefined} 
            transition={props.animate ? {duration:0.6, type:"spring", delay: props.delay} : undefined} 
        >
            <div className={inputClasses}>
                <label htmlFor={props.id}>{props.label} <sup>*</sup></label>
                <div className={styles['form-input']} >
                    {
                        props.type !== 'textarea' && 
                        <input 
                            type={props.id === "password" ? passwordType : props.type}  
                            value={props.value} 
                            id={props.id} 
                            onChange={props.onChange} 
                            onBlur={props.onBlur} 
                            min={props.min ? props.min : undefined} 
                            max={props.max ? props.max : undefined} 
                            step={props.step ? props.step : undefined} 
                            placeholder={props.placeholder ? props.placeholder : ''} 
                            disabled={props.disabled} 
                        />
                    }
                    {
                        props.type === 'textarea' && 
                        <textarea 
                            value={props.value} 
                            id={props.id} 
                            onChange = {props.onChange} 
                            onBlur = {props.onBlur} 
                            placeholder = {props.placeholder ? props.placeholder : ''} 
                            disabled={props.disabled} 
                        />
                    }
                    {
                        (props.id === "password" &&  passwordType === "password" && props.value.length > 0) && 
                        <VscEye 
                            className={styles['toggle-icon']} 
                            title="Show password" 
                            onClick={showPassword} 
                            />
                        }
                    {
                        (props.id === "password" &&  passwordType === "text" && props.value.length > 0) && 
                        <VscEyeClosed 
                            className={styles['toggle-icon']} 
                            title="Hide password" 
                            onClick={hidePassword} 
                        />
                    }
                </div>
            </div>
            {
                props.isInvalid && 
                (
                    <div className={styles['form-item__error']}>
                        <p><MdErrorOutline className={styles['error-icon']} /> {props.errorContent}</p>
                    </div>
                )
            }
        </motion.div>
    );
}

export default Input;