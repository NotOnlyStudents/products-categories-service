import { APIGatewayProxyEvent } from 'aws-lambda';
import { GetAllCategoriesResponse } from 'src/models/category-responses';
import CategoryRepository from 'src/repositories/CategoryRepository';
import Response from 'src/responses/Response';
import ResponseOk from 'src/responses/ResponseOk';

async function getAllCategories(
  repository: CategoryRepository, event: APIGatewayProxyEvent,
): Promise<Response> {
  let response;

  const { text } = event.queryStringParameters || { };
  const categories = await repository.getAllCategories(text);

  response = new ResponseOk<GetAllCategoriesResponse>({
    data: categories,
  });

  return response;
}

export default getAllCategories;
