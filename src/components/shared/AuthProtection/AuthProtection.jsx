import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../../store/authContext";

import Loading from "../../UI/Loading/Loading";

const AuthProtection = (props) => {

    const auth = useAuthContext();
    const navigate = useNavigate();

    const Component = props.element;

    useEffect(() => {
        if(!auth.isLoading && !auth.loggedIn){
            navigate('/');
        }
    }, [auth.loggedIn, auth.isLoading]);

    return (
        <>
            {
                auth.isLoading && <Loading />
            }
            {
                !auth.isLoading &&  Component
            }
        </>
    );
}

export default AuthProtection;