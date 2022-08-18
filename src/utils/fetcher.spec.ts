import w1products from '../../__mocks__/w1products'
import w1collections from '../../__mocks__/w1collections'
import {
  w2collections,
  w2collectionsResponse
} from '../../__mocks__/w2collections'
import { w2products, w2productsResponse } from '../../__mocks__/w2products'
import NacelleClient from '@nacelle/client-js-sdk'
import { apiSearch, fetchResources, fetchW2Resource } from './fetcher'

const mockClient = {
  data: {
    connector: {
      getAllPageItems: (object: any) => {
        if (object.queryName.includes('Products')) {
          return w1products
        } else {
          return w1collections
        }
      }
    }
  }
}

const unmockedFetch = global.fetch

beforeAll(() => {
  global.fetch = (endpoint, request) => {
    if (JSON.stringify(request).includes('allProducts')) {
      return Promise.resolve({
        json: () => Promise.resolve(w2productsResponse)
      }) as Promise<Response>
    } else {
      return Promise.resolve({
        json: () => Promise.resolve(w2collectionsResponse)
      }) as Promise<Response>
    }
  }
})

afterAll(() => {
  global.fetch = unmockedFetch
})

describe('fetchResources', () => {
  it('accepts client and fetches warp 1 products', async () => {
    const products = await fetchResources(
      'products',
      mockClient as unknown as NacelleClient
    )
    expect(products).toEqual(w1products)
  })
  it('accepts client and fetches warp 1 collections', async () => {
    const collections = await fetchResources(
      'collections',
      mockClient as unknown as NacelleClient
    )
    expect(collections).toEqual(w1collections)
  })
})

describe('fetchW2Resource', () => {
  it('fetches warp 2 products and transforms them into warp 1 shape', async () => {
    const products = await fetchW2Resource('products', {
      id: 'id',
      token: 'token',
      locale: 'locale',
      nacelleEndpoint: 'endpoint'
    })
    expect(products).toEqual(w2products)
  })
  it('fetches warp 2 collections and transforms them into warp 1 shape', async () => {
    const collections = await fetchW2Resource('collections', {
      id: 'id',
      token: 'token',
      locale: 'locale',
      nacelleEndpoint: 'endpoint'
    })
    expect(collections).toEqual(w2collections)
  })
})

describe('apiSearch', () => {
  it('returns the correct shaped data if discrepancy in arrays', async () => {
    const data = await apiSearch('schuyler', 'products', w2products.slice(1), {
      id: 'id',
      token: 'token',
      locale: 'locale',
      nacelleEndpoint: 'endpoint'
    })
    expect(data).toEqual(w2products)
  })
  it('returns null if arrays match', async () => {
    const data = await apiSearch('schuyler', 'products', w2products, {
      id: 'id',
      token: 'token',
      locale: 'locale',
      nacelleEndpoint: 'endpoint'
    })
    expect(data).toEqual(null)
  })
})
