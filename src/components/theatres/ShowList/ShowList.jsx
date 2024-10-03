import styles from './ShowList.module.css';

import ShowItem from './ShowItem';

const ShowList = (props) => {

    const shows = props.shows;

    return (
        <ul className={styles['shows-list']} >
            <li key="headings" className={styles['show-item-header']} >
                <div className={styles['date-heading']} >
                    <h5>Date</h5>
                </div>
                <div className={styles['movie-heading']} >
                    <h5>Movie</h5>
                </div>
                <div className={styles['language-heading']} >
                    <h5>Language</h5>
                </div>
                <div className={styles['start-time-heading']} >
                    <h5>Start Time</h5>
                </div>
                <div className={styles['end-time-heading']} >
                    <h5>End Time</h5>
                </div>
                <div className={styles['ticket-price-heading']} >
                    <h5>Ticket Price</h5>
                </div>
                <div className={styles['total-seats-heading']} >
                    <h5>Total Seats</h5>
                </div>
                <div className={styles['booked-seats-heading']} >
                    <h5>Booked Seats</h5>
                </div>
                <div className={styles['actions-heading']} >
                    <h5>Actions</h5>
                </div>
            </li>
            {
                shows.map((show) => { 
                    return (
                        <ShowItem 
                            key={show._id} 
                            id={show._id} 
                            movie={show.movie} 
                            theatre={show.theatre} 
                            start={show.start} 
                            end={show.end} 
                            language={show.language} 
                            ticketPrice={show.ticketPrice} 
                            totalSeats={show.totalSeats} 
                            bookedSeats={show.bookedSeats.length}
                        />
                    );
                })
            }
        </ul>
    );
}

export default ShowList;