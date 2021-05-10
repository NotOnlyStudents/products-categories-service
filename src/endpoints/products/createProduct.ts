import { APIGatewayProxyEvent } from 'aws-lambda';
import uploadImageToS3 from 'src/lib/uploadImageToS3';
import { Product } from 'src/models/Product';
import { CreateProductResponse } from 'src/models/product-responses';
import ProductDynamo from 'src/models/ProductDynamo';
import ProductRepository from 'src/repositories/ProductRepository';
import S3Repository from 'src/repositories/S3Repository';
import UploadImageS3Repository from 'src/repositories/UploadImageS3Repository';
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
    const s3Bucket: S3Repository = new UploadImageS3Repository();

    const images = await Promise.all(productToSave.images.map(
      async (image: string) => uploadImageToS3(s3Bucket, image),
    ));

    productToSave.images = images;

    const productSaved: Product = await repository.save(productToSave);

    response = new ResponseOk<CreateProductResponse>({
      data: productSaved,
    });
  } else {
    response = new ResponseError({
      message: 'Some field does not satisfy its minimum requirement',
    });
  }

  return response;
}

export default createProduct;
