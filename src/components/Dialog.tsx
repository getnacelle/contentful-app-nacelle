import React, { Component } from 'react';
import { Button, Card, DropdownList, DropdownListItem, Heading, IconButton, Icon, Modal, EntityList, EntityListItem } from '@contentful/forma-36-react-components';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
import { AppInstallationParameters } from './ConfigScreen'
import { css } from 'emotion';
import logo from '../logo.svg';
import NacelleClient, { Collection, Product } from '@nacelle/client-js-sdk'

interface DialogProps {
  sdk: DialogExtensionSDK
}

interface DialogState {
  location: string
  contentType: string
  value: string
  publishedValue: string
  resource: any
  resourceLabel: string
  resources: any[]
  showJson: boolean
  selectedJson: string
  selectedIndex: number
}

export default class Dialog extends Component<DialogProps, DialogState> {

  constructor(props: DialogProps) {
    super(props)

    this.state = {
      location: '',
      contentType: '',
      value: '',
      publishedValue: '',
      resource: undefined,
      resourceLabel: '',
      resources: [],
      showJson: false,
      selectedJson: '',
      selectedIndex: 0,
    }
  }

  async componentDidMount() {
    const {
      nacelleSpaceId: id,
      nacelleSpaceToken: token
    } = this.props.sdk.parameters.installation as AppInstallationParameters
    const invocation = this.props.sdk.parameters.invocation as DialogState
    const { resourceLabel, value } = invocation

    const settings = {
      id,
      token,
      locale: 'en-us',
      nacelleEndpoint: 'https://hailfrequency.com/v2/graphql',
      useStatic: false
    }
    
    const client = new NacelleClient(settings)
    
    // Get resources from invocation
    let resources: any[]
    if (resourceLabel === 'Collection') {
      resources = await client.data.allCollections()
    } else if (resourceLabel === 'Product') {
      resources = await client.data.allProducts()
    } else {
      resources = await client.data.allProducts()
    }
    const resource = resources.find(r => value === r.handle)

    this.setState(state =>({
      ...invocation,
      publishedValue: value,
      resources,
      resource
    }))
  }

  onValueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('e',e.currentTarget.value)
    const value = e.currentTarget.value

    this.setState(state => ({
      value,
      resource: state.resources.find(r => value === r.handle)
    }));
  };

  updateResource = (value: string, index: number, callback?: () => void) => {
    this.setState(state => ({
      value,
      selectedIndex: index,
      resource: state.resources.find(r => value === r.handle)
    }), callback);
  };

  saveAndClose = (value: string, index: number) => {
    this.updateResource(value, index, () => {
      this.props.sdk.close({ dialogState: this.state })
    })
  }

  openModal = (value: string, index: number) => {
    this.setState(state => ({
      value,
      selectedIndex: index,
      resource: state.resources.find(r => value === r.handle),
      showJson: true
    }));
  }

  closeModal = () => {
    this.setState(state => ({
      showJson: false
    }));
  }

  render() {
    this.props.sdk.window.startAutoResizer()
    const resourceLabel = this.state.resourceLabel

    const resourceList = this.state.resources.map((r, i) => {
      let description
      if (resourceLabel === 'Collection') {
        description = 'Products: ' + r.productLists[0].handles
      } else {
        description = 'Tags: ' + r.tags
      }

      return (
        <React.Fragment key={ i }>
          <EntityListItem
            key={ i }
            thumbnailUrl={ r.featuredMedia?.thumbnailSrc }
            title={ r.title || 'Default Title' }
            description={ description }
            contentType={ r.handle }
            status={ this.state.publishedValue === r.handle ? 'published' : undefined }
            onClick={() => { this.updateResource(r.handle, i) }}
            dropdownListElements={
              <DropdownList testId="cf-ui-dropdown-list">
                <DropdownListItem isActive={false} isDisabled={false} isTitle testId="cf-ui-dropdown-list-item">Actions</DropdownListItem>
                <DropdownListItem
                  isActive={false}
                  isDisabled={false}
                  isTitle={false}
                  onClick={() => { this.openModal(r.handle, i) }}>
                  Show JSON
                </DropdownListItem>
                <DropdownListItem
                  isActive={false}
                  isDisabled={false}
                  isTitle={false}
                  onClick={() => { this.saveAndClose(r.handle, i) }}>
                  Link { resourceLabel }
                </DropdownListItem>
              </DropdownList>
            }
            entityType='asset'
          />
          <Card
            className={css({ display: i === this.state.selectedIndex && this.state.showJson ? 'block': 'none' })}
          >
            <pre>
              { this.state.resource && JSON.stringify(this.state.resource, null, 2) }
            </pre>

            <Button onClick={() => { this.props.sdk.close({ dialogState: this.state }) }} buttonType="positive">
              Link { resourceLabel }
            </Button>
            <Button onClick={this.closeModal} buttonType="muted">
              Close
            </Button>
          </Card>
        </React.Fragment>
      )
    })
    return (
      <div className={css({ minHeight: '500px', margin: '20px', overflow: 'scroll' })}> 
        <IconButton
          iconProps={{ icon: 'Close', size: 'small' }}
          buttonType="secondary"
          label="Entry actions"
          onClick={ () => { this.props.sdk.close({ dialogState: null }) } }
        />
        <Heading>Choose { resourceLabel }</Heading>
        <div>
          <div>
            <EntityList>
              { resourceList }
            </EntityList>
          </div>
          {/* <Modal
            title={ this.state.resource?.title + ' (JSON)' }
            size='large'
            position='top'
            allowHeightOverflow={ true }
            isShown={this.state.showJson}
            onClose={this.closeModal}
          >
            {({
              title,
              onClose,
            }: {
              title: string;
              onClose: () => void;
            }) => (
              <React.Fragment>
                <Modal.Header title={title} onClose={onClose} />
                <Modal.Content>
                  <pre>
                    { this.state.resource && JSON.stringify(this.state.resource, null, 2) }
                  </pre>
                </Modal.Content>
                <Modal.Controls>
                  <Button onClick={() => { this.props.sdk.close({ dialogState: this.state }) }} buttonType="positive">
                    Link { resourceLabel }
                  </Button>
                  <Button onClick={this.closeModal} buttonType="muted">
                    Close
                  </Button>
                </Modal.Controls>
              </React.Fragment>
            )}
          </Modal> */}
        </div>
      </div>
    )
  }
}

