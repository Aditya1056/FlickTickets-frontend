import styles from './MovieList.module.css';

import MovieItem from './MovieItem';

const MovieList = (props) => {

    const movies = props.movies;

    return (
        <div className={styles['movie-list-container']} >
            <ul className={styles['movies-list']} >
                {
                    movies.map((movie) => {
                        return (
                            <MovieItem 
                                key= {movie._id} 
                                id = {movie._id} 
                                title={movie.title} 
                                description={movie.description} 
                                duration={movie.duration} 
                                releaseDate={movie.releaseDate} 
                                genres={movie.genres} 
                                languages={movie.languages} 
                                certificate={movie.certificate} 
                                poster={movie.poster.url}  
                            />
                        );
                    })
                }
            </ul>
        </div>
    );
}

export default MovieList;