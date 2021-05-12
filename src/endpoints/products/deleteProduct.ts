import { APIGatewayProxyEvent } from 'aws-lambda';
import { DeleteProductResponse } from 'src/models/product-responses';
import ProductRepository from 'src/repositories/ProductRepository';
import Response from 'src/responses/Response';
import ResponseError from 'src/responses/ResponseError';
import ResponseOk from 'src/responses/ResponseOk';

async function deleteProduct(
  repository: ProductRepository,
  event: APIGatewayProxyEvent,
): Promise<Response> {
  let response;

  try {
    const { id } = event.pathParameters;

    await repository.delete(id);

    response = new ResponseOk<DeleteProductResponse>();
  } catch (error) {
    response = new ResponseError({
      message: 'Cannot find the product with that specific ID',
    }, 404);
  }

  return response;
}

export default deleteProduct;
