import {
  Handler, APIGatewayProxyEvent, Callback, Context,
} from 'aws-lambda';

import getProducts from 'src/endpoints/getAllProducts';
import { Product } from 'src/models/Product';
import DynamoProductRepository from 'src/repositories/DynamoProductRepository';

const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<Product[]>,
) => {
  try {
    const products = await getProducts(new DynamoProductRepository());
    callback(null, products);
  } catch (error) {
    callback(error);
  }
};

export default handler;
