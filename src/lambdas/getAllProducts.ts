import {
  Handler, APIGatewayProxyEvent, Callback, Context,
} from 'aws-lambda';

import getProducts, { createFilter } from 'src/endpoints/getAllProducts';
import { Product } from 'src/models/Product';
import DynamoProductRepository from 'src/repositories/DynamoProductRepository';

const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<Product[]>,
) => {
  try {
    const products: Product[] = await getProducts(
      new DynamoProductRepository(),
      createFilter(event.multiValueQueryStringParameters),
    );

    callback(null, products);
  } catch (error) {
    callback(error);
  }
};

export default handler;
