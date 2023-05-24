import React from 'react'
import { Spinner } from '@contentful/f36-components'
import { css } from 'emotion'

const Loading = () => {
  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '100px'
      })}
    >
      <Spinner size="large" />
    </div>
  )
}

export default Loading
