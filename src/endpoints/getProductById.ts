import { Product } from 'src/models/Product';
import ProductRepository from 'src/repositories/ProductRepository';

async function getProductById(repository: ProductRepository, id: string): Promise<Product> {
  return repository.getOne(id);
}

export default getProductById;
