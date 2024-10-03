import { useState, useCallback, useEffect } from "react";

const useAuth = () => {

    const [token, setToken] = useState(null);
    const [expiration, setExpiration] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userAge, setUserAge] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userImage, setUserImage] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [theatreRequests, setTheatreRequests] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = useCallback((userToken, expirationTime, id, name, email, role, image, requests, age) => {

        const expirationDate = new Date(new Date().getTime() + expirationTime);

        setToken(userToken);
        setUserId(id);
        setUserEmail(email);
        setUserName(name);
        setUserAge(age);
        setUserImage(image);
        setUserRole(role);
        setTheatreRequests(requests);
        setExpiration(expirationDate);
        localStorage.setItem('userData', JSON.stringify({
            token:userToken,
            expiration : expirationDate.toISOString(),
            userId:id,
            userEmail:email,
            userAge:age,
            userName:name,
            userImage:image,
            userRole:role,
            theatreRequests:requests
        }));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setUserEmail(null);
        setUserName(null);
        setUserAge(null);
        setExpiration(null);
        setUserImage(null);
        setUserRole(null);
        setTheatreRequests(null);
        localStorage.removeItem('userData');
    }, []);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if(userData && userData.token && new Date() < new Date(userData.expiration)){
            const remainingTime = new Date(userData.expiration).getTime() - new Date().getTime();
            login(userData.token, remainingTime, userData.userId, userData.userName, userData.userEmail, userData.userRole, userData.userImage, userData.theatreRequests, userData.userAge);
        }
        setIsLoading(false);
    }, [login]);

    const changeUserImage = useCallback((image) => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if(storedData){
            storedData.userImage = image;
            localStorage.setItem('userData', JSON.stringify(storedData));
            setUserImage(image);
        }
      }, []);

    const changeTheatreRequests = useCallback((count) => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if(storedData){
            storedData.theatreRequests = count;
            localStorage.setItem('userData', JSON.stringify(storedData));
            setTheatreRequests(count);
        }
      }, []);

    useEffect(() => {
        let logoutTimer;

        if(token && expiration){
            const remainingTime = expiration.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        }
        else{
            clearTimeout(logoutTimer);
        }

        return () => {
            clearTimeout(logoutTimer);
        }
    }, [token, expiration, logout]);

    return {
        token,
        userId,
        userEmail,
        userAge,
        userName,
        userImage,
        userRole,
        login,
        logout,
        theatreRequests,
        changeUserImage,
        changeTheatreRequests,
        isLoading
    };
}

export default useAuth;