import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";

import { BsInfoCircleFill } from "react-icons/bs";
import { IoCheckmarkCircle } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FiEdit3 } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { FaRegCircleDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

import styles from './TheatreItem.module.css';

import TheatreEditForm from '../TheatreForms/TheatreEditForm';

import Button from '../../UI/Button/Button';
import Loading from "../../UI/Loading/Loading";
import ConfirmModal from "../../UI/ConfirmModal/ConfirmModal";

import defaultProfilePicture from '../../../assets/profile.png';

import { useAuthContext } from "../../../store/authContext";
import { useToastContext } from "../../../store/toastContext";

import queryClient from "../../../util/helpers/queryClient";
import { httpTheatresRequest } from "../../../util/http/theatresHttp";

const TheatreItem = (props) => {

    const [showDeleteTheatre, setShowDeleteTheatre] = useState(false);
    const [showEditTheatre, setEditTheatre] = useState(false);

    const toggleDeleteTheatre = () => {
        setShowDeleteTheatre((prev) => !prev);
    }

    const toggleEditTheatre = () => {
        setEditTheatre((prev) => !prev);
    }

    const auth = useAuthContext();
    const toast = useToastContext();

    const navigate = useNavigate();

    const {mutate:approveMutate , isPending:approvePending} = useMutation({
        mutationFn:httpTheatresRequest,
        onSuccess:({data, message}) => {
            queryClient.invalidateQueries({queryKey:['theatre-requests']});
            queryClient.invalidateQueries({queryKey:['theatres-list']});
            queryClient.invalidateQueries({queryKey:['user-theatres']});
            toast.openToast('SUCCESS', message);
        },
        onError:(err) => {
            toast.openToast('FAIL', err.message);
        }
    });

    const {mutate:deleteMutate , isPending:deletePending} = useMutation({
        mutationFn:httpTheatresRequest,
        onSuccess:({data, message}) => {
            queryClient.invalidateQueries({queryKey:['theatre-requests']});
            queryClient.invalidateQueries({queryKey:['theatres-list']});
            queryClient.invalidateQueries({queryKey:['user-theatres']});
            toast.openToast('SUCCESS', message);
            toggleDeleteTheatre();
        },
        onError:(err) => {
            toast.openToast('FAIL', err.message);
        }
    });

    const approveTheatreHandler = () => {
        approveMutate({
            url:`/approve/${props.id}`,
            method:"PATCH",
            headers:{
                'Authorization':'Bearer ' + auth.token
            }
        });
    }

    const deleteTheatreHandler = () => {
        deleteMutate({
            url:`/${props.id}`,
            method:"DELETE",
            headers:{
                'Authorization':'Bearer ' + auth.token
            }
        });
    }

    return (
        <>
            <AnimatePresence key="presence-delete-modal" >
                {
                    showDeleteTheatre && 
                    <ConfirmModal 
                        key="delete-theatre-modal" 
                        header={`Delete ${props.name} Theatre?`} 
                        message={`Do you really want to delete/decline this theatre? This action cannot be undone!`} 
                        onCancel={toggleDeleteTheatre} 
                        onConfirm={deleteTheatreHandler} 
                    />
                }
            </AnimatePresence>
            <AnimatePresence key="presence-edit-modal" >
                {
                    showEditTheatre && 
                    <TheatreEditForm 
                        key={props.id} 
                        id={props.id} 
                        name={props.name} 
                        address={props.address} 
                        phone={props.phone} 
                        onClose={toggleEditTheatre} 
                    />
                }
            </AnimatePresence>
            {
                (approvePending || deletePending) && <Loading />
            }
            <li className={styles['theatre-item']} >
                <div className={styles['theatre-name']} >
                    <p>{props.name}</p>
                </div>
                <div className={styles['theatre-address']} >
                    <p><FaLocationDot className={styles['location-icon']} /> {props.address}</p>
                </div>
                {
                    !props.userTheatres && 
                    <div className={styles['theatre-owner']} >
                        <p>
                            {
                                auth.userId !== props.owner._id && 
                                <>
                                    {
                                        props.owner.image &&  
                                        <img src={props.owner.image.url} alt={"profile"} />
                                    }
                                    {
                                        !props.owner.image &&  
                                        <img src={defaultProfilePicture} alt={"profile"} />
                                    }
                                    {props.owner.name}
                                </>
                            }
                            {
                                auth.userId === props.owner._id && 
                                <span>You</span>
                            }
                        </p>
                    </div>
                }
                <div className={styles['theatre-phone']} >
                    <p><FaPhoneAlt className={styles['phone-icon']} /> {props.phone}</p>
                </div>
                {
                    props.userTheatres && 
                    <div className={styles['theatre-status']} >
                        {
                            props.isApproved &&  
                            <p><FaRegCircleDot className={styles['active-icon']} /> Active</p>
                        }
                        {
                            !props.isApproved &&  
                            <p><FaRegCircleDot className={styles['pending-icon']} /> Requested</p>
                        }
                    </div>
                }
                <div className={styles['theatre-actions']} >
                    {
                        props.requests && 
                        <>
                            <Button 
                                type="button" 
                                className={styles['approve-btn']} 
                                onClick={approveTheatreHandler} 
                            >
                                Approve <IoCheckmarkCircle className={styles['approve-icon']} />
                            </Button>
                            <Button 
                                type="button" 
                                className={styles['decline-btn']} 
                                onClick={toggleDeleteTheatre} 
                                >
                                Decline <IoIosCloseCircleOutline className={styles['decline-icon']} />
                            </Button>
                        </>
                    }
                    {
                        props.userTheatres && props.owner._id === auth.userId && 
                        <Button 
                            type="button" 
                            className={styles['edit-btn']} 
                            onClick={toggleEditTheatre} 
                        >
                            Edit <FiEdit3 className={styles['edit-icon']} />
                        </Button>
                    }
                    {
                        (props.allTheatres || props.userTheatres) && 
                        <Button 
                            type="button" 
                            className={styles['decline-btn']} 
                            onClick={toggleDeleteTheatre} 
                        >
                            Delete <MdDeleteForever className={styles['delete-icon']} />
                        </Button>
                    }
                </div>
                {
                    (props.allTheatres || props.userTheatres) &&  
                    <div className={styles['theatre-info']} >
                        <Button 
                            className={styles['info-btn']} 
                            disabled={!props.isApproved} 
                            onClick={() => navigate(`/theatre/${props.id}`)} 
                        >
                            <BsInfoCircleFill className={styles['info-icon']} />
                        </Button>
                    </div>
                }
            </li>
        </>
    );
}

export default TheatreItem;