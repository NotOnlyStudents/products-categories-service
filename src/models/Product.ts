import { Category } from './Category';

export interface Product {
  id: string;
  name?: string;
  description?: string;
  images?: string[];
  quantity?: number;
  price?: number;
  evidence?: boolean;
  discount?: number;
  categories?: Category[];
}

export interface ProductFilter {
  text?: string,
  categories?: Category[],
  priceMax?: number,
  priceMin?: number,
  available?: boolean,
  evidence?: boolean,
  offset?: number,
  limit?: number,
  sort?: SortType,
}

export enum SortType {
  alphabetical = 'alphabetical',
  cheaper = 'cheaper',
  expensive = 'expensive',
}
