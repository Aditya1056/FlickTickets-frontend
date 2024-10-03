import { TiLocation } from "react-icons/ti";

import styles from './MovieShows.module.css';

import MovieShowList from './MovieShowList';

const MovieShows = (props) => {

    const shows = props.shows;

    let count = 0;

    return (
        <div className={styles['movie-shows-info']} >
            <div className={styles['movie-shows']} >
                {
                    Object.keys(shows).map((key) => {

                        count++;

                        return (
                            <div key={`${shows[key].theatre._id}showscover`} className={styles['theatre-shows-container']} >
                                <div key={shows[key].theatre._id} className={styles['theatre-shows']} >
                                    <div className={styles['theatre-info']} >
                                        <h4>{shows[key].theatre.name}</h4>
                                        <p><TiLocation className={styles['location-icon']} /> {shows[key].theatre.address}</p>
                                    </div>
                                    <MovieShowList key={`${shows[key].theatre._id}showslist`} showList={shows[key].showList} />
                                </div>
                                {
                                    count < Object.keys(shows).length && 
                                    <div className={styles['breaker']} key={count} />
                                }
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default MovieShows;