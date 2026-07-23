'use client'

import React from 'react'
import DataSetList from '../componet/dashboard-components/DatasetList.jsx'
import { useGetDataSet } from '../../hooks/apis/dataset/useGetDataSet.js'

const page = () => {

  const { data, isError, isPending } = useGetDataSet();



  return (
    <div>

      <DataSetList datasets={data} />

    </div>
  )
}

export default page
