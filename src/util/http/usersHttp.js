import axios from "axios";

const axiosUsersService = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL + '/users'
});

export const getUsersRequest = async ({signal, url, headers ={}}) => {

    try{
        const response = await axiosUsersService.get(url, {
            headers,
            signal
        });
    
        return response.data.data;
    }
    catch(err){
        throw new Error(err.response.data.message || "Something went wrong!");
    }
}

export const httpUsersRequest = async ({url, method, data, headers}) => {

    try{
        const response = await axiosUsersService({
            url,
            method,
            data,
            headers
        });
        
        return response.data;
    }
    catch(err){
        throw new Error(err.response.data.message || "Something went wrong!");
    }
}