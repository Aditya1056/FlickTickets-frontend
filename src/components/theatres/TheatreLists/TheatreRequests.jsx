import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';

import styles from './TheatreRequests.module.css';

import TheatresList from './TheatresList';

import Loading from '../../UI/Loading/Loading';
import Error from '../../UI/Error/Error';

import { useAuthContext } from '../../../store/authContext';

import { getTheatresRequest } from '../../../util/http/theatresHttp';

const TheatreRequests = (props) => {

    const auth = useAuthContext();

    const {data, isError, isPending, error} = useQuery({
        queryKey:['theatre-requests'],
        queryFn:({signal}) => {
            return getTheatresRequest({
                signal,
                url:'/requests',
                headers:{
                    'Authorization':'Bearer ' + auth.token
                }
            });
        }
    });

    useEffect(() => {
        if(data && data.theatres.length !== auth.theatreRequests){
            auth.changeTheatreRequests(data.theatres.length);
        }
    }, [data]);

    return (
        <>
        {
            isPending && <Loading />
        }
        {
            (!isPending && !isError && data) && 
            <div className={styles['theatre-requests']} >
                {
                    data.theatres.length > 0 && 
                    <TheatresList theatres={data.theatres} requests />
                }
                {
                    data.theatres.length === 0 && 
                    <div className={styles['fallback-text']} >
                        <p>No Requests Found!</p>
                    </div>
                }
            </div>
        }
        {
            (!isPending && isError) && 
            <Error message={error.message} marginTop="5rem" />
        }
        </>
    );
}

export default TheatreRequests;