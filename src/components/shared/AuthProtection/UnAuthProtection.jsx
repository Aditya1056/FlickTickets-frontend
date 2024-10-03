import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../../store/authContext";

import Loading from "../../UI/Loading/Loading";

const UnAuthProtection = (props) => {

    const auth = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if(!auth.isLoading && auth.loggedIn){
            navigate("/movies");
        }
    }, [auth.loggedIn, auth.isLoading]);

    return (
        <>
            {
                auth.isLoading && <Loading />
            }
            {
                !auth.isLoading &&  props.element
            }
        </>
    );
}

export default UnAuthProtection;