import { APIGatewayProxyEvent } from 'aws-lambda';
import dispatchSNSProductDeleted from 'src/lambdas/products/sns/dispatchSNSProductDeleted';
import { isSeller } from 'src/lib/auth';
import { DeleteProductResponse } from 'src/models/product-responses';
import ProductRepository from 'src/repositories/ProductRepository';
import Response from 'src/responses/Response';
import ResponseError from 'src/responses/ResponseError';
import ResponseOk from 'src/responses/ResponseOk';

async function deleteProduct(
  repository: ProductRepository,
  event: APIGatewayProxyEvent,
): Promise<Response> {
  let response: Response;

  if (isSeller(event)) {
    try {
      const { id } = event.pathParameters;

      repository.delete(id);

      dispatchSNSProductDeleted(id);

      response = new ResponseOk<DeleteProductResponse>();
    } catch (error) {
      response = new ResponseError({
        message: 'Cannot find the product with that specific ID',
      }, 404);
    }
  } else {
    response = new ResponseError({
      message: 'User not authorized',
    }, 401);
  }

  return response;
}

export default deleteProduct;
