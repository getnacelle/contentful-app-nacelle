import mockSdk from '../../__mocks__/sdk'
import mockContentTypes from '../../__mocks__/contentTypes'
import mockEditorInterfaces from '../../__mocks__/editorInterfaces'
import { ReferenceTableRow } from '../components/NacelleReferences/ReferenceTable'
import getNacelleFields from './getNacelleFields'

const mockGetContentType = jest.fn()
const mockGetEditorInterfaces = jest.fn()

const mockGetEnvironment = () => {
  return {
    getContentTypes: mockGetContentType,
    getEditorInterfaceForContentType: mockGetEditorInterfaces
  }
}

jest.mock('contentful-management', () => {
  return {
    createClient: () => {
      return {
        getSpace: () => {
          return {
            getEnvironment: mockGetEnvironment
          }
        }
      }
    }
  }
})

describe('`getnacelleFields`', () => {
  beforeEach(() => {
    mockGetContentType.mockImplementation(() =>
      Promise.resolve(mockContentTypes)
    )
    mockGetEditorInterfaces.mockImplementation(() =>
      Promise.resolve(mockEditorInterfaces)
    )
  })

  it('should return an array of `ReferenceTableRow` objects', async () => {
    const referenceTableRows: ReferenceTableRow[] = await getNacelleFields(
      mockSdk.cmaAdapter,
      mockSdk.ids.app,
      mockSdk.ids.space,
      mockSdk.ids.environment
    )

    const expectedTableRows = [
      {
        field: 'collectionHandle',
        link: `https://app.contentful.com/spaces/${mockSdk.ids.space}/environments/${mockSdk.ids.environment}/content_types/collectionGrid/fields`,
        nacelleReference: 'N/A (*Collection Handle as string)',
        type: 'collectionGrid'
      },
      {
        field: 'product',
        link: `https://app.contentful.com/spaces/${mockSdk.ids.space}/environments/${mockSdk.ids.environment}/content_types/collectionGrid/fields`,
        nacelleReference: 'PRODUCT',
        type: 'collectionGrid'
      }
    ]

    expect(referenceTableRows).toEqual(expectedTableRows)
  })
})
