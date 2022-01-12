import React, { Component } from "react";
import localforage from "localforage";
import {
  Button,
  EntityList,
  EntityListItem,
  Paragraph,
  TextField,
  Tabs,
  Tab,
} from "@contentful/forma-36-react-components";
import Paginator from "./Paginator";
import ResourceListItem from "./ResourceListItem";
import { css } from "emotion";
import { DialogExtensionSDK } from "contentful-ui-extensions-sdk";
import { AppInstallationParameters } from "./ConfigScreen";
import NacelleClient, {
  NacelleGraphQLConnector,
  ProductOptions,
} from "@nacelle/client-js-sdk";

import { GET_PRODUCTS, GET_COLLECTIONS } from "../queries/hail-frequency";
import { W2_GET_PRODUCTS, W2_GET_COLLECTIONS } from "../queries/warp2";

const skeletonList = [...Array(5)].map((_, i) => {
  return <EntityListItem key={i} isLoading={true} title={"skeleton"} />;
});

const queries: { [key: string]: { queryName: string; query: string } } = {
  products: {
    queryName: "getProducts",
    query: GET_PRODUCTS,
  },
  collections: {
    queryName: "getCollections",
    query: GET_COLLECTIONS,
  },
};

interface DialogProps {
  sdk: DialogExtensionSDK;
}

interface Warp2Settings {
  id: string;
  token: string;
  locale: string;
  nacelleEndpoint: string;
}
interface DialogState {
  location: string;
  contentType: string;
  value: string;
  valueKey: string;
  searchValue: string;
  publishedValue: string;
  resource: any;
  resourceLabel: string;
  resources: any[];
  collections: any[];
  products: any[];
  showJson: boolean;
  selectedJson: string;
  selectedIndex: number;
  selectedTabId: string;
  loading: boolean;
  storage: LocalForage;
  isW2: boolean;
  w2Settings: Warp2Settings;
  client: NacelleClient;
  currentPage: {
    products: number;
    collections: number;
  };
}

export default class Dialog extends Component<DialogProps, DialogState> {
  constructor(props: DialogProps) {
    super(props);

    this.state = {
      location: "",
      contentType: "",
      value: "",
      valueKey: "handle",
      searchValue: "",
      publishedValue: "",
      resource: undefined,
      resourceLabel: "",
      resources: [],
      collections: [],
      products: [],
      showJson: false,
      selectedJson: "",
      selectedIndex: 0,
      selectedTabId: "collections",
      loading: true,
      storage: localforage,
      isW2: false,
      w2Settings: {
        token: "test",
        id: "test",
        locale: "en-us",
        nacelleEndpoint: "",
      },
      client: new NacelleClient({
        token: "test",
        id: "test",
        nacelleEndpoint: "https://hailfrequency.com/v2/graphql",
      }),
      currentPage: {
        products: 1,
        collections: 1,
      },
    };
  }

  async componentDidMount() {
    const {
      nacelleSpaceId: id,
      nacelleSpaceToken: token,
      nacelleEndpoint: endpoint,
    } = this.props.sdk.parameters.installation as AppInstallationParameters;
    const invocation = this.props.sdk.parameters.invocation as DialogState;
    const { value } = invocation;

    // Set data handlers
    await this.setClient(id, token, endpoint);
    await this.setW2Settings(id, token, endpoint);
    await this.setStorage(id);

    if (endpoint && endpoint.includes("storefront")) {
      this.setState(() => ({ isW2: true }));
    }

    // Get resources from invocation
    await this.refreshData(false);

    this.setState((state) => ({
      ...invocation,
      publishedValue: value,
      loading: false,
    }));
  }

  setW2Settings = async (id: string, token: string, endpoint: string) => {
    const w2Settings = {
      id,
      token,
      locale: "en-us",
      nacelleEndpoint: endpoint,
    };

    this.setState(() => ({ w2Settings }));
  };

  setClient = async (id: string, token: string, endpoint: string) => {
    const client = new NacelleClient({
      id,
      token,
      locale: "en-us",
      nacelleEndpoint: endpoint || "https://hailfrequency.com/v2/graphql",
      useStatic: false,
      disableEvents: true,
    });

    this.setState(() => ({ client }));
  };

  setStorage = async (name: string) => {
    // Namespace storage with Space Id to avoid conflict if managing multiple spaces.
    const storage = localforage.createInstance({ name });
    this.setState(() => ({ storage }));
  };

  refreshData = async (force: boolean = false) => {
    if (force) {
      await this.state.storage.removeItem("products-expires");
      await this.state.storage.removeItem("collections-expires");
    }
    await this.fetchResources("products");
    await this.fetchResources("collections");
    await this.setSelectedTab(this.state.selectedTabId);
  };

  w2Fetch = async (query: string, variables: object) => {
    const response = await fetch(this.state.w2Settings.nacelleEndpoint, {
      method: "POST",
      headers: {
        "x-nacelle-space-token": this.state.w2Settings.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    return await response.json();
  };

  fetchW2Resource = async (key: string) => {
    try {
      const variables = {
        filter: {
          first: 2000,
          locale: "en-US",
        },
      };
      if (key.includes("products")) {
        const response = await this.w2Fetch(W2_GET_PRODUCTS, variables);
        const products = response.data.products.map((product: any) => {
          const variants = product.variants
            ? product.variants.map((variant: any) => {
                return {
                  sku: variant.sku,
                  title: variant.content.title,
                };
              })
            : null;
          return {
            featuredMedia: product.content.featuredMedia,
            globalHandle: `${product.content.handle}::${product.content.locale}`,
            handle: product.content.locale,
            productType: product.productType,
            tags: product.tags,
            title: product.content.title,
            variants,
          };
        });
        return products;
      } else {
        const response = await this.w2Fetch(W2_GET_COLLECTIONS, variables);
        const collections = response.data.productCollections.map(
          (collection: any) => {
            const handles = collection.products.map((product: any) => {
              return product.content.handle;
            });
            return {
              featuredMedia: null,
              globalHandle: `${collection.content.handle}::${collection.content.locale}`,
              handle: collection.content.handle,
              productLists: { handles },
              title: collection.content.title,
            };
          }
        );
        return collections;
      }
    } catch (error) {
      return [];
    }
  };

  fetchResources = async (key: string) => {
    const date = new Date();
    const expirationKey = `${key}-expires`;
    let resources = ((await this.state.storage.getItem(key)) || []) as any[];
    let expires = (await this.state.storage.getItem(expirationKey)) as Date;

    if (
      (resources && resources.length === 0) ||
      expires === null ||
      date > expires
    ) {
      if (this.state.isW2) {
        resources = await this.fetchW2Resource(key);
      } else {
        const connector = this.state.client.data
          .connector as NacelleGraphQLConnector;
        const { query, queryName } = queries[key];
        resources = await connector.getAllPageItems<ProductOptions>({
          query,
          queryName,
          first: 2000,
        });
      }

      this.state.storage.setItem(key, resources);
      date.setDate(date.getDate() + 1);
      this.state.storage.setItem(expirationKey, date);
    }

    this.setState((state) => ({
      products: key === "products" ? resources : state.products,
      collections: key === "collections" ? resources : state.collections,
    }));
  };

  setSelectedTab = (id: string) => {
    this.setState((state) => ({
      resources: id === "products" ? state.products : state.collections,
      valueKey: id === "products" ? "globalHandle" : "handle",
      selectedTabId: id,
    }));
  };

  onValueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const searchValue = e.currentTarget.value;
    this.setState(() => ({ searchValue }));
  };

  updateResource = (value: string, index: number, callback?: () => void) => {
    this.setState(
      (state) => ({
        value,
        selectedIndex: index,
        resource: state.resources.find((r) => value === r[state.valueKey]),
      }),
      callback
    );
  };

  saveAndClose = (value: string, index: number) => {
    this.updateResource(value, index, () => {
      // Callback with updated state value
      this.props.sdk.close({
        dialogState: {
          value: this.state.value,
        },
      });
    });
  };

  openJson = (value: string, index: number) => {
    this.setState((state) => ({
      value,
      selectedIndex: index,
      resource: state.resources.find((r) => value === r[state.valueKey]),
      showJson: true,
    }));
  };

  closeJson = () => {
    this.setState(() => ({ showJson: false }));
  };

  handlePageChange = (disabled: boolean, page: number) => {
    if (!disabled) {
      this.setState((state) => ({
        currentPage: {
          products:
            state.selectedTabId === "products"
              ? page
              : state.currentPage["products"],
          collections:
            state.selectedTabId === "collections"
              ? page
              : state.currentPage["collections"],
        },
      }));
    }
  };

  render() {
    this.props.sdk.window.startAutoResizer();
    const resourceLabel = this.state.selectedTabId;
    const itemsPerPage = 10;
    const currentPage =
      resourceLabel === "collections"
        ? this.state.currentPage.collections
        : this.state.currentPage.products;
    const pageIndex = currentPage - 1;
    const startingIndex = pageIndex * itemsPerPage;

    const searchedList = this.state.resources.filter((r) => {
      // const queryText = this.state.searchValue.toLowerCase().trim()
      // const titleMatch = r.title.toLowerCase().includes(queryText)
      // const handleMatch = r.handle.replace('/-/g', '').includes(queryText)
      // const tagsMatch =
      //   Array.isArray(r.tags) &&
      //   r.tags.find((tag: any) => tag.toLowerCase().includes(queryText))
      // const variantsMatch =
      //   Array.isArray(r.variants) &&
      //   r.variants.find((variant: any) => {
      //     const titleMatch = variant.title.toLowerCase().includes(queryText)
      //     const skuMatch =
      //       variant.sku &&
      //       variant.sku.toLowerCase().replace('/-/g', '').includes(queryText)
      //     return titleMatch || skuMatch
      //   })
      // return titleMatch || handleMatch || tagsMatch || variantsMatch
      const searchValue = this.state.searchValue.toLowerCase();
      return (
        r.title.toLowerCase().includes(searchValue) ||
        r.handle.includes(searchValue)
      );
    });

    const pageCount = Math.ceil(searchedList.length / itemsPerPage);
    const paginatedList = searchedList.slice(
      startingIndex,
      startingIndex + itemsPerPage
    );

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
      );
    });

    return (
      <div
        className={css({
          minHeight: "300px",
          margin: "20px",
          overflow: "scroll",
          position: "relative",
        })}
      >
        <div className={css({ position: "absolute", top: "0", right: "0" })}>
          <Button
            buttonType="muted"
            size="small"
            icon="Cycle"
            onClick={() => {
              this.refreshData(true);
            }}
          >
            Refresh
          </Button>
        </div>
        <Tabs role="navigation" withDivider>
          <Tab
            tabIndex={0}
            id="collections"
            selected={this.state.selectedTabId === "collections"}
            onSelect={(id: string) => {
              this.setSelectedTab(id);
            }}
          >
            Collections
          </Tab>
          <Tab
            tabIndex={1}
            id="products"
            selected={this.state.selectedTabId === "products"}
            onSelect={(id: string) => {
              this.setSelectedTab(id);
            }}
          >
            Products
          </Tab>
        </Tabs>
        <br />
        <TextField
          className={css({ marginBottom: "10px" })}
          id="search"
          labelText={`Search for ${resourceLabel}`}
          name="search"
          value={this.state.searchValue}
          onChange={this.onValueChange}
          textInputProps={{
            disabled: false,
            maxLength: 20,
            placeholder: `Type to search for ${resourceLabel} by title`,
            rows: 2,
            type: "text",
          }}
        ></TextField>

        {resourceList.length > 0 || this.state.loading ? (
          <div>
            <EntityList>
              {this.state.loading ? skeletonList : resourceList}
            </EntityList>
            <Paginator
              current={currentPage}
              pageCount={pageCount}
              toPage={this.handlePageChange}
            />
          </div>
        ) : (
          <div className={css({ textAlign: "center", marginTop: "25px" })}>
            <Paragraph>Looks like there are no {resourceLabel}</Paragraph>
          </div>
        )}
      </div>
    );
  }
}
