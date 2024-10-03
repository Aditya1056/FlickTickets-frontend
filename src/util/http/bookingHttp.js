import axios from "axios";

const axiosBookingsService = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL + '/bookings'
});

export const getBookingsRequest = async ({signal, url, data={},  headers ={}}) => {

    try{
        const response = await axiosBookingsService.get(url, {
            headers,
            signal,
            params:data
        });
    
        return response.data.data;
    }
    catch(err){
        throw new Error(err.response.data.message || "Something went wrong!");
    }
}

export const httpBookingsRequest = async ({url, method, data, headers}) => {

    try{
        const response = await axiosBookingsService({
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