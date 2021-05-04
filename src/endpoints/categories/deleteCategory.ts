import { APIGatewayProxyEvent } from 'aws-lambda';
import {
  DeleteCategoryResponse,
} from 'src/models/category-responses';
import CategoryRepository from 'src/repositories/CategoryRepository';
import Response from 'src/responses/Response';
import ResponseOk from 'src/responses/ResponseOk';

async function deleteCategory(
  repository: CategoryRepository, event: APIGatewayProxyEvent,
): Promise<Response> {
  let response;

  await repository.delete(event.pathParameters.id);

  response = new ResponseOk<DeleteCategoryResponse>();

  return response;
}

export default deleteCategory;
