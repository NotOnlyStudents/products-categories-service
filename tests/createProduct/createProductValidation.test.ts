import { validate } from 'src/endpoints/createProduct';

describe('Validate product to create', () => {
  test('Valid product', () => {
    const product = {
      name: 'Name of product',
      description: 'description',
      images: ['https://picsum.photos/200'],
      quantity: -1,
      price: 1.00,
      evidence: true,
      discount: 20,
      categories: ['a'],
    };

    expect(validate(product)).toBeTruthy();
  });

  test('Empty product name', () => {
    const product = {
      name: '',
      description: 'description',
      images: ['https://picsum.photos/200'],
      quantity: -1,
      price: 1.00,
      evidence: true,
      discount: 20,
      categories: ['a'],
    };

    expect(validate(product)).toBeFalsy();
  });

  test('Product name longer than 100', () => {
    const product = {
      name: 'A'.replace('A', 'AAAAAAAAAAA').replaceAll('A', 'AAAAAAAAAAA'),
      description: 'description',
      images: ['https://picsum.photos/200'],
      quantity: -1,
      price: 1.00,
      evidence: true,
      discount: 20,
      categories: ['a'],
    };

    expect(validate(product)).toBeFalsy();
  });

  test('Empty images', () => {
    const product = {
      name: 'Name',
      description: 'description',
      images: [],
      quantity: -1,
      price: 1.00,
      evidence: true,
      discount: 20,
      categories: ['a'],
    };

    expect(validate(product)).toBeFalsy();
  });

  test('More than 4 images', () => {
    const product = {
      name: 'Name',
      description: 'description',
      images: ['A', 'B', 'C', 'D', 'E'],
      quantity: -1,
      price: 1.00,
      evidence: true,
      discount: 20,
      categories: ['a'],
    };

    expect(validate(product)).toBeFalsy();
  });

  test('Empty quantity', () => {
    const product = {
      name: 'Name',
      description: 'description',
      images: ['A', 'B', 'C', 'D'],
      // quantity: ,
      price: 1.00,
      evidence: true,
      discount: 20,
      categories: ['a'],
    };

    expect(validate(product)).toBeFalsy();
  });

  test('Not integer quantity', () => {
    const product = {
      name: 'Name',
      description: 'description',
      images: ['A', 'B', 'C', 'D'],
      quantity: 1.10,
      price: 1.00,
      evidence: true,
      discount: 20,
      categories: ['a'],
    };

    expect(validate(product)).toBeFalsy();
  });

  test('Empty price', () => {
    const product = {
      name: 'Name',
      description: 'description',
      images: ['A', 'B', 'C', 'D'],
      quantity: 1,
      evidence: true,
      discount: 20,
      categories: ['a'],
    };

    expect(validate(product)).toBeFalsy();
  });

  test('Price less than 0', () => {
    const product = {
      name: 'Name',
      description: 'description',
      images: ['A', 'B', 'C', 'D'],
      quantity: 1,
      evidence: true,
      price: -2,
      discount: 20,
      categories: ['a'],
    };

    expect(validate(product)).toBeFalsy();
  });

  test('Discount not an integer', () => {
    const product = {
      name: 'Name',
      description: 'description',
      images: ['A', 'B', 'C', 'D'],
      quantity: 1,
      evidence: true,
      price: 2,
      discount: 20.10,
      categories: ['a'],
    };

    expect(validate(product)).toBeFalsy();
  });

  test('Discount less than 0', () => {
    const product = {
      name: 'Name',
      description: 'description',
      images: ['A', 'B', 'C', 'D'],
      quantity: 1,
      evidence: true,
      price: 2,
      discount: -2,
      categories: ['a'],
    };

    expect(validate(product)).toBeFalsy();
  });

  test('Discount more than 100', () => {
    const product = {
      name: 'Name',
      description: 'description',
      images: ['A', 'B', 'C', 'D'],
      quantity: 1,
      evidence: true,
      price: 2,
      discount: 101,
      categories: ['a'],
    };

    expect(validate(product)).toBeFalsy();
  });
});
