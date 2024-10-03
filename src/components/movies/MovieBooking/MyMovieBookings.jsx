import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import styles from './MyMovieBookings.module.css';

import MyMovieBookingItem from './MyMovieBookingsItem';

import Button from '../../UI/Button/Button';
import Loading from '../../UI/Loading/Loading';
import Error from '../../UI/Error/Error';

import { useAuthContext } from '../../../store/authContext';

import { getBookingsRequest } from '../../../util/http/bookingHttp';

const limit = 20;

const MyMovieBookings = (props) => {

    const auth = useAuthContext();

    const [upcoming, setUpcoming] = useState(true);

    const upcomingMoviesHandler = () => {
        setUpcoming(true);
    }

    const historyMoviesHandler = () => {
        setUpcoming(false);
    }

    const {data, isPending, isError, error} = useQuery({
        queryKey:['my-bookings', {status: upcoming}],
        queryFn:({signal}) => {
            return getBookingsRequest({
                url: '/',
                signal,
                data:{
                    upcoming : upcoming,
                    limit
                },
                headers:{
                    'Authorization': 'Bearer ' + auth.token
                }
            });
        }
    });

    let upcomingBtnClasses = styles['upcoming-btn'];

    if(upcoming){
        upcomingBtnClasses += ' ' + styles['selected'];
    }

    let historyBtnClasses = styles['history-btn'];
    
    if(!upcoming){
        historyBtnClasses += ' ' + styles['selected'];
    }

    return (
        <>
            {
                isPending && <Loading />
            }
            <div className={styles['bookings-container']} >
                <div className={styles['bookings-header']} >
                    <Button 
                        key="upcoming-btn"
                        type="button" 
                        className={upcomingBtnClasses} 
                        onClick={upcomingMoviesHandler} 
                    >
                        Upcoming
                    </Button>
                    <Button 
                        key="history-btn" 
                        type="button" 
                        className={historyBtnClasses} 
                        onClick={historyMoviesHandler} 
                    >
                        History
                    </Button>
                </div>
                <div className={styles['breaker']} />
                {
                    !isPending && !isError && data && data.bookings.length > 0 && 
                    <ul className={styles['bookings-list']} >
                        {
                            data.bookings.map((booking) => {
                                return (
                                    <MyMovieBookingItem key={booking._id} booking={booking} upcoming={upcoming} />
                                );
                            })
                        }
                    </ul>
                }
                {
                    !isPending && !isError && data && data.bookings.length === 0 && 
                    <div className={styles['fallback-text']} >
                        {
                            upcoming && 
                            <p>No upcoming bookings!</p>
                        }
                        {
                            !upcoming && 
                            <p>No history found!</p>
                        }
                    </div>
                }
                {
                    isError && <Error message={error.message} />
                }
            </div>
        </>
    );
}

export default MyMovieBookings;