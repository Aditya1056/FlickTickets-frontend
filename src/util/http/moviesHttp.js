import axios from "axios";

const axiosMoviesService = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL + '/movies'
});

export const getMoviesRequest = async ({signal, url, data={},  headers ={}}) => {

    try{
        const response = await axiosMoviesService.get(url, {
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

export const httpMoviesRequest = async ({url, method, data, headers}) => {

    try{
        const response = await axiosMoviesService({
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