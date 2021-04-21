import {
  attribute, hashKey, table,
} from '@aws/dynamodb-data-mapper-annotations';
import { Category } from './Category';
import { Product } from './Product';

@table('products')
class ProductDynamo implements Product {
  @hashKey()
  id?: string;

  @attribute()
  name?: string;

  @attribute()
  description?: string;

  @attribute()
  images?: string[];

  @attribute()
  quantity?: number;

  @attribute()
  price?: number;

  @attribute()
  evidence?: boolean;

  @attribute()
  discount?: number;

  @attribute()
  categories?: Category[];

  constructor(product: string) {
    const p = JSON.parse(product);

    this.name = p.name;
    this.description = p.description;
    this.discount = p.discount;
    this.evidence = p.evidence;
    this.images = p.images;
    this.price = p.price;
    this.quantity = p.quantity;
    this.categories = p.categories;
  }
}

export default ProductDynamo;
