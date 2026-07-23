import { apiClient } from '../axios.js'


export async function getDataSets() {
    try {

        const response = await apiClient.get('/datasets/scan');

        console.log(response.data.data);

        return response?.data?.data;

    }
    catch (error) {
        console.log('[error] : fetching dataSets', error.message);
        throw error;
    }

}