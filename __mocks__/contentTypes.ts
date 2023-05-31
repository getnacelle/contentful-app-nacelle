const contentTypes = {
  sys: {
    type: 'Array'
  },
  total: 11,
  skip: 0,
  limit: 100,
  items: [
    {
      sys: {
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: 'iojm91u4ez5c'
          }
        },
        id: 'collectionGrid',
        type: 'ContentType',
        createdAt: '2020-07-16T20:07:48.743Z',
        updatedAt: '2023-03-15T14:03:55.077Z',
        environment: {
          sys: {
            id: 'staging',
            type: 'Link',
            linkType: 'Environment'
          }
        },
        publishedVersion: 91,
        publishedAt: '2023-03-14T17:49:36.378Z',
        firstPublishedAt: '2020-07-16T20:07:49.223Z',
        createdBy: {
          sys: {
            type: 'Link',
            linkType: 'User',
            id: '2M499e6hafXfray3Snb66l'
          }
        },
        updatedBy: {
          sys: {
            type: 'Link',
            linkType: 'User',
            id: '0LxN7Nzo5ASE6wuZSYoP5b'
          }
        },
        publishedCounter: 46,
        version: 100,
        publishedBy: {
          sys: {
            type: 'Link',
            linkType: 'User',
            id: '0LxN7Nzo5ASE6wuZSYoP5b'
          }
        }
      },
      displayField: 'title',
      name: 'Collection Grid',
      description: 'Shows a grid of products from a specific collection',
      fields: [
        {
          id: 'product',
          name: 'Product',
          type: 'JSON',
          localized: false,
          required: false,
          validations: [],
          disabled: false,
          omitted: false
        },
        {
          id: 'nclRefMap',
          name: 'Nacelle References',
          type: 'Symbol',
          localized: false,
          required: false,
          validations: [{ linkContentType: ['product:PRODUCT'] }],
          disabled: true,
          omitted: false
        },
        {
          id: 'collectionHandle',
          name: 'Collection Handle',
          type: 'Symbol',
          localized: false,
          required: false,
          validations: [
            {
              regexp: {
                pattern: 'PRODUCT | COLLECTION',
                flags: ''
              }
            }
          ],
          disabled: false,
          omitted: false
        }
      ]
    }
  ]
}

export default contentTypes
