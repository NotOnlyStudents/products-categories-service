import { APIGatewayProxyEvent } from 'aws-lambda';
import { Product } from 'src/models/Product';
import { EditProductResponse } from 'src/models/product-responses';
import ProductDynamo from 'src/models/ProductDynamo';
import ProductRepository from 'src/repositories/ProductRepository';
import Response from 'src/responses/Response';
import ResponseError from 'src/responses/ResponseError';
import ResponseOk from 'src/responses/ResponseOk';
import { validateProduct } from 'src/validation/validate-product';

async function editProduct(
  repository: ProductRepository, event: APIGatewayProxyEvent,
): Promise<Response> {
  let response: Response;

  const product: Product = JSON.parse(event.body || '{}');

  const productToEdit: ProductDynamo = new ProductDynamo(
    event.pathParameters.id,
    product.name,
    product.description,
    product.discount,
    product.evidence,
    product.images,
    product.price,
    product.quantity,
    product.categories,
  );

  if (validateProduct(productToEdit)) {
    try {
      const productEdited: Product = await repository.edit(productToEdit);

      response = new ResponseOk<EditProductResponse>({
        data: productEdited,
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

  return response;
}

export default editProduct;
