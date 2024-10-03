import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { RiMovie2Fill } from "react-icons/ri";

import styles from './ForgotPassword.module.css';

import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import Loading from "../UI/Loading/Loading";

import useInput from "../../hooks/useInput";

import { useToastContext } from "../../store/toastContext";

import { httpUsersRequest } from "../../util/http/usersHttp";

import { inputValidator } from "../../util/helpers/validators";

const ForgotPassword = (props) => {

    const toast = useToastContext();

    const navigate = useNavigate();

    const [otpSent, setOtpSent] = useState(false);

    const toggleOtpSentHandler = () => {
        setOtpSent((prev) => !prev);
    }

    const {
        value: emailValue,
        isValid: emailIsValid,
        isInvalid: emailIsInvalid,
        inputChangeHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
        inputResetHandler: emailResetHandler
    } = useInput(inputValidator, 5);

    const {
        value: passwordValue,
        isValid: passwordIsValid,
        isInvalid: passwordIsInvalid,
        inputChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
        inputResetHandler: passwordResetHandler
    } = useInput(inputValidator, 6);

    const {
        value: otpValue,
        isValid: otpIsValid,
        isInvalid: otpIsInvalid,
        inputChangeHandler: otpChangeHandler,
        inputBlurHandler: otpBlurHandler,
        inputResetHandler: otpResetHandler
    } = useInput(inputValidator, 6);

    const formIsValid = emailIsValid;

    const resetFormIsValid = emailIsValid && passwordIsValid && otpIsValid;

    const {mutate, isPending} = useMutation({
        mutationFn:httpUsersRequest,
        onSuccess:({data, message}) => {
            toggleOtpSentHandler();
            toast.openToast('SUCCESS', message);
        },
        onError:(err) => {
            toast.openToast('FAIL', err.message);
        }
    });

    const {mutate : passwordMutate, isPending: passwordMutatePending} = useMutation({
        mutationFn:httpUsersRequest,
        onSuccess:({data, message}) => {
            toggleOtpSentHandler();
            emailResetHandler();
            passwordResetHandler();
            otpResetHandler();
            toast.openToast('SUCCESS', message);
            navigate('/');
        },
        onError:(err) => {
            toast.openToast('FAIL', err.message);
        }
    });

    const formSubmitHandler = (event) => {
        event.preventDefault();
        const data = {
            email: emailValue?.trim()?.toLowerCase()
        }
        mutate({
            url:'/forgot-password',
            method:'PATCH',
            data,
            headers:{
                'Content-Type': 'application/json'
            }
        });
    }
    
    const passwordFormSubmitHandler = (event) => {
        event.preventDefault();
        const data = {
            email: emailValue?.trim()?.toLowerCase(),
            password: passwordValue?.trim(),
            otp:otpValue
        }
        passwordMutate({
            url:'/change-password',
            method:'PATCH',
            data,
            headers:{
                'Content-Type': 'application/json'
            }
        });
    }

    return (
        <>
            {
                (isPending || passwordMutatePending) && <Loading />
            }
            <div className={styles['forgot-password']} >
                <div className={styles['header']}>
                    <h2><RiMovie2Fill className={styles['movie-icon']} /> Flick Tickets</h2>
                </div>
                <div className={styles['otp-form']} >
                    {
                        !otpSent && 
                        <form key="email-form" onSubmit={formSubmitHandler} >
                            <Input 
                                label = "Email" 
                                id = "email" 
                                type = "email" 
                                value = {emailValue} 
                                onChange = {emailChangeHandler} 
                                onBlur = {emailBlurHandler} 
                                isInvalid={emailIsInvalid} 
                                placeholder = "Enter your email" 
                                errorContent={"Email is not valid"} 
                            />
                            <Button 
                                id="send-btn" 
                                type="submit" 
                                disabled={!formIsValid} 
                                className={styles['send-btn']} 
                            >
                                Send Otp
                            </Button>
                        </form>
                    }
                    {
                        otpSent && 
                        <form key="password-form" onSubmit={passwordFormSubmitHandler} >
                            <Input 
                                label = "Email" 
                                id = "email" 
                                type = "email" 
                                value = {emailValue} 
                                onChange = {emailChangeHandler} 
                                onBlur = {emailBlurHandler} 
                                isInvalid={emailIsInvalid} 
                                placeholder = "Enter your email" 
                                errorContent={"Email is not valid"} 
                                disabled={true}
                            />
                            <Input 
                                label = "Otp" 
                                id = "otp" 
                                type = "number" 
                                value = {otpValue} 
                                onChange = {otpChangeHandler} 
                                onBlur = {otpBlurHandler} 
                                isInvalid={otpIsInvalid} 
                                placeholder = "Enter the Otp" 
                                errorContent={"Otp must contains 6 digits!"} 
                            />
                            <Input 
                                label = "New Password" 
                                id = "password" 
                                type = "password" 
                                value = {passwordValue} 
                                onChange = {passwordChangeHandler} 
                                onBlur = {passwordBlurHandler} 
                                isInvalid={passwordIsInvalid} 
                                placeholder = "Enter your new password" 
                                errorContent={"Password must be atleast 6 characters"}  
                            />
                            <Button 
                                id="submit-btn" 
                                type="submit" 
                                disabled={!resetFormIsValid} 
                                className={styles['send-btn']} 
                            >
                                Submit
                            </Button>
                        </form>
                    }
                </div>
            </div>
        </>
    );

}

export default ForgotPassword;