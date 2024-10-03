import axios from "axios";

const axiosShowsService = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL + '/shows'
});

export const getShowsRequest = async ({signal, url, data={},  headers ={}}) => {

    try{
        const response = await axiosShowsService.get(url, {
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

export const httpShowsRequest = async ({url, method, data, headers}) => {

    try{
        const response = await axiosShowsService({
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