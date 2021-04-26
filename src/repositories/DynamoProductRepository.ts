import { DataMapper, QueryOptions } from '@aws/dynamodb-data-mapper';
import { DynamoDB } from 'aws-sdk';
import {
  ConditionExpression,
  between,
  contains,
  greaterThan,
  equals,
  inList,
} from '@aws/dynamodb-expressions';
import {
  Product, ProductFilter, ProductPaginator, SortType,
} from 'src/models/Product';
import ProductDynamo from 'src/models/ProductDynamo';
import { v4 as uuidv4 } from 'uuid';
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

  filter = async (filters: ProductFilter): Promise<ProductPaginator> => {
    const queryOptions: QueryOptions = {};

    switch (filters.sort) {
      case SortType.cheaper: {
        queryOptions.indexName = 'PriceIndex';
        queryOptions.scanIndexForward = true;
        break;
      }
      case SortType.expensive: {
        queryOptions.indexName = 'PriceIndex';
        queryOptions.scanIndexForward = false;
        break;
      }
      default: { // Alphabetical sort
        queryOptions.indexName = 'NameIndex';
        queryOptions.scanIndexForward = true;
      }
    }

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
          ...between(filters.priceMin, filters.priceMax),
          subject: 'price',
        });
      }

      if (filters.categories) {
        conditions.push({
          ...inList(...filters.categories),
          subject: 'categories',
        });
      }

      if (conditions.length) {
        queryOptions.filter = {
          type: 'And',
          conditions,
        };
      }
    }

    const results = this.mapper.query(ProductDynamo, {
      subject: '_id',
      ...equals('product'),
    }, queryOptions);

    const products: Product[] = [];
    let total = 0;

    for await (const result of results) {
      if ((products.length < filters.limit)
        && total > (filters.limit * filters.offset)) {
        products.push(result);
      }

      ++total;
    }

    return {
      products,
      total,
    };
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
