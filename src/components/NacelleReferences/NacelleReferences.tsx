import React, { useEffect, useState } from 'react'
import { BaseExtensionSDK } from 'contentful-ui-extensions-sdk'
import Loading from './Loading'
import ReferenceTable, { ReferenceTableRow } from './ReferenceTable'
import getNacelleFields from '../../utils/getNacelleFields'

interface NacelleReferencesProps {
  sdk: BaseExtensionSDK
}

const NacelleReferences = (props: NacelleReferencesProps) => {
  const [data, setData] = useState<ReferenceTableRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cmaAdapter = props.sdk.cmaAdapter
    const appId = props.sdk.ids.app
    const spaceId = props.sdk.ids.space
    const envId = props.sdk.ids.environment

    getNacelleFields(cmaAdapter, appId, spaceId, envId)
      .then((res) => {
        setData(res)
        setLoading(false)
      })
      .catch((err) => {
        throw new Error(err)
      })
  }, [props.sdk])

  if (loading) {
    return <Loading />
  } else if (data && data.length) {
    return <ReferenceTable data={data} />
  } else {
    return <p>No data found</p>
  }
}

export default NacelleReferences
