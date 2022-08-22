import { Warp2Settings } from '../components/Dialog'
import { GET_PRODUCTS, GET_COLLECTIONS } from '../queries/hail-frequency'
import { W2_GET_PRODUCTS, W2_GET_COLLECTIONS } from '../queries/warp2'
import NacelleClient, {
  NacelleGraphQLConnector,
  ProductOptions
} from '@nacelle/client-js-sdk'

const queries: { [key: string]: { queryName: string; query: string } } = {
  products: {
    queryName: 'getProducts',
    query: GET_PRODUCTS
  },
  collections: {
    queryName: 'getCollections',
    query: GET_COLLECTIONS
  }
}

async function w2Fetch(
  query: string,
  variables: object,
  settings: Warp2Settings
) {
  const response = await fetch(settings.nacelleEndpoint, {
    method: 'POST',
    headers: {
      'x-nacelle-space-token': settings.token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      variables
    })
  })
  return response.json()
}

export async function fetchW2Resource(
  key: string,
  settings: Warp2Settings,
  searchTerm?: string
) {
  try {
    const variables = searchTerm
      ? {
          filter: {
            first: 500,
            locale: 'en-US',
            searchFilter: {
              fields: ['TITLE', 'HANDLE'],
              term: searchTerm
            }
          }
        }
      : {
          filter: {
            first: 500,
            locale: 'en-US'
          }
        }

    if (key.includes('products')) {
      const response = await w2Fetch(W2_GET_PRODUCTS, variables, settings)
      const products = response.data.allProducts.edges.map(
        (productNode: any) => {
          const product = productNode.node
          const variants = product.variants
            ? product.variants.map((variant: any) => {
                return {
                  sku: variant.sku,
                  title: variant.content.title
                }
              })
            : null
          return {
            featuredMedia: product.content.featuredMedia,
            globalHandle: `${product.content.handle}::${product.content.locale}`,
            handle: product.content.locale,
            productType: product.productType,
            tags: product.tags,
            title: product.content.title,
            variants
          }
        }
      )
      return products
    } else {
      const response = await w2Fetch(W2_GET_COLLECTIONS, variables, settings)

      const collections = response.data.allProductCollections.edges.map(
        (collectionNode: any) => {
          const collection = collectionNode.node
          const handles = collection.products.map((product: any) => {
            return product.content.handle
          })
          return {
            featuredMedia: null,
            globalHandle: `${collection.content.handle}::${collection.content.locale}`,
            handle: collection.content.handle,
            productLists: { handles },
            title: collection.content.title
          }
        }
      )
      return collections
    }
  } catch (error) {
    return []
  }
}

export async function fetchResources(key: string, client: NacelleClient) {
  const { query, queryName } = queries[key]
  const connector = client.data.connector as NacelleGraphQLConnector
  return await connector.getAllPageItems<ProductOptions>({
    query,
    queryName,
    first: 500
  })
}

function areEqual(array1: any[], array2: any[]) {
  if (array1.length === array2.length) {
    return array1.every((element) => {
      if (
        array2.some((array2Element) => array2Element.title === element.title)
      ) {
        return true
      }

      return false
    })
  }
  return false
}

export async function apiSearch(
  searchValue: string,
  dataType: string,
  searchedList: any[],
  settings: Warp2Settings
) {
  const data = await fetchW2Resource(dataType, settings, searchValue)
  if (!areEqual(data, searchedList)) {
    return data
  }
  return null
}
