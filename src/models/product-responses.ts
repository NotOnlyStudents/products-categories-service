import { Product, ProductPaginator } from './Product';

export interface GetAllProductsResponse {
  data: ProductPaginator;
}

export interface CreateProductResponse {
  data: Product;
}

export interface GetOneProductResponse {
  data: {
    token: {
      data: Product
    },
    timeout: string
  },
  hmac: string
}

export interface EditProductResponse {
  data: Product
}

export interface DeleteProductResponse {

}
