import { useState } from 'react';

import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import styles from './MovieBooking.module.css';

import Button from '../../UI/Button/Button';
import Loading from '../../UI/Loading/Loading';

import screen from '../../../assets/screen.png';

import { useAuthContext } from '../../../store/authContext';
import { useToastContext } from '../../../store/toastContext';

import queryClient from '../../../util/helpers/queryClient';
import { getTime } from '../../../util/helpers/formatDate';
import { httpBookingsRequest } from '../../../util/http/bookingHttp';

const MovieBooking = (props) => {

    const show = props.show;
    
    const navigate = useNavigate();

    const toast = useToastContext();
    const auth = useAuthContext();

    const [ selectedSeats, setSelectedSeats ] = useState([]);

    const toggleSeatSelectionHandler = (seat) => {
        
        if(!selectedSeats.includes(seat)){

            if(selectedSeats.length === 10){
                return toast.openToast('FAIL', 'Only 10 seats are permitted per booking!');
            }

            setSelectedSeats((prevSelectedSeats) => {
                const updatedSelectedSeats = [...prevSelectedSeats];
                updatedSelectedSeats.push(seat);
                return updatedSelectedSeats;
            });
        }
        else{
            setSelectedSeats((prevSelectedSeats) => {

                const updatedSelectedSeats = prevSelectedSeats.filter((selectedSeat) => {
                    return selectedSeat !== seat;
                });

                return updatedSelectedSeats;
            });
        }
    }

    const ticketPrice = show.ticketPrice;

    const totalSeats = show.totalSeats;

    const bookedSeats = show.bookedSeats;

    const cols = 20;

    const rows = Math.ceil((totalSeats / cols));

    const seats = Array.from({length: totalSeats}, (_, index) => index + 1);

    const IterateRows = Array.from({length: rows}, (_, index) => index + 1);

    const middleRow = Math.floor(rows / 2) + 1;

    const rowClasses = styles['seats-row'];

    const middleRowClasses = styles['seats-row'] + ' ' + styles['middle'];

    const { mutate: startPaymentMutate, isPending: startPaymentPending } = useMutation({
        mutationFn:httpBookingsRequest,
        onSuccess:({data, message}) => {
            makePaymentHandler(data.orderDetails.orderId, data.orderDetails.amount);
        },
        onError:(err) => {
            toast.openToast('FAIL', err.message);
        }
    });
    
    const {mutate: verifyPaymentMutate, isPending: verifyPaymentPending} = useMutation({
        mutationFn:httpBookingsRequest,
        onSuccess:({data, message}) => {
            setSelectedSeats([]);
            queryClient.invalidateQueries({queryKey: ['show', show._id]});
            queryClient.invalidateQueries({queryKey: ['my-bookings']});
            toast.openToast('SUCCESS', message);
            navigate('/bookings');
        },
        onError:(err) => {
            toast.openToast('FAIL', err.message);
        }
    });

    const startPaymentHandler = () => {

        const data = {
            showId: show._id,
            selectedSeats,
            amount: (ticketPrice * selectedSeats.length)
        }

        startPaymentMutate({
            url:'/payment',
            method:'POST',
            data,
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + auth.token
            }
        });
    }

    const verifyPaymentHandler = (response) => {

        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

        const data = {
            showId: show._id,
            selectedSeats,
            amount: (ticketPrice * selectedSeats.length),
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature
        }

        verifyPaymentMutate({
            url:'/verify-payment',
            method:'POST',
            data,
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + auth.token
            }
        });
    }

    const makePaymentHandler = (orderId, amount) => {

        const options = {
            key: import.meta.env.RAZORPAY_API_KEY,
            amount,
            currency: 'INR',
            name: `${show.movie.title} movie booking`,
            description: 'Test transaction for movie tickets booking',
            order_id: orderId,
            handler: verifyPaymentHandler,
            prefill: {
                name: auth.userName,
                email: auth.userEmail
            },
            theme: {
                color: '#384275'
            }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    }

    return (
        <>
            {
                (startPaymentPending || verifyPaymentPending) && <Loading />
            }
            <div className={styles['movie-booking']} >

                <div className={styles['booking-info']} >
                    <h4>{show.movie.title}</h4>
                    <p className={styles['movie-language']} >{show.language}</p>
                    <p className={styles['booking-date']} >{moment(new Date(show.start)).format('ddd, Do MMM')} - {getTime(new Date(show.start))}</p>
                </div>

                <p className={styles['ticket-price']}>Ticket price -  ₹ {ticketPrice}</p>

                <div className={styles['breaker']} />

                <div className={styles['seats-container']} >
                    <div className={styles['seats']} >
                        {
                            IterateRows.map((row, rowIndex) => {
                                return (
                                    <div key={`${row}row`} className={row === middleRow ? middleRowClasses : rowClasses} >
                                        <p>{String.fromCharCode(65 + (rows-row))}</p>
                                        {
                                            seats.slice(rowIndex * cols, ( rowIndex * cols) + cols).map((seat, index) => {

                                                let seatNumber = seat - (rowIndex*cols);

                                                let seatClasses = styles['seat'];

                                                if(seatNumber === 6 || seatNumber === 16){
                                                    seatClasses += ' ' + styles['break'];
                                                }

                                                if(bookedSeats.includes(seat)){
                                                    seatClasses += ' ' + styles['booked'];
                                                }
                                                else if(selectedSeats.includes(seat)){
                                                    seatClasses += ' ' + styles['selected'];
                                                }

                                                return (
                                                    <Button 
                                                        key={`${seat}seat`}
                                                        type="button" 
                                                        className={seatClasses} 
                                                        onClick={() => {toggleSeatSelectionHandler(seat)}} 
                                                        disabled={bookedSeats.includes(seat)}
                                                    >
                                                        {seatNumber}
                                                    </Button>
                                                );
                                            })
                                        }
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>

                <div className={styles['breaker']} />

                <div className={styles['screen']} >
                    <img src={screen} alt={"Screen"} />
                    <p>Screen is this way!</p>
                </div>
                
                <div className={styles['selected-seats-info']} >
                    <p className={styles['tickets-count']} >Tickets selected: {selectedSeats.length}</p>
                    <p className={styles['total-cost']} >Total Price - ₹ {ticketPrice * selectedSeats.length}</p>
                    
                    <Button 
                        type="button"
                        className={styles['checkout-btn']} 
                        onClick={startPaymentHandler} 
                        disabled={selectedSeats.length === 0} 
                    >
                        Proceed
                    </Button>
                </div>
            </div>
        </>
    );
}

export default MovieBooking;