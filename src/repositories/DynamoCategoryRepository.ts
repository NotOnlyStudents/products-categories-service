import { DataMapper, ScanOptions } from '@aws/dynamodb-data-mapper';
import { DynamoDB } from 'aws-sdk';
import { Category } from 'src/models/Category';
import ProductDynamo from 'src/models/ProductDynamo';
import {
  contains,
} from '@aws/dynamodb-expressions';
import CategoryRepository from './CategoryRepository';

class DynamoCategoryRepository implements CategoryRepository {
  private readonly mapper: DataMapper;

  constructor() {
    const dynamodb = new DynamoDB({
      region: process.env.REGION,
      endpoint: process.env.ENDPOINT,
    });

    this.mapper = new DataMapper({ client: dynamodb });
  }

  getAllCategories = async (text: string): Promise<Category[]> => {
    const results = this.mapper.scan(ProductDynamo);

    const categories: Set<Category> = new Set();

    for await (const result of results) {
      for (const category of result.categories) {
        if (category.includes(text)) {
          categories.add(category);
        }
      }
    }

    return [...categories];
  };
}

export default DynamoCategoryRepository;
