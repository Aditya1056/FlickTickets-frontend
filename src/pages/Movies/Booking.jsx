import { useParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';

import MovieBooking from "../../components/movies/MovieBooking/MovieBooking";

import Loading from "../../components/UI/Loading/Loading";
import Error from "../../components/UI/Error/Error";

import { useAuthContext } from "../../store/authContext";

import { getShowsRequest } from "../../util/http/showsHttp";

const Booking = (props) => {

    const params = useParams();

    const auth = useAuthContext();

    const showId = params.showId;

    const {data, isPending, isError, error} = useQuery({
        queryKey:['show', showId],
        queryFn:({signal}) => {
            return getShowsRequest({
                url:`/show/${showId}`,
                signal,
                headers:{
                    'Authorization':'Bearer ' + auth.token
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
                isError && <Error message={error.message} marginTop="5rem" />
            }
            {
                !isPending && !isError && data && data.show && 
                <MovieBooking show={data.show} />
            }
        </>
    );
}

export default Booking;