import moment from 'moment';

import styles from './MyMovieBookingsItem.module.css';

import { getTime, getSeatNumber } from '../../../util/helpers/formatDate';

const MyMovieBookingItem = (props) => {

    const booking = props.booking;

    const bookedSeats = booking.bookedSeats;

    bookedSeats.sort((a, b) => {
        return a - b;
    });

    const totalSeats = booking.show.totalSeats;

    return (
        <li className={styles['booking-item']} >
            <div className={styles['movie-poster']} >
                <img src={booking.show.movie.poster.url} alt={"Poster"} />
            </div>
            <div className={styles['theatre-details']} >
                <div className={styles['theatre-details-header']} >
                    <h4 className={styles['movie-title']} >{booking.show.movie.title}</h4>
                    <p className={styles['show-time']} >{moment(new Date(booking.show.start)).format('Do MMM YYYY')}, {getTime(new Date(booking.show.start))}</p>
                </div>
                <div className={styles['theatre-info']}>
                    <h5 className={styles['theatre-name']}>{booking.show.theatre.name}</h5>
                    <p className={styles['theatre-address']} >{booking.show.theatre.address}</p>
                </div>
                <div className={styles['theatre-seats']} >
                    <span>Seats: </span>
                    {
                        bookedSeats.map((seat, index) => {
                            return (
                                <p key={index}>
                                    {getSeatNumber(totalSeats, seat)}{(index + 1) !== bookedSeats.length ? ',' : ''}
                                </p>
                            );
                        })
                    }
                </div>
            </div>
            <div className={styles['payment-details']} >
                <p className={styles['paid-amount']} >Paid: ₹ {booking.amount}</p>
                <div className={styles['transaction']} >
                    <p className={styles['transaction-id-heading']} >Transaction Id:</p>
                    <p className={styles['transaction-id']} >{booking.transactionId}</p>
                </div>
                <p className={styles['paid-date']} >Paid on: {moment(new Date(booking.createdAt)).format('Do MMM')}</p>
            </div>
        </li>
    );
} 

export default MyMovieBookingItem;