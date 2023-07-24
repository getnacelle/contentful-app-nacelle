import React, { Component } from 'react'
import { Button } from '@contentful/f36-components'
import { Workbench } from '@contentful/f36-workbench'
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
          actions={<Button variant="primary">New Reference</Button>}
        />
        <Workbench.Content className="workbench">
          <NacelleReferences sdk={this.props.sdk} />
        </Workbench.Content>
      </Workbench>
    )
  }
}

export default Page
