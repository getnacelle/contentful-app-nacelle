export const w2productsResponse = {
  data: {
    allProducts: {
      edges: [
        {
          node: {
            productType: 'Eyeglasses',
            tags: ['women'],
            content: {
              featuredMedia: {
                thumbnailSrc:
                  'https://cdn.shopify.com/s/files/1/0344/4362/4583/products/photo-1485875437342-9b39470b3d95.jpg?v=1587622565&width=100'
              },
              title: 'Schuyler Glasses',
              handle: 'schuyler-glasses',
              locale: 'en-US'
            },
            variants: [
              {
                sku: null,
                content: {
                  title: 'Default Title'
                }
              }
            ]
          }
        },
        {
          node: {
            productType: '',
            tags: ['filter_color_grey', 'women'],
            content: {
              featuredMedia: {
                thumbnailSrc:
                  'https://cdn.shopify.com/s/files/1/0344/4362/4583/products/couple-at-sunset.jpg?v=1587622574&width=100'
              },
              title: 'Reilly Crop Top',
              handle: 'reilly-crop-top',
              locale: 'en-US'
            },
            variants: [
              {
                sku: null,
                content: {
                  title: 'Default Title'
                }
              }
            ]
          }
        },
        {
          node: {
            productType: '',
            tags: ['footwear', 'women'],
            content: {
              featuredMedia: {
                thumbnailSrc:
                  'https://cdn.shopify.com/s/files/1/0344/4362/4583/products/tattoo-high-heels.jpg?v=1587622575&width=100'
              },
              title: 'Tierney Heels',
              handle: 'tierney-heels',
              locale: 'en-US'
            },
            variants: [
              {
                sku: null,
                content: {
                  title: 'Default Title'
                }
              }
            ]
          }
        }
      ]
    }
  }
}

export const w2products = [
  {
    featuredMedia: {
      thumbnailSrc:
        'https://cdn.shopify.com/s/files/1/0344/4362/4583/products/photo-1485875437342-9b39470b3d95.jpg?v=1587622565&width=100'
    },
    globalHandle: 'schuyler-glasses::en-US',
    handle: 'en-US',
    productType: 'Eyeglasses',
    tags: ['women'],
    title: 'Schuyler Glasses',
    variants: [
      {
        sku: null,
        title: 'Default Title'
      }
    ]
  },
  {
    featuredMedia: {
      thumbnailSrc:
        'https://cdn.shopify.com/s/files/1/0344/4362/4583/products/couple-at-sunset.jpg?v=1587622574&width=100'
    },
    globalHandle: 'reilly-crop-top::en-US',
    handle: 'en-US',
    productType: '',
    tags: ['filter_color_grey', 'women'],
    title: 'Reilly Crop Top',
    variants: [
      {
        sku: null,
        title: 'Default Title'
      }
    ]
  },
  {
    featuredMedia: {
      thumbnailSrc:
        'https://cdn.shopify.com/s/files/1/0344/4362/4583/products/tattoo-high-heels.jpg?v=1587622575&width=100'
    },
    globalHandle: 'tierney-heels::en-US',
    handle: 'en-US',
    productType: '',
    tags: ['footwear', 'women'],
    title: 'Tierney Heels',
    variants: [
      {
        sku: null,
        title: 'Default Title'
      }
    ]
  }
]
