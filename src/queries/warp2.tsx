export const W2_GET_PRODUCTS = `
  query allProducts($filter: ProductFilterInput) {
    allProducts(filter: $filter){
      edges {
        node {
          productType
          tags
          content {
            featuredMedia {
              thumbnailSrc
            }
            title
            handle
            locale
          },
          variants {
            sku
            content {
              title
            }
          }
        }
      }
    }
  }
`
export const W2_GET_COLLECTIONS = `
  query allProductCollections($filter: ProductCollectionFilterInput) {
    allProductCollections(filter: $filter){
      edges {
        node {
          content{
            handle
            title
            locale
          }
          products {
            content {
              handle
            }
          }
        }
      }
    }
  }
`
