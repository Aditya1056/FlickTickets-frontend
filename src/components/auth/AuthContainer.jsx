import React, { useState } from "react";

import { RiMovie2Fill } from "react-icons/ri";

import styles from './AuthContainer.module.css';

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

import movieLogo from '../../assets/movieLogo.png';

const AuthContainer = (props) => {

    const [inLogin, setInLogin] = useState(true);

    const toggleInLogin = () => {
        setInLogin((prevState) => !prevState);
    }

    return(
        <div className={styles['auth-container']} >

            <div className={styles['logo-container']}>
                <img src={movieLogo} alt={'movie logo'} />
            </div>

            <div className={styles['form-container']}>
                <div className={styles['form-header']}>
                    <h1><RiMovie2Fill className={styles['movie-icon']} /> Flick Tickets</h1>
                </div>
                {
                    inLogin && 
                    <LoginForm 
                        switchToSignup={toggleInLogin} 
                    />
                }
                {
                    !inLogin && 
                    <SignupForm 
                        switchToLogin={toggleInLogin} 
                    />
                }
            </div>
        </div>
    );
}

export default AuthContainer;