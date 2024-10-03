import { useState, useRef, useEffect } from 'react';

import moment from 'moment';
import { useQuery, useMutation } from '@tanstack/react-query';

import { RiEditCircleFill } from "react-icons/ri";
import { FiUpload } from "react-icons/fi";

import styles from './UserProfile.module.css';

import { useAuthContext } from '../../store/authContext';
import { useToastContext } from '../../store/toastContext';

import Button from '../UI/Button/Button';
import Loading from '../UI/Loading/Loading';
import Error from '../UI/Error/Error';

import useImageInput from '../../hooks/useImageInput';

import queryClient from '../../util/helpers/queryClient';
import { notNullValidator } from '../../util/helpers/validators';
import { httpUsersRequest, getUsersRequest } from '../../util/http/usersHttp';

import defaultUserProfile from '../../assets/profile.png';

const UserProfile = (props) => {

    const imageRef = useRef();

    const auth = useAuthContext();
    const toast = useToastContext();

    const [openForm, setOpenForm] = useState(false);

    const {
        value: imageValue,
        previewUrl:imagePreviewUrl,
        isValid:imageIsValid,
        inputChangeHandler: imageChangeHandler,
        inputResetHandler: imageResetHandler
    } = useImageInput(notNullValidator);

    const toggleProfileForm = () => {
        setOpenForm((prev) => !prev);
        imageResetHandler();
    }

    const fileInputHandler = () => {
        if(imageRef){
            imageRef.current.click();
        }
    }

    const {data, isPending, isError, error} = useQuery({
        queryKey:['user-profile', auth.userId],
        queryFn:({signal}) => {
            return getUsersRequest({
                signal,
                url:'/',
                headers:{
                    'Authorization': 'Bearer ' + auth.token
                }
            });
        }
    });

    const { mutate, isPending : postPending } = useMutation({
        mutationFn: httpUsersRequest,
        onSuccess:({data, message}) => {
            queryClient.invalidateQueries({queryKey: ['user-profile', auth.userId]});
            imageResetHandler();
            toast.openToast('SUCCESS', message);
            toggleProfileForm();
        },
        onError:(err) => {
            toast.openToast('FAIL', err.message);
        }
    });

    const imageSubmitHandler = () => {

        const formData = new FormData();
        formData.append('image', imageValue);
        mutate({
            url:'/change-profile',
            method:'PATCH',
            data:formData,
            headers:{
                'Content-Type':'multipart/form-data',
                'Authorization':'Bearer ' + auth.token
            }
        });
    }

    useEffect(() => {
        if(data && data.image && data.image.url !== auth.userImage){
            auth.changeUserImage(data.image.url);
        }
    }, [data]);

    return (
        <>
            {
                (isPending || postPending) && 
                <Loading />
            }
            {
                isError && <Error message={error.message} marginTop={"5rem"} />
            }
            {
                !isPending && !isError && data && 
                <div className={styles['user-profile']} >
                    <h2>{data.name}</h2>
                    <div className={styles['user-image']} >
                        {
                            !openForm && <img src={data.image ? data.image.url : defaultUserProfile} alt={"profile"} />
                        }
                        {
                            openForm && imagePreviewUrl && 
                            <img src={imagePreviewUrl ? imagePreviewUrl : defaultUserProfile} alt={"preview"} />
                        }
                        {
                            openForm && !imagePreviewUrl && 
                            <p>preview</p>
                        }
                    </div>
                    <div className={styles['profile-actions']} >
                        {
                            !openForm && 
                            <Button 
                                type="button" 
                                className={styles['pic-change-btn']} 
                                onClick={toggleProfileForm} 
                            >
                                <RiEditCircleFill className={styles['edit-icon']} /> Change Image
                            </Button>
                        }
                        {
                            openForm && 
                            <>
                                <input 
                                    type="file" 
                                    accept="image/png, image/jpg, image/jpeg" 
                                    onChange={imageChangeHandler} 
                                    ref={imageRef} 
                                    hidden 
                                />
                                <Button 
                                    type="button" 
                                    className={styles['upload-btn']} 
                                    onClick={fileInputHandler} 
                                >
                                    <FiUpload className={styles['upload-icon']} />
                                </Button>
                                <Button 
                                    type="button" 
                                    className={styles['cancel-btn']} 
                                    onClick={toggleProfileForm}  
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="button" 
                                    className={styles['submit-btn']} 
                                    onClick={imageSubmitHandler} 
                                    disabled={!imageIsValid} 
                                >
                                    Submit
                                </Button>
                            </>
                        }
                    </div>
                    <div className={styles['user-details']} >
                        <p>Email -  {data.email}</p>
                        <p>Born -  {moment(data.dateOfBirth).format('DD-MMM-YYYY')}</p>
                    </div>
                </div>

            }
        </>
    );
}

export default UserProfile;