import { Product, ProductFilter } from 'src/models/Product';
import ProductRepository from 'src/repositories/ProductRepository';

async function getAllProducts(
  repository: ProductRepository, filter: ProductFilter,
): Promise<Product[]> {
  const products: Product[] = await repository.filter(filter);
  return products;
}

export function createFilter(query) {
  const filters: ProductFilter = query;

  if (query) {
    if (query.categories) {
      if (!Array.isArray(query.categories)) {
        filters.categories = [query.categories];
      }
    }

    if (query.available) {
      filters.available = query.available === 'true';
    }

    if (query.evidence) {
      filters.evidence = query.evidence === 'true';
    }
  }

  return filters;
}

export default getAllProducts;
