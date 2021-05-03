import Validator from 'validatorjs';

export function validateProduct(productToValidate: Product): boolean {
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
