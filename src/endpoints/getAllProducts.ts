import { Product, ProductFilter } from 'src/models/Product';
import ProductRepository from 'src/repositories/ProductRepository';

async function getAllProducts(
  repository: ProductRepository, filter: ProductFilter,
): Promise<Product[]> {
  const products: Product[] = await repository.filter(filter);
  return products;
}

export function createFilter(query): ProductFilter {
  const filters: ProductFilter = {};

  if (query) {
    if (query.text) {
      filters.text = query.text[0];
    }

    if (query.priceMax) {
      filters.priceMax = parseInt(query.priceMax[0]);
    }

    if (query.priceMin) {
      filters.priceMin = parseInt(query.priceMin[0]);
    }

    if (query.categories) {
      filters.categories = query.categories;
    }

    if (query.available) {
      filters.available = query.available[0] === 'true';
    }

    if (query.evidence) {
      filters.evidence = query.evidence[0] === 'true';
    }

    if (query.offset) {
      filters.offset = parseInt(query.offset[0]);
    }

    if (query.limit) {
      filters.limit = parseInt(query.limit[0]);
    }

    if (query.sort) {
      filters.sort = query.sort[0];
    }
  }

  return filters;
}

export default getAllProducts;
