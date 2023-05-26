import React from 'react';
import { Paragraph } from '@contentful/forma-36-react-components';
import { EditorAppSDK } from 'contentful-ui-extensions-sdk';

interface EditorProps {
  sdk: EditorAppSDK;
}

const Entry = (props: EditorProps) => {
  return <Paragraph>Hello Entry Editor Component</Paragraph>;
};

export default Entry;
