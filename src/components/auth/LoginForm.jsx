import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import styles from "./LoginForm.module.css";

import Input from '../UI/Input/Input';
import Button from "../UI/Button/Button";
import Loading from "../UI/Loading/Loading";

import useInput from '../../hooks/useInput';

import { useToastContext } from "../../store/toastContext";
import { useAuthContext } from "../../store/authContext";

import { httpUsersRequest } from '../../util/http/usersHttp';
import { inputValidator } from '../../util/helpers/validators';

const LoginForm = (props) => {

    const auth = useAuthContext();
    const toast = useToastContext();

    const navigate = useNavigate();

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

    let formIsValid = emailIsValid && passwordIsValid;

    const { mutate, isPending } = useMutation({
        mutationFn: httpUsersRequest,
        onError:(err) => {
            toast.openToast("FAIL", err.message);
        },
        onSuccess:({message, data}) => {

            let today = new Date();

            let birthDay = new Date(data.userDob);
            
            let age = today.getFullYear() - birthDay.getFullYear();

            let m_diff = today.getMonth() - birthDay.getMonth();

            if((m_diff < 0) || (m_diff == 0 && today.getDate() < birthDay.getDate())){
                age--;
            }

            auth.login(data.token, data.expires, data.userId, data.userName, data.userEmail, data.userRole, data.userImage, data.pendingTheatreRequests, age);

            emailResetHandler();
            passwordResetHandler();
            toast.openToast("SUCCESS", message);
            navigate('/movies');
        }
    });

    const loginHandler = (event) => {
        event.preventDefault();
        let userDetails = {
            email: emailValue.trim().toLowerCase(),
            password: passwordValue.trim()
        }
        mutate({
            url:'/login',
            method:"POST",
            data: userDetails,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    const forgotPasswordPageHandler = () => {
        navigate('/forgot-password');
    }

    return (
        <>
            {
                isPending && <Loading />
            }
            <div className={styles['login-form']}>
                <form onSubmit={loginHandler} >
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
                        animate 
                        delay={0}
                    />
                    <Input 
                        label = "Password" 
                        id = "password" 
                        type = "password" 
                        value = {passwordValue} 
                        onChange = {passwordChangeHandler} 
                        onBlur = {passwordBlurHandler} 
                        isInvalid={passwordIsInvalid} 
                        placeholder = "Enter your password" 
                        errorContent={"Password must be atleast 6 characters"}  
                        animate 
                        delay={0.1}
                    />
                    <Button 
                        id="login-btn" 
                        type="submit" 
                        disabled={!formIsValid} 
                        className={styles['login-btn']} 
                        delay={0.2} 
                        animate 
                    >
                        Login
                    </Button>
                </form>
                <motion.div 
                    key={"switch-to-signup"} 
                    className={styles['sign-up-text']} 
                    initial={{opacity:0, y:"100%"}} 
                    animate={{opacity:1, y:"0%"}} 
                    transition={{duration:0.6, type:"tween"}} 
                >
                    Don't have an account? 
                    <span 
                        className={styles['sign-up-link']} 
                        onClick={props.switchToSignup} 
                    >
                        Sign up!
                    </span>
                </motion.div>
                <motion.div 
                    key={"forgot-password"} 
                    className={styles['forgot-password-text']} 
                    initial={{opacity:0, y:"100%"}} 
                    animate={{opacity:1, y:"0%"}} 
                    transition={{duration:0.6, type:"tween"}} 
                >
                    Forgot Password?
                    <span 
                        className={styles['forgot-password-link']} 
                        onClick={forgotPasswordPageHandler} 
                    >
                        Click Here!
                    </span>
                </motion.div>
            </div>
        </>
    );
}

export default LoginForm;