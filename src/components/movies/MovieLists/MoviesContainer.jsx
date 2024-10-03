import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { HiViewGridAdd } from "react-icons/hi";

import styles from './MoviesContainer.module.css';

import MovieForm from '../MovieForms/MovieForm';
import MovieList from './MovieList';
import Pagination from '../../shared/Pagination/Pagination';

import Loading from '../../UI/Loading/Loading';
import Error from '../../UI/Error/Error';

import { useAuthContext } from '../../../store/authContext';

import { getMoviesRequest } from '../../../util/http/moviesHttp';

const limit = 5;

const MoviesContainer = (props) => {

    const auth = useAuthContext();

    const navigate = useNavigate();

    const [ searchParams ] = useSearchParams();

    let page = searchParams.get('page');

    let currPage = page ? Number(page) : 1;

    let moviesSearchClasses = styles['movies-search'];

    if(auth.userRole !== 'admin'){
        moviesSearchClasses += ' ' + styles['cover'];
    }

    const [searchInput, setSearchInput] = useState('');
    const [delayedSearchInput, setDelayedSearchInput] = useState('');
    const [openMovieForm, setOpenMovieForm] = useState(false);

    const handleSearchInput = (event) => {
        setSearchInput(event.target.value);
    }

    const toggleMovieForm = () => {
        setOpenMovieForm((prev) => !prev);
    }

    const pageChangeHandler = (page) => {
        navigate(`/movies?page=${page}`);
    }

    const { data, error, isLoading, isError } = useQuery({
        queryKey:['movies', page],
        queryFn:({signal}) => {
            return getMoviesRequest({
                signal,
                url:'/',
                data:{
                    page: currPage,
                    limit
                },
                headers:{
                    'Authorization':'Bearer ' + auth.token
                }
            });
        },
    });

    const { data:searchedData, error: searchError, isLoading: searchIsLoading, isError: searchIsError } = useQuery({
        queryKey:['search-movies', delayedSearchInput],
        queryFn:({signal}) => {
            return getMoviesRequest({
                signal,
                url:'/search',
                data:{
                    searchTerm: delayedSearchInput.trim().toLowerCase()
                },
                headers:{
                    'Authorization':'Bearer ' + auth.token
                }
            });
        },
        enabled: delayedSearchInput.trim().length !== 0
    });

    useEffect(() => {

        let timer = null;

        timer = setTimeout(() => {
            setDelayedSearchInput(searchInput);
        }, 500);

        return () => {
            clearTimeout(timer);
        }

    }, [searchInput]);

    return (
        <>
            <AnimatePresence>
                {   
                    openMovieForm && 
                    <MovieForm onClose={toggleMovieForm} key={"new-movie-form"} />
                }
            </AnimatePresence>
            {
                (isLoading || searchIsLoading) && <Loading />
            }
            {
                !isLoading && !isError && data && 
                <>
                    <div className={styles['movies-container']} >
                        <div className={styles['movies-header']} >
                            <div className={moviesSearchClasses} >
                                <input 
                                    type="text" 
                                    onChange={handleSearchInput} 
                                    value={searchInput} 
                                    placeholder='Search movies' 
                                    disabled={data.movies.length === 0} 
                                />
                            </div>

                            {
                                auth.userRole === "admin" && 
                                <div className={styles['new-movies']} >
                                    <button 
                                        type="button" 
                                        onClick={toggleMovieForm} 
                                        className={styles['movie-add-btn']}
                                    >
                                        Add Movie <HiViewGridAdd className={styles['add-icon']} />
                                    </button>
                                </div>
                            }
                        </div>
                        {
                            delayedSearchInput.trim().length === 0 && data.movies.length > 0 && 
                            <>
                                <MovieList movies={data.movies} />
                                <Pagination 
                                    currPage={currPage} 
                                    lastPage={data.totalPages} 
                                    pageChangeHandler={pageChangeHandler} 
                                />
                            </>
                        }
                        {
                            delayedSearchInput.trim().length > 0 && !searchIsLoading && !searchIsError && 
                            <MovieList movies={searchedData.movies} />
                        }
                        {
                            delayedSearchInput.trim().length === 0 && data.movies.length === 0  && 
                            <p className={styles['fallback-text']} >No Movies Found!</p>
                        }
                        {
                            delayedSearchInput.trim().length > 0 && !searchIsLoading && !searchIsError && searchedData.movies.length === 0  && 
                            <p className={styles['fallback-text']} >No Movies Found!</p>
                        }
                    </div>
                </>
            }
            {
                isError && <Error message={error.message} marginTop={"5rem"} />
            }
            {
                !isError && delayedSearchInput.trim().length > 0 && searchIsError && <Error message={searchError.message} marginTop={"5rem"} />
            }
        </>
    );
}

export default MoviesContainer;