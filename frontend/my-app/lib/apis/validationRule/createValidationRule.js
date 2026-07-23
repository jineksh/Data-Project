import { apiClient } from '../axios.js'


export async function createValidationRule(payload) {

    try {
        const response = await apiClient.post('/rules/batch', payload);

        return response.data.data;
    }
    catch (error) {
        console.log('[error] : create validation Rule', error.message);

        throw error;
    }


}