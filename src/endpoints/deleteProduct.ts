import ProductRepository from 'src/repositories/ProductRepository';

async function deleteProduct(repository: ProductRepository, id: string): Promise<void> {
  repository.delete(id);
}

export default deleteProduct;
