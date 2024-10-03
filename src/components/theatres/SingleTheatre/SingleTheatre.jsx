import { useState } from 'react';

import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';

import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineMovieFilter } from "react-icons/md";
import { MdOutlineLabelImportant } from "react-icons/md";

import styles from './SingleTheatre.module.css';

import ShowForm from '../ShowForms/ShowForm';
import ShowList from '../ShowList/ShowList';

import Pagination from '../../shared/Pagination/Pagination';

import Loading from '../../UI/Loading/Loading';
import Button from '../../UI/Button/Button';
import Error from '../../UI/Error/Error';

import { useAuthContext } from '../../../store/authContext';

import { getTheatresRequest } from '../../../util/http/theatresHttp';
import { getShowsRequest } from '../../../util/http/showsHttp';

const limit = 25;

const SingleTheatre = (props) => {

    const auth = useAuthContext();

    const [ searchParams ] = useSearchParams();

    const navigate = useNavigate();

    const [showForm, setShowForm] = useState(false);

    const toggleShowForm = () => {
        setShowForm((prev) => !prev);
    }

    let page = searchParams.get('page');

    let currPage = page ? Number(page) : 1;

    const pageChangeHandler = (page) => {
        navigate(`/theatre/${props.id}?page=${page}`);
    }

    const {data, isPending, isError, error} = useQuery({
        queryKey:['theatre', props.id],
        queryFn:({signal}) => {
            return getTheatresRequest({
                url:`/theatre/${props.id}`,
                signal,
                headers:{
                    'Authorization':'Bearer ' + auth.token
                }
            });
        }
    });

    const {data:fetchedShows, isPending:fetchShowsPending, isError: fetchShowsIsError, error:fetchShowsError} = useQuery({
        queryKey:['shows', props.id, currPage],
        queryFn:({signal}) => {
            return getShowsRequest({
                url:`/${props.id}`,
                data:{
                    page:currPage,
                    limit
                },
                signal,
                headers:{
                    'Authorization' : 'Bearer ' + auth.token
                }
            });
        }
    });

    return (
        <>
            <AnimatePresence>
                {
                    showForm && 
                    <ShowForm 
                        key="new-show-form" 
                        onClose={toggleShowForm}  
                        theatreId={props.id} 
                        theatre={data.theatre.name} 
                    />
                }
            </AnimatePresence>

            {
                (isPending || fetchShowsPending) && 
                <Loading />
            }
            <div className={styles['theatre-container']} >
                {
                    !isPending && !isError && data && 
                    <div className={styles['theatre-details']} >
                        <h2>{data.theatre.name}</h2>
                        <p><FaLocationDot className={styles['location-icon']} /> {data.theatre.address}</p>
                        <p><FaPhoneAlt className={styles['phone-icon']} /> {data.theatre.phone}</p>
                        {
                            auth.userId !== data.theatre.owner._id && 
                            <p>Owned by <span>{data.theatre.owner.name}</span></p>
                        }
                        {
                            (data.theatre.owner._id === auth.userId) && 
                            <Button 
                                type="button" 
                                className={styles['add-show-btn']} 
                                onClick={toggleShowForm} 
                            >
                                Add Show <MdOutlineMovieFilter className={styles['show-icon']} />
                            </Button>
                        }
                    </div>
                }
                {
                    isError && <Error message={error.message} marginTop="4rem" />
                }
                <div className={styles['theatre-shows']} >
                    {
                        fetchShowsIsError && 
                        <Error message={fetchShowsError.message} marginTop="2rem" />
                    }
                    {
                        !fetchShowsIsError && !fetchShowsPending && fetchedShows && fetchedShows.shows.length > 0 && 
                        <>
                            <ShowList shows={fetchedShows.shows} />
                            <Pagination 
                                currPage={currPage} 
                                lastPage={fetchedShows.totalPages} 
                                pageChangeHandler={pageChangeHandler} 
                            />
                        </>
                    }
                    {
                        !fetchShowsIsError && !fetchShowsPending && (!fetchedShows || fetchedShows.shows.length === 0) && 
                        <div className={styles['fallback-text']} >
                            <p>No shows found for this theatre!</p>
                        </div>
                    }
                    {
                        auth.userRole !== 'admin' && !fetchShowsIsError && !fetchShowsPending && 
                        <div className={styles['note-text']} >
                            <p>
                                <MdOutlineLabelImportant className={styles['note-icon']} /> If your shows are missing, admin might have deleted them.
                            </p>
                        </div>
                    }
                </div>
            </div>
        </>
    );
}

export default SingleTheatre;