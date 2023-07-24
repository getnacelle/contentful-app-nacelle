import React from 'react'
import { Paragraph } from '@contentful/f36-components'
import { EditorAppSDK } from 'contentful-ui-extensions-sdk'

interface EditorProps {
  sdk: EditorAppSDK
}

const Entry = (props: EditorProps) => {
  return <Paragraph>Hello Entry Editor Component</Paragraph>
}

export default Entry
