import moment from 'moment';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';

import { MdOutlineAccessTime } from "react-icons/md";
import { BiCertification } from "react-icons/bi";

import styles from './SingleMovie.module.css';

import MovieCalendar from './MovieCalendar';
import MovieAvailableLanguages from './MovieAvailableLanguages';
import MovieShows from './MovieShows';

import Loading from '../../UI/Loading/Loading';
import Error from '../../UI/Error/Error';

import { useAuthContext } from '../../../store/authContext';
import { useToastContext } from '../../../store/toastContext';

import { getShowsRequest } from '../../../util/http/showsHttp';

const SingleMovie = (props) => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const auth = useAuthContext();
    const toast = useToastContext();

    const movie = props.movie;

    let selectedDate = searchParams.get('date');

    selectedDate = moment(new Date(selectedDate)).format('YYYY-MM-DD');

    const selectedLanguage = searchParams.get('language');

    let genresList = "";

    for(let genre of movie.genres){
        genresList = genresList + ", " + genre;
    }

    genresList = genresList.substring(2);

    const {data, isPending, isError, error} = useQuery({
        queryKey:['movie', movie._id, selectedDate, selectedLanguage],
        queryFn:({signal}) => {
            return getShowsRequest({
                url: `/movie/${movie._id}/${selectedDate}/${selectedLanguage}`,
                signal,
                headers:{
                    'Authorization': 'Bearer ' + auth.token
                }
            });
        }
    });

    const dateChangeHandler = (value) => {
        return navigate(`/movie/${movie._id}?language=${selectedLanguage}&date=${value}`);
    }

    const languageChangeHandler = (value) => {
        return navigate(`/movie/${movie._id}?language=${value}&date=${new Date(selectedDate)}`);
    }

    return (
        <>
            {
                isPending && <Loading />
            }
            <div className={styles['movie-container']} >
                <div className={styles['movie-poster']} >
                    <img src={movie.poster.url} alt={movie.title}/> 
                </div>
                <div className={styles['movie-info']} >
                    <h3>{movie.title}</h3>
                    <p className={styles['movie-description']} >{movie.description}</p>
                    <p className={styles['movie-duration']} ><span><MdOutlineAccessTime className={styles['time-icon']} />Duration:</span> {movie.duration} minutes</p>
                    <p className={styles['movie-certificate']} ><span><BiCertification className={styles['certificate-icon']} />Certification:</span> {movie.certificate}</p>
                    <p className={styles['movie-genres']} ><span>Genres:</span> {genresList}</p>
                    <p className={styles['movie-release-date']} ><span>Release Date:</span> {moment(new Date(movie.releaseDate)).format('Do MMM YYYY')}</p>
                </div>
                <div className={styles['breaker']} />
                <div className={styles['movie-shows-container']} >
                    {
                        isError && <Error message={error.message || 'Something went wrong!'} />
                    }
                    {
                        !isPending && !isError && data && 
                        <>
                            <MovieCalendar 
                                selectedDate={selectedDate} 
                                dateChangeHandler={dateChangeHandler} 
                            />
                            <MovieAvailableLanguages 
                                languages={movie.languages} 
                                selectedLanguage={selectedLanguage} 
                                languageChangeHandler={languageChangeHandler} 
                            />
                            {
                                Object.keys(data.shows).length > 0 && 
                                <MovieShows shows={data.shows} />
                            }
                            {
                                Object.keys(data.shows).length === 0 && 
                                <div className={styles['fallback-text']} >
                                    <p>No shows available on this date!</p>
                                </div>
                            }
                        </>
                    }
                </div>
            </div>
        </>
    );
}

export default SingleMovie;