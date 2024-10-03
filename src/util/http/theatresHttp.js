import axios from "axios";

const axiosTheatresService = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL + '/theatres'
});

export const getTheatresRequest = async ({signal, url, data={},  headers ={}}) => {

    try{
        const response = await axiosTheatresService.get(url, {
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

export const httpTheatresRequest = async ({url, method, data, headers}) => {

    try{
        const response = await axiosTheatresService({
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