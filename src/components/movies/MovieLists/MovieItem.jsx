import { useState } from "react";

import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { MdAccessTime } from "react-icons/md";
import { BiCertification } from "react-icons/bi";
import { GrLanguage } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

import styles from './MovieItem.module.css';

import MovieEditForm from "../MovieForms/MovieEditForm";

import Loading from "../../UI/Loading/Loading";
import Button from "../../UI/Button/Button";
import ConfirmModal from "../../UI/ConfirmModal/ConfirmModal";

import { useToastContext } from "../../../store/toastContext";
import { useAuthContext } from "../../../store/authContext";

import queryClient from "../../../util/helpers/queryClient";
import { httpMoviesRequest } from "../../../util/http/moviesHttp";

const MovieItem = (props) => {

    const auth = useAuthContext();
    const toast = useToastContext();

    const navigate = useNavigate();

    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    const toggleOpenConfirmModal = () => {
        setOpenConfirmModal((prev) => !prev);
    }

    const toggleEditForm = () => {
        setShowEditForm((prev) => !prev);
    }

    const { id, title, description, duration, releaseDate, genres, languages, certificate, poster } = props;

    let genresList = "";
    let languagesList = "";

    for(let genre of genres){
        genresList = genresList + ", " + genre;
    }

    for(let language of languages){
        languagesList = languagesList + ", " + language;
    }

    genresList = genresList.substring(2);
    languagesList = languagesList.substring(2);

    let certificateClasses = styles['movie-certificate'];

    if(certificate === 'A' || certificate === 'S'){
        certificateClasses += ' ' + styles['warning'];
    }
    
    if(certificate === 'U'){
        certificateClasses += ' ' + styles['safe'];
    }

    let weekDiff = new Date();
    weekDiff.setDate(weekDiff.getDate() + 7);

    const { mutate, isPending } = useMutation({
        mutationFn:httpMoviesRequest,
        onError:(err) => {
            toast.openToast('FAIL', err.message);
        },
        onSuccess:({data, message}) => {
            queryClient.invalidateQueries({queryKey: ['movies']});
            toast.openToast('SUCCESS', message);
            toggleOpenConfirmModal();
        }
    });

    const deleteMovieHandler = () => {
        mutate({
            url:`/${id}`,
            method:"DELETE",
            headers:{
                'Authorization': 'Bearer ' + auth.token
            }
        });
    }

    const moviePageHandler = () => {
        let nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(0, 0, 0);
        navigate(`/movie/${id}?language=${languages[0]}&date=${nextDay}`);
    }

    return (
        <>
            {
                isPending && <Loading />
            }
            <AnimatePresence>
                {
                    showEditForm && 
                    <MovieEditForm 
                        key="movie-edit-form" 
                        id={id} 
                        title={title} 
                        description={description} 
                        duration={duration} 
                        releaseDate={releaseDate} 
                        genres={genres} 
                        languages={languages} 
                        certificates={[certificate]} 
                        poster={poster} 
                        onClose={toggleEditForm} 
                    />
                }
            </AnimatePresence>
            <AnimatePresence>
                {
                    openConfirmModal && 
                    <ConfirmModal 
                        key="delete-confirm-modal" 
                        header={`Delete ${title} movie ?`} 
                        message="Movie data cannot be retrieved after deletion." 
                        onCancel={toggleOpenConfirmModal} 
                        onConfirm={deleteMovieHandler} 
                    />
                }
            </AnimatePresence>
            <li className={styles['movie-item']} >
                <div className={styles['movie-poster']} >
                    <img src={poster} alt="Poster" />
                </div>
                <div className={styles['movie-details']} >
                    <h4 className={styles['movie-title']} >{title}</h4>
                    <p className={styles['movie-description']} >{description}</p>
                    <div className={styles['movie-duration-genres']} >
                        <p className={styles['movie-duration']}><MdAccessTime className={styles['time-icon']} /> {duration} min</p>
                        <p className={styles['movie-genres']}> Genres: {genresList}</p>
                    </div>
                    <div className={styles['movie-certificate-languages']} >
                        <p className={certificateClasses} ><BiCertification className={styles['certificate-icon']} />{certificate}</p>
                        <p className={styles['movie-languages']} ><GrLanguage className={styles['language-icon']} /> {languagesList}</p>
                    </div>
                </div>
                <div className={styles['movie-actions']} >
                    <Button 
                        key="booking-btn" 
                        type="button" 
                        className={styles['booking-btn']} 
                        onClick={moviePageHandler}
                        
                    >
                        {
                            new Date(releaseDate).getTime() > weekDiff.getTime() ? 'Upcoming' : 'Book Now' 
                        }
                    </Button>
                    {
                        auth.userRole === 'admin' && 
                        <>
                            <Button 
                                key="edit-movie-btn" 
                                type="button" 
                                className={styles['edit-btn']} 
                                onClick={toggleEditForm} 
                            >
                                Edit <CiEdit className={styles['edit-icon']} />
                            </Button>
                            <Button 
                                key="delete-movie-btn"  
                                type="button" 
                                className={styles['delete-btn']} 
                                onClick={toggleOpenConfirmModal} 
                            >
                                Delete <MdDelete className={styles['delete-icon']} />
                            </Button>
                        </>
                    }
                </div>
            </li>
        </>
    );
}

export default MovieItem;