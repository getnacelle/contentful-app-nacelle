import React, { Component } from 'react'
import { Button, Workbench } from '@contentful/forma-36-react-components'
import { BaseAppSDK } from 'contentful-ui-extensions-sdk'
import NacelleReferences from './NacelleReferences/NacelleReferences'

interface PageProps {
  sdk: BaseAppSDK
}

interface PageState {}

class Page extends Component<PageProps, PageState> {
  state = {}

  constructor(props: PageProps) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <Workbench>
        <Workbench.Header
          title={'Nacelle References'}
          description="fields that reference outside entities, such as commerce data."
          actions={<Button buttonType="muted">New Reference</Button>}
        />
        <Workbench.Content className="workbench">
          <NacelleReferences sdk={this.props.sdk} />
        </Workbench.Content>
      </Workbench>
    )
  }
}

export default Page
