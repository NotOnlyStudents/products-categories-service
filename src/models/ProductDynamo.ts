import {
  attribute, autoGeneratedHashKey, hashKey, table,
} from '@aws/dynamodb-data-mapper-annotations';
import { Category } from './Category';
import { Product } from './Product';

@table(process.env.PRODUCTS_TABLE_NAME)
class ProductDynamo implements Product {
  @hashKey()
  id: string;

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

  constructor(
    id: string = '',
    name: string = '',
    description: string = '',
    discount: number = 0,
    evidence: boolean = false,
    images: string[] = [],
    price: number = 1,
    quantity: number = 0,
    categories: Category[] = [],
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.discount = discount;
    this.evidence = evidence;
    this.images = images;
    this.price = price;
    this.quantity = quantity;
    this.categories = categories;
  }
}

export default ProductDynamo;