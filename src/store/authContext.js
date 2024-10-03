import React, { useContext } from "react";

const AuthContext = React.createContext({
    loggedIn:false,
    token:null,
    userId:null,
    userEmail:null,
    userAge:null,
    userName:null,
    userImage:null,
    userRole:null,
    theatreRequests:null,
    changeTheatreRequests:() => {},
    login:() => {},
    logout:() => {},
    changeUserImage:() => {},
    isLoading:false
});

export const useAuthContext = () => {
    return useContext(AuthContext);
}

export default AuthContext;