import { Product, ProductFilter } from 'src/models/Product';

interface ProductRepository {
  filter(filters: ProductFilter): Promise<Product[]>
}

export default ProductRepository;
