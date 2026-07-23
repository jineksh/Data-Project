'use client'

import { getDataSetById } from '../../../lib/apis/datasets/getDataSetById.js'
import { useQuery } from '@tanstack/react-query'


export function useGetDataSetById(id) {


    const { data, isError, isPending, error } = useQuery({
        queryKey: ['datasets', id],
        queryFn: () => getDataSetById(id),
        enabled: Boolean(id)
    });

    return {
        data,
        isError,
        isPending,
        error
    }

}