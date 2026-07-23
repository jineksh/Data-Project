'use client'
import { getDataSets } from '../../../lib/apis/datasets/getDataSet.js'
import { useQuery } from '@tanstack/react-query'


export function useGetDataSet() {

    const { data, isError, isPending } = useQuery({
        queryKey: ['datasets'],
        queryFn: getDataSets
    });

    return {
        data,
        isError,
        isPending
    }

}