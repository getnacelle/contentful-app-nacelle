import React, { Component } from 'react';
import localforage from 'localforage'
import {
  EntityList,
  EntityListItem,
  Paragraph,
  TextField,
  Tabs,
  Tab,
} from '@contentful/forma-36-react-components';
import Paginator from './Paginator'
import ResourceListItem from './ResourceListItem';
import { css } from 'emotion';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
import { AppInstallationParameters } from './ConfigScreen'
import NacelleClient, {
  NacelleGraphQLConnector,
  ProductOptions,
} from '@nacelle/client-js-sdk'
import { GET_PRODUCTS, GET_COLLECTIONS } from '../queries/hail-frequency'

const nacelleStorage = localforage.createInstance({
  name: "nacelle"
});

const skeletonList = [...Array(5)].map((_, i) => {
  return (<EntityListItem key={i} isLoading={true} title={'skeleton'} />)
})

const queries: { [key: string]: { queryName: string, query: string } } = {
  'products': {
    queryName: 'getProducts',
    query: GET_PRODUCTS
  },
  'collections': {
    queryName: 'getCollections',
    query: GET_COLLECTIONS
  }
}

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
  collections: any[]
  products: any[]
  showJson: boolean
  selectedJson: string
  selectedIndex: number
  selectedTabId: string
  loading: boolean
  currentPage: {
    'products': number
    'collections': number
  }
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
      collections: [],
      products: [],
      showJson: false,
      selectedJson: '',
      selectedIndex: 0,
      selectedTabId: 'collections',
      loading: true,
      currentPage: {
        'products': 1,
        'collections': 1
      }
    }
  }

  async componentDidMount() {
    const {
      nacelleSpaceId: id,
      nacelleSpaceToken: token
    } = this.props.sdk.parameters.installation as AppInstallationParameters
    const invocation = this.props.sdk.parameters.invocation as DialogState
    const { value } = invocation

    const settings = {
      id,
      token,
      locale: 'en-us',
      nacelleEndpoint: 'https://hailfrequency.com/v2/graphql',
      useStatic: false,
      disableEvents: true
    }
    
    const client = new NacelleClient(settings)
    
    // Get resources from invocation
    const valueKey = 'handle'
    await this.fetchResources(client, 'products')
    await this.fetchResources(client, 'collections')
    const resource = this.state.collections.find(r => value === r[valueKey])

    this.setState(state =>({
      ...invocation,
      publishedValue: value,
      resources: this.state.collections,
      resource,
      valueKey,
      loading: false
    }))
  }

  fetchResources = async (client: NacelleClient, key: string) => {
    const date = new Date()
    const expirationKey = `${key}-expires`
    let resources = (await nacelleStorage.getItem(key) || []) as any[];
    let expires = await nacelleStorage.getItem(expirationKey) as Date

    if (resources && resources.length === 0 && (expires === null || date > expires)) {
      const connector = client.data.connector as NacelleGraphQLConnector
      const { query, queryName } = queries[key]
      resources = await connector.getAllPageItems<ProductOptions>({
        query,
        queryName,
        first: 2000
      })

      nacelleStorage.setItem(key, resources)
      date.setDate(date.getDate() + 1);
      nacelleStorage.setItem(expirationKey, date)
    }
    
    this.setState(state => ({
      products: key === 'products' ? resources : state.products,
      collections: key === 'collections' ? resources : state.collections
    }))
  }

  setSelectedTab = (id: string) => {
    this.setState(state => ({
      resources: id === 'products' ? state.products : state.collections,
      valueKey: id === 'products' ? 'globalHandle' : 'handle',
      selectedTabId: id
    }));
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

  handlePageChange = (disabled: boolean, page: number) => {
    if (!disabled) {
      this.setState(state => ({
        currentPage: {
          'products': state.selectedTabId === 'products' ? page : state.currentPage['products'],
          'collections': state.selectedTabId === 'collections' ? page : state.currentPage['collections']
        }
      }));
    }
  }

  render() {
    this.props.sdk.window.startAutoResizer()
    const resourceLabel = this.state.selectedTabId
    const itemsPerPage = 10
    const currentPage = resourceLabel === 'collections' ? this.state.currentPage.collections : this.state.currentPage.products
    const pageIndex = currentPage - 1
    const startingIndex = pageIndex * itemsPerPage

    const searchedList = this.state.resources.filter(r => {
      return r.title.toLowerCase().includes(this.state.searchValue.toLowerCase())
    })

    const pageCount = Math.ceil(searchedList.length / itemsPerPage)
    const paginatedList = searchedList.slice(startingIndex, startingIndex + itemsPerPage)

    const resourceList = paginatedList.map((r, i) => {
      return (
        <ResourceListItem
          key={i}
          index={i}
          selectedIndex={this.state.selectedIndex}
          resource={r}
          valueKey={this.state.valueKey}
          resourceLabel={resourceLabel}
          publishedValue={this.state.publishedValue}
          showJson={this.state.showJson}
          handleLink={this.saveAndClose}
          handleOpenJson={this.openJson}
          handleCloseJson={this.closeJson}
        />
      )
    })

    return (
      <div
        className={css({ minHeight: '300px', margin: '20px', overflow: 'scroll' })}
      >
        <Tabs
          role="navigation"
          withDivider
        >
          <Tab
            tabIndex={0}
            id="collections"
            selected={this.state.selectedTabId === 'collections'}
            onSelect={(id: string) => {
              this.setSelectedTab(id);
            }}
          >Collections</Tab>
          <Tab
            tabIndex={1}
            id="products"
            selected={this.state.selectedTabId === 'products'}
            onSelect={(id: string) => {
              this.setSelectedTab(id);
            }}
          >Products</Tab>
        </Tabs>
        <br />
        <TextField
          className={css({ marginBottom: '10px' })}
          id="search"
          labelText={`Search for ${resourceLabel}`}
          name='search'
          value={this.state.searchValue}
          onChange={this.onValueChange}
          textInputProps={{
            disabled: false,
            maxLength: 20,
            placeholder: `Type to search for ${resourceLabel} by title`,
            rows: 2,
            type: 'text'
          }}
        >
        </TextField>
        {
          resourceList.length > 0 || this.state.loading ? (
            <div>
              <EntityList>
                { this.state.loading ? skeletonList : resourceList }
              </EntityList>
              <Paginator current={currentPage} pageCount={pageCount} toPage={this.handlePageChange}/>
          </div>
          ) : (
            <div
              className={css({ textAlign: 'center', marginTop: '25px' })}
            >
              <Paragraph>
                Looks like there are no {resourceLabel}
              </Paragraph>
            </div>
          )
        }
      </div>
    )
  }
}

