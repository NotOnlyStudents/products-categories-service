import { Product } from 'src/models/Product';
import ProductRepository from 'src/repositories/ProductRepository';

async function editProduct(
  repository: ProductRepository, productToEdit: Product,
): Promise<Product> {
  return repository.edit(productToEdit);
}

export default editProduct;
