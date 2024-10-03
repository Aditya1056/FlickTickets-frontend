import { useRef } from "react";

import moment from "moment";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { MdOutlineMovieFilter } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { PiUploadDuotone } from "react-icons/pi";

import styles from './MovieEditForm.module.css';

import Dropdown from "../../UI/Dropdown/Dropdown";
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Loading from "../../UI/Loading/Loading";

import { useAuthContext } from "../../../store/authContext";
import { useToastContext } from '../../../store/toastContext';

import useInput from '../../../hooks/useInput';
import useImageInput from "../../../hooks/useImageInput";
import useDropdown from "../../../hooks/useDropdown";

import queryClient from "../../../util/helpers/queryClient";
import { httpMoviesRequest } from '../../../util/http/moviesHttp';
import { inputValidator, notNullValidator, listValidator } from '../../../util/helpers/validators';

const getSelectedItems = (selectedItems, list) => {

    const filteredList = list.filter(listItem => {

        const existingIndex = selectedItems.findIndex((item) => {
            return item.value === listItem.value;
        })

        if(existingIndex === -1){
            return listItem;
        }
    });

    return {
        selectedItems: selectedItems,
        listItems: filteredList
    };
}

const initialGenreList = [{value:"action"}, {value:"drama"}, {value:"thriller"}, {value:"comedy"}, {value:"science-fiction"}, {value:"fantasy"}, {value:"horror"}, {value:"romance"}, {value:"adventure"}, {value:"documentary"}];
const initialLanguageList = [{value:"English"}, {value:"Telugu"}, {value:"Hindi"}, {value:"Tamil"}, {value:"Malayalam"}, {value:"Kannada"}];
const initialCertificateList = [{value:"U"}, {value:"U/A"}, {value:"A"}, {value:"S"}];

const genreLimit = 3;
const certificateLimit = 1;
const languageLimit = initialLanguageList.length;

const MovieEditForm = (props) => {

    const auth = useAuthContext();
    const toast = useToastContext();

    const imageRef = useRef();

    const { id, title, description, releaseDate, duration, poster } = props;

    const genres = props.genres.map((genre) => {
        return {value:genre};
    });

    const languages = props.languages.map((language) => {
        return {value:language};
    });

    const certificates = props.certificates.map((certificate) => {
        return {value:certificate};
    });

    const formattedDate = moment(new Date(releaseDate)).format('YYYY-MM-DD');

    const genresState = getSelectedItems(genres, initialGenreList);
    const languagesState = getSelectedItems(languages, initialLanguageList);
    const certificatesState = getSelectedItems(certificates, initialCertificateList);
    
    const {
        value: titleValue,
        isValid: titleIsValid,
        isInvalid: titleIsInvalid,
        inputChangeHandler: titleChangeHandler,
        inputBlurHandler: titleBlurHandler,
        inputResetHandler: titleResetHandler
    } = useInput(inputValidator, 1, {value:title, isTouched:true});

    const {
        value: descriptionValue,
        isValid: descriptionIsValid,
        isInvalid: descriptionIsInvalid,
        inputChangeHandler: descriptionChangeHandler,
        inputBlurHandler: descriptionBlurHandler,
        inputResetHandler: descriptionResetHandler
    } = useInput(inputValidator, 1, {value:description, isTouched:true});

    const {
        value: durationValue,
        isValid: durationIsValid,
        isInvalid: durationIsInvalid,
        inputChangeHandler: durationChangeHandler,
        inputBlurHandler: durationBlurHandler,
        inputResetHandler: durationResetHandler
    } = useInput(notNullValidator, 1, {value:duration, isTouched:true});

    const {
        value: releaseDateValue,
        isValid: releaseDateIsValid,
        isInvalid: releaseDateIsInvalid,
        inputChangeHandler: releaseDateChangeHandler,
        inputBlurHandler: releaseDateBlurHandler,
        inputResetHandler: releaseDateResetHandler
    } = useInput(notNullValidator, 1, {value: formattedDate, isTouched:true});

    const {
        selectedItems: selectedGenres,
        listItems: genreList,
        itemsValid: validGenres,
        addItemHandler: addGenreHandler,
        removeItemHandler: removeGenreHandler,
        resetItemsHandler: genreResetHandler
    } = useDropdown(listValidator, initialGenreList, 1, genreLimit, genresState);

    const {
        selectedItems: selectedLanguages,
        listItems: languageList,
        itemsValid: validLanguages,
        addItemHandler: addLanguageHandler,
        removeItemHandler: removeLanguageHandler,
        resetItemsHandler: languageResetHandler
    } = useDropdown(listValidator, initialLanguageList, 1, languageLimit, languagesState);

    const {
        selectedItems: selectedCertificates,
        listItems: certificateList,
        itemsValid: validCertificates,
        addItemHandler: addCertificateHandler,
        removeItemHandler: removeCertificateHandler,
        resetItemsHandler: certificateResetHandler
    } = useDropdown(listValidator, initialCertificateList, 1, certificateLimit, certificatesState);

    const {
        value: imageValue,
        previewUrl: imagePreviewUrl,
        inputChangeHandler: imageChangeHandler,
        inputResetHandler: imageResetHandler
    } = useImageInput(notNullValidator);
    
    const selectImageHandler = () => {
        imageRef.current.click();
    }

    const {mutate, isPending} = useMutation({
        mutationFn: httpMoviesRequest,
        onError:(err) => {
            toast.openToast('FAIL', err.message);
        },
        onSuccess:({data, message}) => {
            titleResetHandler();
            descriptionResetHandler();
            durationResetHandler();
            releaseDateResetHandler();
            genreResetHandler();
            languageResetHandler();
            certificateResetHandler();
            imageResetHandler();
            toast.openToast('SUCCESS', message);
            queryClient.invalidateQueries({queryKey: ['movies']});
            props.onClose();
        }
    });

    const formIsValid = titleIsValid && 
                        descriptionIsValid && 
                        durationIsValid && 
                        releaseDateIsValid && 
                        validGenres && 
                        validLanguages && 
                        validCertificates;

    const formSubmitHandler = (event) => {

        event.preventDefault();

        const modifiedSelectedGenres = selectedGenres.map((genre) => {
            return genre.value;
        });

        const modifiedSelectedLanguages = selectedLanguages.map((language) => {
            return language.value;
        });

        const formData = new FormData();

        formData.append('title', titleValue?.trim());
        formData.append('description', descriptionValue?.trim());
        formData.append('duration', durationValue);
        formData.append('releaseDate', releaseDateValue);
        formData.append('genres', JSON.stringify(modifiedSelectedGenres));
        formData.append('languages', JSON.stringify(modifiedSelectedLanguages));
        formData.append('certificate', selectedCertificates[0].value);
        formData.append('poster', imageValue ? imageValue : null);

        mutate({
            url: `/${id}`,
            method: "PATCH",
            data: formData,
            headers:{
                "Authorization" : "Bearer " + auth.token,
                "Content-Type": "multipart/form-data"
            }
        });
    }

    return (
        <>
            {
                isPending && 
                <Loading />
            }
            <Backdrop />
            <div className={styles['movie-form-container']} >
                <motion.div 
                    className={styles['movie-form']} 
                    initial={{opacity:0, y: "50%"}} 
                    animate={{opacity:1, y:"0%"}} 
                    exit={{opacity:0, y:"50%"}} 
                    transition={{duration: 0.3, type:"tween"}} 
                >
                    <div className={styles['movie-form-closer']} >
                        <button 
                            type="button" 
                            className={styles['close-btn']} 
                            onClick={props.onClose} 
                        >
                            <IoMdClose />
                        </button>
                    </div>
                    <div className={styles['movie-form-header']} >
                        Edit Movie<MdOutlineMovieFilter className={styles['new-movie-icon']} />
                    </div>
                    <form onSubmit={formSubmitHandler}>
                        <Input 
                            label = "Title" 
                            id = "title" 
                            type = "text"  
                            value = {titleValue} 
                            onChange = {titleChangeHandler} 
                            onBlur = {titleBlurHandler} 
                            isInvalid={titleIsInvalid} 
                            placeholder = "Enter movie title" 
                            errorContent={"Title cannot be empty"} 
                        />
                        <Input 
                            label = "Description" 
                            id = "description" 
                            type = "textarea"   
                            value = {descriptionValue} 
                            onChange = {descriptionChangeHandler} 
                            onBlur = {descriptionBlurHandler} 
                            isInvalid={descriptionIsInvalid} 
                            placeholder = "Enter movie description" 
                            errorContent={"Description cannot be empty"} 
                        />
                        <div className={styles['double-inputs']} >
                            <div className={styles['double-input-item']}>
                                <Input 
                                    label = "Duration (in minutes)" 
                                    id = "duration" 
                                    type = "number"   
                                    value = {durationValue} 
                                    onChange = {durationChangeHandler} 
                                    onBlur = {durationBlurHandler} 
                                    isInvalid={durationIsInvalid} 
                                    placeholder = "Enter movie duration" 
                                    errorContent={"Duration is not valid"} 
                                />
                            </div>
                            <div className={styles['double-input-item']}>
                                <Input 
                                    label = "Release Date" 
                                    id = "releaseDate" 
                                    type = "date" 
                                    value = {releaseDateValue} 
                                    onChange = {releaseDateChangeHandler} 
                                    onBlur = {releaseDateBlurHandler} 
                                    isInvalid= {releaseDateIsInvalid} 
                                    errorContent= {"Date is not valid"} 
                                />
                            </div>
                        </div>
                        <div className={styles['double-inputs']}>
                            <div className={styles['double-input-item']}>
                                <label>Genre <sup>*</sup></label>
                                <Dropdown 
                                    selectedItems={selectedGenres} 
                                    itemsList={genreList} 
                                    addItem={addGenreHandler} 
                                    removeItem={removeGenreHandler} 
                                />
                            </div>
                            <div className={styles['double-input-item']}>
                                <label>Languages <sup>*</sup></label>
                                <Dropdown 
                                    selectedItems={selectedLanguages} 
                                    itemsList={languageList} 
                                    addItem={addLanguageHandler} 
                                    removeItem={removeLanguageHandler} 
                                />
                            </div>
                        </div>
                        <div className={styles['double-inputs']}>
                            <div className={styles['double-input-item']}>
                                <label>Certificate <sup>*</sup></label>
                                <Dropdown 
                                    selectedItems={selectedCertificates} 
                                    itemsList={certificateList} 
                                    addItem={addCertificateHandler} 
                                    removeItem={removeCertificateHandler}  
                                />
                            </div>
                            <div className={styles['double-input-item']}>
                                <label>Poster <sup>*</sup></label>
                                <input 
                                    type="file" 
                                    accept="image/png, image/jpg, image/jpeg" 
                                    hidden 
                                    ref={imageRef} 
                                    onChange={imageChangeHandler} 
                                />
                                <div className={styles['image-input']} >
                                    <div className={styles['image-preview']} >
                                        {
                                            imagePreviewUrl && 
                                            <img src={imagePreviewUrl} alt={"poster"} /> 
                                        }
                                        {
                                            !imagePreviewUrl && 
                                            <img src={poster} alt={"poster"} /> 
                                        }
                                    </div>
                                    <button 
                                        type="button" 
                                        className={styles['upload-btn']} 
                                        onClick={selectImageHandler} 
                                    >
                                        <PiUploadDuotone />
                                    </button>
                                </div>
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
                </motion.div>
            </div>
        </>
    );
}

export default MovieEditForm;