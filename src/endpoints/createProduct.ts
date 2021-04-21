import { Product } from 'src/models/Product';
import ProductDynamo from 'src/models/ProductDynamo';
import ProductRepository from 'src/repositories/ProductRepository';
import Validator from 'validatorjs';

async function createProduct(
  repository: ProductRepository,
  productToSave: Product,
): Promise<Product> {
  const newProduct = repository.save(productToSave);

  return newProduct;
}

export function validate(productToValidate: Product): boolean {
  const rules = {
    name: 'required|max:100',
    images: 'required|min:1|max:4',
    quantity: 'required|integer',
    price: 'required|numeric|min:0',
    discount: 'integer|min:0|max:100',
  };

  const validation = new Validator(productToValidate, rules);

  return validation.passes() as boolean;
}

export default createProduct;
