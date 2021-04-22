import {
  Handler, APIGatewayProxyEvent, Callback, Context,
} from 'aws-lambda';

import editProduct from 'src/endpoints/editProduct';
import { Product } from 'src/models/Product';
import ProductDynamo from 'src/models/ProductDynamo';
import DynamoProductRepository from 'src/repositories/DynamoProductRepository';
import Response from 'src/responses/Response';
import ResponseError from 'src/responses/ResponseError';
import ResponseOk from 'src/responses/ResponseOk';
import { validateProduct, validate } from 'src/validation/validate-product';

const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<Response>,
) => {
  try {
    let response: Response;

    const product: Product = JSON.parse(event.body || '{}');

    const productToEdit: ProductDynamo = new ProductDynamo(
      event.pathParameters.id,
      product.name,
      product.description,
      product.discount,
      (product.evidence as unknown as string) === 'true',
      product.images,
      product.price,
      product.quantity,
      product.categories,
    );

    if (validateProduct(productToEdit)) {
      try {
        const products: Product = await editProduct(
          new DynamoProductRepository(),
          productToEdit,
        );

        response = new ResponseOk({
          data: products,
        });
      } catch (error) {
        response = new ResponseError({
          message: 'Cannot find the product with that ID',
        }, 404);
      }
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
