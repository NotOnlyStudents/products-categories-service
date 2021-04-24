import { DataMapper, QueryOptions, ScanOptions } from '@aws/dynamodb-data-mapper';
import { DynamoDB } from 'aws-sdk';
import {
  ConditionExpression,
  ConditionExpressionPredicate,
  contains,
  greaterThan,
  equals,
  inList,
} from '@aws/dynamodb-expressions';
import { Product, ProductFilter, SortType } from 'src/models/Product';
import ProductDynamo from 'src/models/ProductDynamo';
import { v4 as uuidv4 } from 'uuid';
import { equal } from 'node:assert';
import ProductRepository from './ProductRepository';

class DynamoProductRepository implements ProductRepository {
  private readonly mapper: DataMapper;

  constructor() {
    const dynamodb = new DynamoDB({
      region: process.env.REGION,
      endpoint: process.env.ENDPOINT,
    });

    this.mapper = new DataMapper({ client: dynamodb });
  }

  filter = async (filters: ProductFilter): Promise<Product[]> => {
    const scanOptions: QueryOptions = {};

    if (filters.limit) {
      scanOptions.limit = filters.limit;
    }

    switch (filters.sort) {
      case SortType.cheaper: {
        break;
      }
      case SortType.expensive: {
        break;
      }
      default: { // Alphabetical sort
        // scanOptions.indexName = 'name';
        // scanOptions.scanIndexForward = true;
      }
    }

    console.log(filters.priceMin, filters.priceMax);

    if (filters) {
      const conditions: ConditionExpression[] = [];

      if (filters.text) {
        conditions.push({
          ...contains(filters.text.toLowerCase()),
          subject: 'searchName',
        });
      }

      if (filters.available) {
        conditions.push({
          ...greaterThan(0),
          subject: 'quantity',
        });
      }

      if (filters.evidence) {
        conditions.push({
          ...equals(filters.evidence),
          subject: 'evidence',
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

      if (conditions.length) {
        scanOptions.filter = {
          type: 'And',
          conditions,
        };
      }
    }

    const results = this.mapper.scan(ProductDynamo, scanOptions);

    const products: Product[] = [];

    for await (const result of results) {
      products.push(result);
    }

    return products;
  };

  getOne = async (id: string): Promise<Product> => {
    const productToSearch = new ProductDynamo(id);

    return this.mapper.get(productToSearch);
  };

  save = async (productToSave: Product): Promise<Product> => {
    productToSave.id = uuidv4();

    return this.mapper.put(productToSave);
  };

  edit = async (productToEdit: Product): Promise<Product> => this.mapper.update(productToEdit);

  delete = async (id: string): Promise<void> => {
    const productToDelete = new ProductDynamo(id);

    this.mapper.delete(productToDelete);
  };
}

export default DynamoProductRepository;
