import { ProductPaginator } from './Product';

export interface GetAllProductResponse {
  data: ProductPaginator;
}

export interface CreateProductResponse {
  data: Product;
}
