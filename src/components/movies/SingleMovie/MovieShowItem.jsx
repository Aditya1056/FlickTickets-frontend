import { useNavigate } from 'react-router-dom';

import styles from './MovieShowItem.module.css';

import Button from '../../UI/Button/Button';

import { getTime } from '../../../util/helpers/formatDate';

const MovieShowItem = (props) => {

    const navigate = useNavigate();

    const show = props.show;

    const showStartTime = getTime(new Date(show.start));

    const quarterFill = (Number(show.totalSeats)) / 4;

    const halfFill = (Number(show.totalSeats)) / 2;

    let showTimeClasses = styles['show-time'];

    if(show.bookedSeats.length === show.totalSeats){
        showTimeClasses += ' ' + styles['filled'];
    }
    else if(show.bookedSeats.length >= halfFill){
        showTimeClasses += ' ' + styles['.fast-filling'];
    }
    else if(show.bookedSeats.length >= quarterFill){
        showTimeClasses += ' ' + styles['filling'];
    }

    const movieShowHandler = () => {
        return navigate(`/movie-show/${show._id}`);
    }

    return  (
        <li className={styles['movie-show-item']} >
            <Button 
                type="button" 
                className={showTimeClasses} 
                disabled={show.bookedSeats.length === show.totalSeats} 
                onClick={movieShowHandler} 
            >
                {showStartTime}
            </Button>
        </li>
    );
}

export default MovieShowItem;