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
  private readonly mapper: DataMapper;

  constructor() {
    const dynamodb = new DynamoDB({
      region: process.env.REGION,
      endpoint: process.env.ENDPOINT,
    });

    this.mapper = new DataMapper({ client: dynamodb });
  }

  filter = async (filters: ProductFilter): Promise<Product[]> => {
    const scanOptions: ScanOptions = {};

    if (filters.limit !== undefined) {
      scanOptions.limit = filters.limit;
    }

    // if (filters) {
    //   const conditions: ConditionExpression[] = [];

    //   if (filters.text) {
    //     conditions.push({
    //       ...contains(filters.text),
    //       subject: 'name',
    //     });
    //   }

    //   if (filters.available) {
    //     conditions.push({
    //       type: 'GreaterThan',
    //       subject: 'quantity',
    //       object: 0,
    //     });
    //   }

    //   if (filters.evidence) {
    //     conditions.push({
    //       type: 'Equals',
    //       subject: 'evidence',
    //       object: filters.evidence,
    //     });
    //   }

    //   if (filters.priceMax !== undefined && filters.priceMin !== undefined) {
    //     conditions.push({
    //       type: 'Between',
    //       subject: 'price',
    //       lowerBound: filters.priceMin,
    //       upperBound: filters.priceMax,
    //     });
    //   }

    //   if (filters.categories) {
    //     conditions.push({
    //       ...inList(filters.categories),
    //       subject: 'categories',
    //     });
    //   }

    //   scanOptions.filter = {
    //     type: 'And',
    //     conditions,
    //   };
    // }

    const results = this.mapper.scan(ProductDynamo, scanOptions);

    console.log(results.pages());

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
