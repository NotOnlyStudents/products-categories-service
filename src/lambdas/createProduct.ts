import {
  Handler, APIGatewayProxyEvent, Callback, Context,
} from 'aws-lambda';

import createProduct, { validate } from 'src/endpoints/createProduct';
import { Product } from 'src/models/Product';
import ProductDynamo from 'src/models/ProductDynamo';
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
    let response: Response;

    const productToSave: ProductDynamo = new ProductDynamo(event.body);

    if (validate(productToSave)) {
      const products: Product = await createProduct(
        new DynamoProductRepository(),
        productToSave,
      );

      response = new ResponseOk({
        data: products,
      });
    } else {
      response = new ResponseError({
        message: 'some field does not satisfy its minimum requirement',
      });
    }

    callback(null, response);
  } catch (error) {
    callback(error);
  }
};

export default handler;
