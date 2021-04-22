import {
  Handler, APIGatewayProxyEvent, Callback, Context,
} from 'aws-lambda';
import getAllProducts, { createFilter } from 'src/endpoints/getAllProducts';

import { Product } from 'src/models/Product';
import DynamoProductRepository from 'src/repositories/DynamoProductRepository';
import Response from 'src/responses/Response';
import ResponseOk from 'src/responses/ResponseOk';

const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<Response>,
) => {
  try {
    const products: Product[] = await getAllProducts(
      new DynamoProductRepository(),
      createFilter(event.multiValueQueryStringParameters),
    );

    const response: Response = new ResponseOk({
      data: products,
    });

    callback(null, response);
  } catch (error) {
    callback(error);
  }
};

export default handler;
