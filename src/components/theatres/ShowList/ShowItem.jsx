import { useState } from "react";

import moment from "moment";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";

import { FiEdit3 } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";

import styles from './ShowItem.module.css';

import ShowEditForm from "../ShowForms/ShowEditForm";

import Button from '../../UI/Button/Button';
import Loading from "../../UI/Loading/Loading";
import ConfirmModal from "../../UI/ConfirmModal/ConfirmModal";

import { useAuthContext } from "../../../store/authContext";
import { useToastContext } from "../../../store/toastContext";

import queryClient from "../../../util/helpers/queryClient";
import { getTime } from "../../../util/helpers/formatDate";
import { httpShowsRequest } from "../../../util/http/showsHttp";

const ShowItem = (props) => {

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditForm, setEditForm] = useState(false);

    const toggleShowDelete = () => {
        setShowDeleteModal((prev) => !prev);
    }

    const toggleShowEdit = () => {
        setEditForm((prev) => !prev);
    }

    const startDate = new Date(props.start);
    const endDate = new Date(props.end);

    const date = moment(startDate).format('Do MMM YYYY');

    const startTime = getTime(startDate);
    const endTime = getTime(endDate);

    const auth = useAuthContext();
    const toast = useToastContext();

    const {mutate, isPending} = useMutation({
        mutationFn:httpShowsRequest,
        onSuccess:({data, message}) => {
            queryClient.invalidateQueries({queryKey: ['shows', props.theatre._id]});
            toast.openToast('SUCCESS', message);
            toggleShowDelete();
        },
        onError:(err) => {
            toast.openToast('FAIL', err.message);
        }
    });

    const deleteShowHandler = () => {
        mutate({
            url:`/${props.id}`,
            method:"DELETE",
            headers:{
                'Authorization':'Bearer ' + auth.token
            }
        });
    }

    return (
        <>
            {
                isPending && <Loading />
            }
            <AnimatePresence key="presence-delete-modal" >
                {
                    showDeleteModal && 
                    <ConfirmModal 
                        key="delete-show-modal" 
                        header={`Delete ${props.movie.title} Show?`} 
                        message={`Do you really want to delete this show? This action cannot be undone!`} 
                        onCancel={toggleShowDelete} 
                        onConfirm={deleteShowHandler} 
                    />
                }
            </AnimatePresence>
            <AnimatePresence>
                {
                    showEditForm && 
                    <ShowEditForm 
                        key="edit-show-modal" 
                        id={props.id}  
                        theatre={props.theatre.name} 
                        theatreId={props.theatre._id} 
                        onClose={toggleShowEdit} 
                        date={date} 
                        movie={props.movie} 
                        language={props.language} 
                        start={props.start} 
                        end={props.end} 
                        ticketPrice={props.ticketPrice} 
                        totalSeats={props.totalSeats} 
                    />
                }
            </AnimatePresence>
            <li className={styles['show-item']} >
                <div className={styles['show-date']} >
                    <p>{date}</p>
                </div>
                <div className={styles['show-movie']} >
                    <p>{props.movie.title}</p>
                </div>
                <div className={styles['show-language']} >
                    <p> <span>Language: </span> {props.language}</p>
                </div>
                <div className={styles['show-start']} >
                    <p> <span>Start at: </span> {startTime}</p>
                </div>
                <div className={styles['show-end']} >
                    <p><span>Ends at: </span> {endTime}</p>
                </div>
                <div className={styles['show-ticket-price']} >
                    <p><span>Ticket price: </span> ₹ {props.ticketPrice}</p>
                </div>
                <div className={styles['show-total-seats']} >
                    <p><span>Total seats: </span> {props.totalSeats}</p>
                </div>
                <div className={styles['show-booked-seats']} >
                    <p><span>Booked seats: </span> {props.bookedSeats}</p>
                </div>
                <div className={styles['show-actions']} >
                    {
                        (props.theatre.owner.toString() === auth.userId && new Date(props.start).getTime() > new Date().getTime()) && 
                        <Button 
                            type="button" 
                            className={styles['edit-btn']} 
                            onClick={toggleShowEdit} 
                        >
                            Edit <FiEdit3 className={styles['edit-icon']} />
                        </Button>
                    }
                    <Button 
                        type="button" 
                        className={styles['delete-btn']} 
                        onClick={toggleShowDelete} 
                    >
                        Delete <MdDeleteForever className={styles['delete-icon']} />
                    </Button>
                </div>
            </li>
        </>
    );
}

export default ShowItem;