import React, { useState } from "react";

import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";

import styles from './SignupForm.module.css';

import Input from '../UI/Input/Input';
import Button from "../UI/Button/Button";
import Loading from "../UI/Loading/Loading";

import useInput from '../../hooks/useInput';

import { useToastContext } from "../../store/toastContext";

import { httpUsersRequest } from '../../util/http/usersHttp';
import { inputValidator, notNullValidator } from '../../util/helpers/validators';

const SignupForm = (props) => {

    const toast = useToastContext();

    const [userRole, setUserRole] = useState("user");

    const userRoleChangeHandler = (event) => {
        setUserRole(event.target.value);
    }

    const {
        value: nameValue,
        isValid: nameIsValid,
        isInvalid: nameIsInvalid,
        inputChangeHandler: nameChangeHandler,
        inputBlurHandler: nameBlurHandler,
        inputResetHandler: nameResetHandler
    } = useInput(inputValidator, 1);

    const {
        value: emailValue,
        isValid: emailIsValid,
        isInvalid: emailIsInvalid,
        inputChangeHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
        inputResetHandler: emailResetHandler
    } = useInput(inputValidator, 5);

    const {
        value: dateValue,
        isValid: dateIsValid,
        isInvalid: dateIsInvalid,
        inputChangeHandler: dateChangeHandler,
        inputBlurHandler: dateBlurHandler,
        inputResetHandler: dateResetHandler
    } = useInput(notNullValidator, 1);

    const {
        value: passwordValue,
        isValid: passwordIsValid,
        isInvalid: passwordIsInvalid,
        inputChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
        inputResetHandler: passwordResetHandler
    } = useInput(inputValidator, 6);

    let userRoleValid = userRole === "user" || userRole === "partner";

    let formIsValid = emailIsValid && passwordIsValid && nameIsValid && dateIsValid && userRoleValid;

    const {mutate, isPending} = useMutation({
        mutationFn:httpUsersRequest,
        onError:(err) => {
            toast.openToast("FAIL", err.message);
        },
        onSuccess:({message, data}) => {
            nameResetHandler();
            emailResetHandler();
            passwordResetHandler();
            dateResetHandler();
            toast.openToast("SUCCESS", message);
            props.switchToLogin();
        }
    });

    const signupHandler = (event) => {
        event.preventDefault();
        let userDetails = {
            name: nameValue.trim(),
            email: emailValue.trim().toLowerCase(),
            dateOfBirth:dateValue,
            password: passwordValue.trim(),
            role:userRole
        };
        mutate({
            url: '/signup',
            method:"POST",
            data:userDetails,
            headers:{
                'Content-Type':"application/json"
            }
        });
    }

    return (
        <>
            {
                isPending && <Loading />
            }
            <div className={styles['signup-form']}>
                <form onSubmit={signupHandler} >
                    <Input 
                        label = "Name" 
                        id = "name" 
                        type = "text" 
                        value = {nameValue} 
                        onChange = {nameChangeHandler} 
                        onBlur = {nameBlurHandler} 
                        isInvalid= {nameIsInvalid} 
                        placeholder = "Enter your Name" 
                        errorContent= {"Name cannot be empty"} 
                        animate 
                        delay={0} 
                    />
                    <Input 
                        label = "Email" 
                        id = "email" 
                        type = "email" 
                        value = {emailValue} 
                        onChange = {emailChangeHandler} 
                        onBlur = {emailBlurHandler} 
                        isInvalid= {emailIsInvalid} 
                        placeholder = "Enter your email" 
                        errorContent= {"Email is not valid"} 
                        animate 
                        delay={0.1}  
                    />
                    <Input 
                        label = "Date of birth" 
                        id = "dob" 
                        type = "date" 
                        value = {dateValue} 
                        onChange = {dateChangeHandler} 
                        onBlur = {dateBlurHandler} 
                        isInvalid= {dateIsInvalid} 
                        placeholder = "Enter your DOB" 
                        errorContent= {"Date is not valid"} 
                        animate 
                        delay={0.2} 
                    />
                    <Input 
                        label = "Password" 
                        id = "password" 
                        type = "password" 
                        value = {passwordValue} 
                        onChange = {passwordChangeHandler} 
                        onBlur = {passwordBlurHandler} 
                        isInvalid= {passwordIsInvalid} 
                        placeholder = "Enter your password" 
                        errorContent= {"Password must be atleast 6 characters"}  
                        animate 
                        delay={0.3} 
                    />
                    <motion.div 
                        className={styles['role-container']} 
                        key={"user-role"} 
                        initial={{opacity: 0, x:"70%"}} 
                        animate={{opacity: 1, x: "0%"}} 
                        transition={{duration:0.6, type:"spring", delay: 0.4}} 
                    >
                        <div className={styles['role-header']} >
                            Sign up as<sup>*</sup>
                        </div>
                        <div className={styles['role-items']} >
                            <div className={styles['role-item']} >
                                <input 
                                    type="radio" 
                                    value="user" 
                                    id="user" 
                                    onChange={userRoleChangeHandler} 
                                    checked={userRole === "user"} 
                                    />
                                <label htmlFor="user">User</label>
                            </div>
                            <div className={styles['role-item']} >
                                <input 
                                    type="radio" 
                                    value="partner" 
                                    id="partner" 
                                    onChange={userRoleChangeHandler} 
                                    checked={userRole === "partner"} 
                                />
                                <label htmlFor="partner">Partner</label>
                            </div>
                        </div>
                    </motion.div>
                    <Button 
                        id="signup-btn" 
                        type="submit" 
                        disabled={!formIsValid} 
                        className={styles['signup-btn']} 
                        delay={0.5}  
                        animate 
                    >
                        Sign up
                    </Button>
                </form>
                <motion.div 
                    className={styles['login-text']} 
                    key={"switch-to-login"} 
                    initial={{opacity:0, y:"100%"}} 
                    animate={{opacity:1, y:"0%"}} 
                    transition={{duration:0.6, type:"tween"}} 
                >
                    Already have an account? 
                    <span 
                        className={styles['login-link']} 
                        onClick={props.switchToLogin} 
                    >
                        Login!
                    </span>
                </motion.div>
            </div>
        </>
    );
}

export default SignupForm;