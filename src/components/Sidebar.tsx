import React from 'react';
import { Paragraph } from '@contentful/forma-36-react-components';
import { SidebarExtensionSDK } from 'contentful-ui-extensions-sdk';

interface SidebarProps {
  sdk: SidebarExtensionSDK;
}

const Sidebar = (props: SidebarProps) => {
  console.log('sidebar activate!')
  // Make sure there's always enough of space to render the animal picture.
  // props.sdk.window.startAutoResizer();
  return <Paragraph>Hello Sidebar Component</Paragraph>;
};

export default Sidebar;
