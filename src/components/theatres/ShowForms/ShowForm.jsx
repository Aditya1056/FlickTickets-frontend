import { useState, useEffect } from 'react';

import moment from 'moment';
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { MdOutlineMovieFilter } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

import styles from './ShowForm.module.css';

import Dropdown from "../../UI/Dropdown/Dropdown";
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import Loading from "../../UI/Loading/Loading";

import { useAuthContext } from "../../../store/authContext";
import { useToastContext } from '../../../store/toastContext';

import useInput from '../../../hooks/useInput';
import Error from '../../UI/Error/Error';
import useDropdown from "../../../hooks/useDropdown";

import queryClient from "../../../util/helpers/queryClient";
import { getMoviesRequest } from '../../../util/http/moviesHttp';
import { httpShowsRequest } from '../../../util/http/showsHttp';
import { notNullValidator, listValidator } from '../../../util/helpers/validators';

const ShowForm = (props) => {

    const auth = useAuthContext();
    const toast = useToastContext();

    const [initialMovieList, setInitialMovieList] = useState([]);
    const [initialLanguageList, setInitialLanguageList] = useState([]);

    const [minSelectDate, setMinSelectDate] = useState(() => {
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        return moment(nextDay).format('YYYY-MM-DD');
    });

    const {
        selectedItems: selectedMovies,
        listItems: movieList,
        itemsValid: validMovies,
        addItemHandler: addMovieHandler,
        removeItemHandler: removeMovieHandler,
        resetItemsHandler: movieResetHandler
    } = useDropdown(listValidator, initialMovieList, 1, 1);

    const {
        selectedItems: selectedLanguages,
        listItems: languageList,
        itemsValid: validLanguages,
        addItemHandler: addLanguageHandler,
        removeItemHandler: removeLanguageHandler,
        resetItemsHandler: languageResetHandler
    } = useDropdown(listValidator, initialLanguageList, 1, 1);

    const {
        value: dateValue,
        isValid: dateIsValid,
        isInvalid: dateIsInvalid,
        inputChangeHandler: dateChangeHandler,
        inputBlurHandler: dateBlurHandler,
        inputResetHandler: dateResetHandler
    } = useInput(notNullValidator, 1);

    const {
        value: startTimeValue,
        isValid: startTimeIsValid,
        isInvalid: startTimeIsInvalid,
        inputChangeHandler: startTimeChangeHandler,
        inputBlurHandler: startTimeBlurHandler,
        inputResetHandler: startTimeResetHandler
    } = useInput(notNullValidator, 1);

    const {
        value: breakDurationValue,
        isValid: breakDurationIsValid,
        isInvalid: breakDurationIsInvalid,
        inputChangeHandler: breakDurationChangeHandler,
        inputBlurHandler: breakDurationBlurHandler,
        inputResetHandler: breakDurationResetHandler
    } = useInput(notNullValidator, 1);

    const {
        value: ticketPriceValue,
        isValid: ticketPriceIsValid,
        isInvalid: ticketPriceIsInvalid,
        inputChangeHandler: ticketPriceChangeHandler,
        inputBlurHandler: ticketPriceBlurHandler,
        inputResetHandler: ticketPriceResetHandler
    } = useInput(notNullValidator, 1);

    const {
        value: totalSeatsValue,
        isValid: totalSeatsIsValid,
        isInvalid: totalSeatsIsInvalid,
        inputChangeHandler: totalSeatsChangeHandler,
        inputBlurHandler: totalSeatsBlurHandler,
        inputResetHandler: totalSeatsResetHandler
    } = useInput(notNullValidator, 1);

    const {data:fetchedData, isPending:fetchPending, isError, error} = useQuery({
        queryKey:['movies'],
        queryFn:({signal}) => {
            return getMoviesRequest({
                signal,
                url:'/',
                headers:{
                    'Authorization':'Bearer ' + auth.token
                },
            });
        }
    });

    const {mutate, isPending} = useMutation({
        mutationFn: httpShowsRequest,
        onError:(err) => {
            toast.openToast('FAIL', err.message);
        },
        onSuccess:({data, message}) => {
            dateResetHandler();
            startTimeResetHandler();
            breakDurationResetHandler();
            movieResetHandler();
            ticketPriceResetHandler();
            totalSeatsResetHandler();
            languageResetHandler();
            toast.openToast('SUCCESS', message);
            queryClient.invalidateQueries({queryKey: ['shows', props.theatreId]});
            props.onClose();
        }
    });

    useEffect(() => {
        if(fetchedData && fetchedData.movies.length > 0){
            const movieList = fetchedData.movies.map((movie) => {
                return {
                    id: movie._id, 
                    value: movie.title, 
                    releaseDate: movie.releaseDate,
                    duration:movie.duration,
                    languages:movie.languages
                };
            });
            setInitialMovieList(movieList);
        }
    }, [fetchedData]);

    useEffect(() => {

        let nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay = moment(nextDay).format('YYYY-MM-DD');
        
        if(selectedMovies.length === 0){
            setMinSelectDate(nextDay);
            dateResetHandler();
            languageResetHandler();
        }
        else if(selectedMovies.length > 0){
            const movieReleaseDate = moment(selectedMovies[0].releaseDate).format('YYYY-MM-DD');
            const languages = selectedMovies[0].languages.map((language) => {
                return {value: language};
            });
            setInitialLanguageList(languages);
            dateResetHandler();
            setMinSelectDate((prevDate) => {
                return movieReleaseDate > nextDay ? movieReleaseDate : nextDay;
            });
        }
    }, [selectedMovies]);

    const formIsValid = validMovies && 
                        validLanguages && 
                        dateIsValid && 
                        startTimeIsValid && 
                        breakDurationIsValid && 
                        totalSeatsIsValid && 
                        ticketPriceIsValid;

    const formSubmitHandler = (event) => {

        event.preventDefault();

        const startTimeDate = new Date(dateValue);

        let hours = Number(startTimeValue.split(':')[0]);
        let minutes = Number(startTimeValue.split(':')[1]);

        startTimeDate.setHours(hours);
        startTimeDate.setMinutes(minutes);

        let totalShowDuration = startTimeDate.getTime() + breakDurationValue*60*1000 + selectedMovies[0].duration*60*1000;

        const endTimeDate = new Date(totalShowDuration);

        const data = {
            movie: selectedMovies[0].id,
            theatre:props.theatreId,
            language:selectedLanguages[0].value,
            start: startTimeDate,
            end: endTimeDate,
            ticketPrice: ticketPriceValue,
            totalSeats: totalSeatsValue
        };

        mutate({
            url: '/',
            method: "POST",
            data: data,
            headers:{
                "Authorization" : "Bearer " + auth.token,
            }
        });
    }

    return (
        <>
            {
                (isPending || fetchPending) && 
                <Loading />
            }
            <div className={styles['show-form-container']} >
                <motion.div 
                    className={styles['show-form']} 
                    initial={{opacity:0, y: "50%"}} 
                    animate={{opacity:1, y:"0%"}} 
                    exit={{opacity:0, y:"50%"}} 
                    transition={{duration: 0.3, type:"tween"}} 
                >
                    <div className={styles['show-form-closer']} >
                        <button 
                            type="button" 
                            className={styles['close-btn']} 
                            onClick={props.onClose} 
                        >
                            <IoMdClose />
                        </button>
                    </div>
                    <div className={styles['show-form-header']} >
                        {props.theatre} - New Show<MdOutlineMovieFilter className={styles['new-show-icon']} />
                    </div>
                    {
                        (isError || (fetchedData && fetchedData.movies.length === 0)) && 
                        <Error message={"Movies not avaiable"} marginTop="2rem" />
                    }
                    {
                        !fetchPending && !isError && 
                        <form onSubmit={formSubmitHandler}>
                            <label>Select a movie <sup>*</sup></label>
                            <Dropdown 
                                selectedItems={selectedMovies} 
                                itemsList={movieList} 
                                addItem={addMovieHandler} 
                                removeItem={removeMovieHandler} 
                            />
                            <div className={styles['double-inputs']} >
                                <div className={styles['double-input-item']}>
                                    <label>Select a Language <sup>*</sup></label>
                                    <Dropdown 
                                        selectedItems={selectedLanguages} 
                                        itemsList={languageList} 
                                        addItem={addLanguageHandler} 
                                        removeItem={removeLanguageHandler} 
                                    />
                                </div>
                                <div className={styles['double-input-item']}>
                                    <Input 
                                        label = "Select Date" 
                                        id = "date" 
                                        type = "date" 
                                        value = {dateValue} 
                                        onChange = {dateChangeHandler} 
                                        onBlur = {dateBlurHandler} 
                                        isInvalid={dateIsInvalid} 
                                        placeholder = "Select show date" 
                                        min={minSelectDate} 
                                        errorContent={"Show date is not valid"} 
                                    />
                                </div>
                            </div>
                            <div className={styles['double-inputs']}>
                                <div className={styles['double-input-item']}>
                                    <Input 
                                        label = "Start Time" 
                                        id = "startTime" 
                                        type = "time" 
                                        value = {startTimeValue} 
                                        onChange = {startTimeChangeHandler} 
                                        onBlur = {startTimeBlurHandler} 
                                        isInvalid= {startTimeIsInvalid} 
                                        placeholder={"Select show time"} 
                                        errorContent= {"Start time is not valid"} 
                                    />
                                </div>
                                <div className={styles['double-input-item']}>
                                    <Input 
                                        label = "Interval Duration (in minutes)" 
                                        id = "intervalDuration" 
                                        type = "number" 
                                        value = {breakDurationValue} 
                                        onChange = {breakDurationChangeHandler} 
                                        onBlur = {breakDurationBlurHandler} 
                                        isInvalid={breakDurationIsInvalid} 
                                        min="0" 
                                        max="60" 
                                        step="1" 
                                        placeholder = "Enter interval duration" 
                                        errorContent={"Interval duration is not valid"} 
                                    />
                                </div>
                            </div>
                            <div className={styles['double-inputs']}>
                                <div className={styles['double-input-item']}>
                                    <Input 
                                        label = "Ticket Price" 
                                        id = "ticketPrice" 
                                        type = "number" 
                                        value = {ticketPriceValue} 
                                        onChange = {ticketPriceChangeHandler} 
                                        onBlur = {ticketPriceBlurHandler} 
                                        isInvalid={ticketPriceIsInvalid} 
                                        min="0" 
                                        step="1" 
                                        placeholder = "Enter ticket price"   
                                        errorContent={"Ticket price is not valid"} 
                                    />
                                </div>
                                <div className={styles['double-input-item']}>
                                    <Input 
                                        label = "Total Seats" 
                                        id = "totalSeats" 
                                        type = "number" 
                                        value = {totalSeatsValue} 
                                        onChange = {totalSeatsChangeHandler} 
                                        onBlur = {totalSeatsBlurHandler} 
                                        isInvalid={totalSeatsIsInvalid} 
                                        min="0" 
                                        step="1" 
                                        placeholder = "Enter total seats" 
                                        errorContent={"Total seats is not valid"} 
                                    />
                                </div>
                            </div>
                            <Button 
                                type="submit" 
                                className={styles['submit-btn']} 
                                disabled={!formIsValid} 
                            >
                                Submit
                            </Button>
                        </form>
                    }
                </motion.div>
            </div>
        </>
    );
}

export default ShowForm;