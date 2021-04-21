import { DataMapper, ScanOptions } from '@aws/dynamodb-data-mapper';
import { DynamoDB } from 'aws-sdk';
import {
  ConditionExpression,
  contains,
  inList,
} from '@aws/dynamodb-expressions';
import { Product, ProductFilter } from 'src/models/Product';
import ProductDynamo from 'src/models/ProductDynamo';
import { v4 as uuidv4 } from 'uuid';
import ProductRepository from './ProductRepository';

class DynamoProductRepository implements ProductRepository {
  private mapper: DataMapper;

  constructor() {
    console.log(JSON.stringify(process.env.DYNAMO_CONFIG));

    const dynamodb = new DynamoDB({
      region: process.env.region,
      endpoint: process.env.endpoint,
    });

    this.mapper = new DataMapper({ client: dynamodb });
  }

  filter = async (filters: ProductFilter): Promise<Product[]> => {
    const scanOptions: ScanOptions = {};

    if (filters.limit) {
      scanOptions.pageSize = filters.limit;
    }

    if (filters) {
      const conditions: ConditionExpression[] = [];

      if (filters.text) {
        conditions.push({
          ...contains(filters.text),
          subject: 'name',
        });
      }

      if (filters.available) {
        conditions.push({
          type: 'GreaterThan',
          subject: 'available',
          object: 0,
        });
      }

      if (filters.evidence) {
        conditions.push({
          type: 'Equals',
          subject: 'evidence',
          object: filters.evidence,
        });
      }

      if (filters.priceMax !== undefined && filters.priceMin !== undefined) {
        conditions.push({
          type: 'Between',
          subject: 'price',
          lowerBound: filters.priceMin,
          upperBound: filters.priceMax,
        });
      }

      if (filters.categories) {
        conditions.push({
          ...inList(filters.categories),
          subject: 'categories',
        });
      }

      scanOptions.filter = {
        type: 'And',
        conditions,
      };
    }

    const results = this.mapper.scan(ProductDynamo, scanOptions);

    const products = [];

    for await (const result of results) {
      console.log(result);
    }

    return products;
  };

  save = async (productToSave: Product): Promise<Product> => {
    productToSave.id = uuidv4();

    return this.mapper.put(productToSave);
  };
}

export default DynamoProductRepository;
