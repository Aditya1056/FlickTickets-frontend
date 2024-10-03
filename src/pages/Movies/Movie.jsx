import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import SingleMovie from "../../components/movies/SingleMovie/SingleMovie";

import Error from "../../components/UI/Error/Error";
import Loading from "../../components/UI/Loading/Loading";

import { useAuthContext } from "../../store/authContext";

import { getMoviesRequest } from "../../util/http/moviesHttp";

const Movie = (props) => {

    const params = useParams();

    const auth = useAuthContext();

    const movieId = params.movieId;

    const {data, isPending, isError, error} = useQuery({
        queryKey:['movie', movieId],
        queryFn:({signal}) => {
            return getMoviesRequest({
                url:`/${movieId}`,
                signal,
                headers:{
                    'Authorization': 'Bearer ' + auth.token
                }
            });
        }
    });

    return (
        <>
            {
                isPending && <Loading />
            }
            {
                isError && <Error message={error.message || 'Movie is not available'} marginTop="4rem" />
            }
            {
                !isError && !isPending && data && 
                <SingleMovie movie={data.movie} />
            }
        </>
    );
}

export default Movie;