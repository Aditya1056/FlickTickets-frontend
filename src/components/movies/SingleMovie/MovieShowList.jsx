import styles from './MovieShowList.module.css';

import MovieShowItem from './MovieShowItem';

const MovieShowList = (props) => {

    const shows = props.showList;

    return (
        <ul className={styles['movie-show-list']} >
            {
                shows.map((show, index) => {

                    return (
                        <MovieShowItem key={show._id} show={show} />
                    );
                })
            }
        </ul>
    );
}

export default MovieShowList;