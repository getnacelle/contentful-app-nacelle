export const W2_GET_PRODUCTS = `
  query products($filter: ProductFilterInput) {
    products(filter: $filter){
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
`
export const W2_GET_COLLECTIONS = `
  query productCollections($filter: ProductCollectionFilterInput) {
    productCollections(filter: $filter){
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
`
