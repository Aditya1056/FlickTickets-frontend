import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import styles from './TheatreListContainer.module.css';

import TheatresList from './TheatresList';

import Pagination from '../../shared/Pagination/Pagination';

import Loading from '../../UI/Loading/Loading';
import Error from '../../UI/Error/Error';

import { useAuthContext } from '../../../store/authContext';

import { getTheatresRequest } from '../../../util/http/theatresHttp';

const limit = 10;

const TheatreListContainer = (props) => {

    const auth = useAuthContext();

    const navigate = useNavigate();

    const [ searchParams ] = useSearchParams();

    let page = searchParams.get('page');

    let currPage = page ? Number(page) : 1;

    const pageChangeHandler = (page) => {
        navigate(`/theatres?page=${page}`);
    }

    const { data, error, isLoading, isError } = useQuery({
        queryKey:['theatres-list', page],
        queryFn:({signal}) => {
            return getTheatresRequest({
                signal,
                url:'/',
                data:{
                    page: currPage,
                    limit
                },
                headers:{
                    'Authorization':'Bearer ' + auth.token
                }
            });
        },
    });

    return (
        <>
            {
                isLoading && <Loading />
            }
            {
                !isLoading && !isError && data && 
                <>
                    <div className={styles['theatre-list-container']} >
                        {
                            data.theatres.length > 0 && 
                            <>
                                <TheatresList theatres={data.theatres} allTheatres />
                                <Pagination 
                                    currPage={currPage} 
                                    lastPage={data.totalPages} 
                                    pageChangeHandler={pageChangeHandler} 
                                />
                            </>
                        }
                        {
                            data.theatres.length === 0 && 
                            <p className={styles['fallback-text']} >No Theatres Found!</p>
                        }
                    </div>
                </>
            }
            {
                isError && <Error message={error.message} marginTop={"5rem"} />
            }
        </>
    );
}

export default TheatreListContainer;