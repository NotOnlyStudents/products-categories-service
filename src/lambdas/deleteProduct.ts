import { ItemNotFoundException } from '@aws/dynamodb-data-mapper';
import {
  Handler, APIGatewayProxyEvent, Callback, Context,
} from 'aws-lambda';
import deleteProduct from 'src/endpoints/deleteProduct';

import DynamoProductRepository from 'src/repositories/DynamoProductRepository';
import Response from 'src/responses/Response';
import ResponseError from 'src/responses/ResponseError';
import ResponseOk from 'src/responses/ResponseOk';

const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<Response>,
) => {
  try {
    let response;

    try {
      await deleteProduct(
        new DynamoProductRepository(),
        event.pathParameters.id,
      );

      response = new ResponseOk();
    } catch (error) {
      response = new ResponseError({
        message: 'Cannot find the product with that specific ID',
      }, 404);
    }

    callback(null, response);
  } catch (error) {
    callback(error);
  }
};

export default handler;
