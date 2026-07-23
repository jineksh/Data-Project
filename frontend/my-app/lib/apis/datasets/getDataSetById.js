import { apiClient } from '../axios.js'

export async function getDataSetById(id) {


    try {

        const response = await apiClient.get(`datasets/${id}`);

        return response?.data?.data;
    }
    catch (error) {
        console.log('[error] : fetching datasets by id', error.message);

        throw error;
    }

}