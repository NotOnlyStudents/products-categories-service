import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { Category } from './Category';
import { Product } from './Product';

@table('products')
class ProductDynamo implements Product {
  @hashKey()
  readonly id: string;

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
}

export default ProductDynamo;
