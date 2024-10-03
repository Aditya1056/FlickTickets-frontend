import AuthContext from "../../../store/authContext";

import useAuth from '../../../hooks/useAuth';

const AuthContextProvider = (props) => {

    const { token, userName, userAge, userEmail, userId, userImage, userRole, theatreRequests, changeTheatreRequests, login, logout, changeUserImage, isLoading } = useAuth();

    return (
        <AuthContext.Provider 
            value={{
                loggedIn: !!token,
                token, 
                userName, 
                userAge, 
                userEmail, 
                userId, 
                userImage,
                userRole,
                theatreRequests,
                changeTheatreRequests,
                login, 
                logout,
                changeUserImage,
                isLoading
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;