import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { IoClose } from "react-icons/io5";

import styles from './TheatreForm.module.css';

import Input from "../../UI/Input/Input";
import Button from '../../UI/Button/Button';
import Loading from "../../UI/Loading/Loading";

import useInput from '../../../hooks/useInput';

import { useAuthContext } from '../../../store/authContext';
import { useToastContext } from '../../../store/toastContext';

import queryClient from "../../../util/helpers/queryClient";
import { inputValidator, phoneValidator } from '../../../util/helpers/validators';
import { httpTheatresRequest } from "../../../util/http/theatresHttp";

const TheatreForm = (props) => {

    const auth = useAuthContext();
    const toast = useToastContext();

    const {
        value: nameValue,
        isValid: nameIsValid,
        isInvalid: nameIsInvalid,
        inputChangeHandler: nameChangeHandler,
        inputBlurHandler: nameBlurHandler,
        inputResetHandler: nameResetHandler
    } = useInput(inputValidator, 1);

    const {
        value: addressValue,
        isValid: addressIsValid,
        isInvalid: addressIsInvalid,
        inputChangeHandler: addressChangeHandler,
        inputBlurHandler: addressBlurHandler,
        inputResetHandler: addressResetHandler
    } = useInput(inputValidator, 1);

    const {
        value: phoneValue,
        isValid: phoneIsValid,
        isInvalid: phoneIsInvalid,
        inputChangeHandler: phoneChangeHandler,
        inputBlurHandler: phoneBlurHandler,
        inputResetHandler: phoneResetHandler
    } = useInput(phoneValidator, 10);

    const {mutate, isPending} = useMutation({
        mutationFn:httpTheatresRequest,
        onSuccess:({data, message}) => {
            nameResetHandler();
            addressResetHandler();
            phoneResetHandler();
            queryClient.invalidateQueries({queryKey:['theatres-list']});
            queryClient.invalidateQueries({queryKey:['theatre-requests']});
            queryClient.invalidateQueries({queryKey:['user-theatres']});
            toast.openToast('SUCCESS', message);
            props.onClose();
        },
        onError:(err) => {
            toast.openToast('FAIL', err.message);
        }
    });

    const formIsValid = addressIsValid && nameIsValid && phoneIsValid;

    const formSubmitHandler = (event) => {

        event.preventDefault();

        const data = {
            name:nameValue?.trim(),
            address:addressValue?.trim(),
            phone:phoneValue,
            owner:auth.userId,
        }

        mutate({
            url:'/',
            method:'POST',
            data:data,
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + auth.token
            }
        });
    }

    return (
        <>
            {
                isPending && <Loading />
            }
            <div className={styles['theatre-form-container']} >
                <motion.div 
                    className={styles['theatre-form']} 
                    initial={{opacity: 0, y:"50%"}} 
                    animate={{opacity: 1, y:"0%"}} 
                    exit={{opacity: 0, y:"50%"}} 
                    transition={{duration:0.25, type:"tween"}}
                >
                    <div className={styles['theatre-form-header']} >
                        <div className={styles['form-closer']} >
                            <Button 
                                type="button" 
                                className={styles['close-btn']} 
                                onClick={props.onClose} 
                            >
                                <IoClose />
                            </Button>
                        </div>
                        <h4>New Theatre</h4>
                    </div>
                    <form onSubmit={formSubmitHandler} >
                        <Input 
                            label = "Theatre Name" 
                            id = "name" 
                            type = "text" 
                            value = {nameValue} 
                            onChange = {nameChangeHandler} 
                            onBlur = {nameBlurHandler} 
                            isInvalid= {nameIsInvalid} 
                            placeholder = "Enter Theatre Name" 
                            errorContent= {"Theatre name cannot be empty"} 
                        />
                        <Input 
                            label = "Address" 
                            id = "address" 
                            type = "textarea" 
                            value = {addressValue} 
                            onChange = {addressChangeHandler} 
                            onBlur = {addressBlurHandler} 
                            isInvalid= {addressIsInvalid} 
                            placeholder = "Enter Theatre Address" 
                            errorContent= {"Address cannot be empty"} 
                        />
                        <Input 
                            label = "Phone Number" 
                            id = "phone" 
                            type = "number" 
                            value = {phoneValue} 
                            onChange = {phoneChangeHandler} 
                            onBlur = {phoneBlurHandler} 
                            isInvalid= {phoneIsInvalid} 
                            placeholder = "Enter your Phone Number" 
                            errorContent= {"Phone number must be 10 characters"} 
                        />
                        <div className={styles['form-actions']} >
                            <Button 
                                type="submit" 
                                className={styles['submit-btn']} 
                                disabled={!formIsValid} 
                            >
                                Submit
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </>
    );
}

export default TheatreForm;