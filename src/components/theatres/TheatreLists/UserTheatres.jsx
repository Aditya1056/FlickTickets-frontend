import { useState } from "react";

import { AnimatePresence } from "framer-motion";
import { useQuery } from '@tanstack/react-query';

import { TbTheater } from "react-icons/tb";
import { MdOutlineLabelImportant } from "react-icons/md";

import styles from './UserTheatres.module.css';

import TheatresList from "./TheatresList";
import TheatreForm from "../TheatreForms/TheatreForm";

import Button from '../../UI/Button/Button';
import Loading from "../../UI/Loading/Loading";
import Error from "../../UI/Error/Error";

import { useAuthContext } from "../../../store/authContext";

import { getTheatresRequest } from '../../../util/http/theatresHttp';

const UserTheatres = (props) => {

    const auth = useAuthContext();

    const [showTheatreForm, setShowTheatreForm] = useState(false);

    const toggleTheatreForm = () => {
        setShowTheatreForm((prev) => !prev);
    }

    const {data, isError, error, isPending} = useQuery({
        queryKey:['user-theatres'],
        queryFn:({signal}) => {
            return getTheatresRequest({
                url: `/user/${auth.userId}`,
                headers:{
                    'Authorization' : 'Bearer ' + auth.token
                },
                signal
            });
        }
    });

    return (
        <>
            <AnimatePresence>
                {
                    showTheatreForm && <TheatreForm onClose={toggleTheatreForm} />
                }
            </AnimatePresence>
            {
                isPending && <Loading />
            }
            <div className={styles['my-theatres']} >
                <div className={styles['my-theatres-header']} >
                    {
                        auth.userRole !== 'user' && 
                        <Button 
                            className={styles['add-theatre-btn']} 
                            onClick={toggleTheatreForm} 
                        >
                            Add Theatre <TbTheater className={styles['theatre-icon']} />
                        </Button>
                    }
                </div>
                <div className={styles['my-theatre-list']} >
                    {
                        !isPending && !isError && data && (
                            <>
                                {
                                    data.theatres.length === 0 && 
                                    <div className={styles['fallback-text']} >
                                        <p>No Theatres Found!</p>
                                    </div>
                                }
                                {
                                    data.theatres.length > 0 && 
                                    <TheatresList theatres={data.theatres} userTheatres />
                                }
                            </>
                        )
                    }
                    {
                        isError && <Error marginTop="3rem" message={error.message} />
                    }
                </div>
                {
                    auth.userRole !== 'admin' && 
                    <div className={styles['note-text']} >
                        <p>
                            <MdOutlineLabelImportant className={styles['note-icon']} /> If your theatres/requests are missing, admin might have deleted/declined them.
                        </p>
                    </div>
                }
            </div>
        </>
    );
}

export default UserTheatres;