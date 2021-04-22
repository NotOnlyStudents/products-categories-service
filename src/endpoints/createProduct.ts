import { Product } from 'src/models/Product';
import ProductRepository from 'src/repositories/ProductRepository';

async function createProduct(
  repository: ProductRepository,
  productToSave: Product,
): Promise<Product> {
  return repository.save(productToSave);
}

export default createProduct;
