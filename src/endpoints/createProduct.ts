import { APIGatewayProxyEvent } from 'aws-lambda';
import { Product } from 'src/models/Product';
import { CreateProductResponse } from 'src/models/product-responses';
import ProductDynamo from 'src/models/ProductDynamo';
import ProductRepository from 'src/repositories/ProductRepository';
import Response from 'src/responses/Response';
import ResponseError from 'src/responses/ResponseError';
import ResponseOk from 'src/responses/ResponseOk';
import { validateProduct } from 'src/validation/validate-product';

async function createProduct(
  repository: ProductRepository,
  event: APIGatewayProxyEvent,
): Promise<Response> {
  let response: Response;

  const product: Product = JSON.parse(event.body || '{}');

  const productToSave: ProductDynamo = new ProductDynamo(
    product.id,
    product.name,
    product.description,
    product.discount,
    product.evidence,
    product.images,
    product.price,
    product.quantity,
    product.categories,
  );

  if (validateProduct(productToSave)) {
    const productSaved: Product = await repository.save(productToSave);

    response = new ResponseOk<CreateProductResponse>({
      data: productSaved,
    });
  } else {
    response = new ResponseError({
      message: 'some field does not satisfy its minimum requirement',
    });
  }

  return response;
}

export default createProduct;
