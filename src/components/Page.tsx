import React, { Component } from 'react';
import { Button, Card, Icon,  Paragraph,  Workbench } from '@contentful/forma-36-react-components';
import { PageExtensionSDK } from 'contentful-ui-extensions-sdk';

interface PageProps {
  sdk: PageExtensionSDK;
}

interface PageState {}

class Page extends Component<PageProps, PageState> {
  state = {
  }

  constructor(props: PageProps) {
    super(props)

    this.state = {}
  }

  async componentDidMount() {
    console.log('sdk', this.props.sdk)
    // Get Space Data
  }

  render() {
    return (
      <Workbench
      >
      <Workbench.Header
        title={'Nacelle'}
        description="Lorem Ipsum dolor sit amet."
        icon={<Icon icon="ArrowDown" />}
        actions={<Button buttonType="muted">Click</Button>}
      />
      <Workbench.Content>
        <Card>
          <Paragraph>
            Hello Page Component
          </Paragraph>
        </Card>
      </Workbench.Content>
    </Workbench>
    )
  }
}

export default Page;
