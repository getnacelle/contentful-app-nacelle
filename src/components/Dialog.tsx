import React, { Component } from 'react';
import {
  Button,
  Card,
  DropdownList,
  DropdownListItem,
  EntityList,
  EntityListItem,
  Paragraph,
  TextField
} from '@contentful/forma-36-react-components';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
import { AppInstallationParameters } from './ConfigScreen'
import { css } from 'emotion';
import NacelleClient, { Collection, Product } from '@nacelle/client-js-sdk'

const skeletonList = [...Array(5)].map((_, i) => {
  return (<EntityListItem key={i} isLoading={true} title={'skeleton'} />)
})

interface DialogProps {
  sdk: DialogExtensionSDK
}

interface DialogState {
  location: string
  contentType: string
  value: string
  valueKey: string
  searchValue: string
  publishedValue: string
  resource: any
  resourceLabel: string
  resources: any[]
  showJson: boolean
  selectedJson: string
  selectedIndex: number
  loading: boolean
}

export default class Dialog extends Component<DialogProps, DialogState> {

  constructor(props: DialogProps) {
    super(props)

    this.state = {
      location: '',
      contentType: '',
      value: '',
      valueKey: '',
      searchValue: '',
      publishedValue: '',
      resource: undefined,
      resourceLabel: '',
      resources: [],
      showJson: false,
      selectedJson: '',
      selectedIndex: 0,
      loading: true
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
    let valueKey = 'globalHandle'
    if (resourceLabel === 'Collection') {
      resources = await client.data.allCollections()
      valueKey = 'handle'
    } else if (resourceLabel === 'Product') {
      resources = await client.data.allProducts()
    } else {
      resources = await client.data.allProducts()
    }
    const resource = resources.find(r => value === r[valueKey])

    this.setState(state =>({
      ...invocation,
      publishedValue: value,
      resources,
      resource,
      valueKey,
      loading: false
    }))
  }

  onValueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const searchValue = e.currentTarget.value
    this.setState(state => ({
      searchValue
    }));
  };

  updateResource = (value: string, index: number, callback?: () => void) => {
    this.setState(state => ({
      value,
      selectedIndex: index,
      resource: state.resources.find(r => value === r[state.valueKey])
    }), callback);
  };

  saveAndClose = (value: string, index: number) => {
    this.updateResource(value, index, () => {
      this.props.sdk.close({ dialogState: this.state })
    })
  }

  openJson = (value: string, index: number) => {
    this.setState(state => ({
      value,
      selectedIndex: index,
      resource: state.resources.find(r => value === r[state.valueKey]),
      showJson: true
    }));
  }

  closeJson = () => {
    this.setState(state => ({
      showJson: false
    }));
  }

  render() {
    this.props.sdk.window.startAutoResizer()
    const resourceLabel = this.state.resourceLabel
    const resourceLowerPluralized = resourceLabel.toLowerCase() + 's'

    const resourceList = this.state.resources
      .filter(r => {
        return r.title.toLowerCase().includes(this.state.searchValue.toLowerCase())
      })
      .map((r, i) => {
      const resourceValue = r[this.state.valueKey]
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
            contentType={ resourceValue }
            status={ this.state.publishedValue === resourceValue ? 'published' : undefined }
            isDragActive={ this.state.value === resourceValue }
            onClick={() => { this.updateResource(resourceValue, i) }}
            dropdownListElements={
              <DropdownList testId="cf-ui-dropdown-list">
                {/* <DropdownListItem isActive={false} isDisabled={false} isTitle testId="cf-ui-dropdown-list-item">Actions</DropdownListItem> */}
                <DropdownListItem
                  isActive={false}
                  isDisabled={false}
                  isTitle={false}
                  onClick={() => { this.openJson(resourceValue, i) }}>
                  Show JSON
                </DropdownListItem>
                <DropdownListItem
                  isActive={false}
                  isDisabled={false}
                  isTitle={false}
                  onClick={() => { this.saveAndClose(resourceValue, i) }}>
                  Link { resourceLabel }
                </DropdownListItem>
              </DropdownList>
            }
            entityType='asset'
          />
          <Card
            className={css({ display: i === this.state.selectedIndex && this.state.showJson ? 'block': 'none' })}
          >
            <pre
              className={css({ maxHeight: '200px', overflow: 'scroll' })}
            >
              { this.state.resource && JSON.stringify(this.state.resource, null, 2) }
            </pre>

            <Button onClick={() => { this.props.sdk.close({ dialogState: this.state }) }} buttonType="positive">
              Link { resourceLabel }
            </Button>
            <Button
              className={css({ marginLeft: '10px' })}
              onClick={this.closeJson} buttonType="muted">
              Close
            </Button>
          </Card>
        </React.Fragment>
      )
    })

    return (
      <div
        className={css({ minHeight: '300px', margin: '20px', overflow: 'scroll' })}
      >
        <TextField
          className={css({ marginBottom: '10px' })}
          id="search"
          labelText={`Search for ${resourceLowerPluralized}`}
          name='search'
          value={this.state.searchValue}
          onChange={this.onValueChange}
          textInputProps={{
            disabled: false,
            maxLength: 20,
            placeholder: `Type to search for ${resourceLowerPluralized} by title`,
            rows: 2,
            type: 'text'
          }}
        >
        </TextField>
        {
          resourceList.length > 0 || this.state.loading ? (
            <EntityList>
              { this.state.loading ? skeletonList : resourceList }
            </EntityList>
          ) : (
            <div
              className={css({ textAlign: 'center', marginTop: '25px' })}
            >
              <Paragraph>
                Looks like there are no {resourceLowerPluralized}
              </Paragraph>
            </div>
          )
        }
      </div>
    )
  }
}

