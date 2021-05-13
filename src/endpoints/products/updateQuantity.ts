import { SNSMessage, SQSEvent, SQSRecord } from 'aws-lambda';
import { Product } from 'src/models/Product';
import { SNSQuantityEditedPayload } from 'src/models/product-responses';
import ProductRepository from 'src/repositories/ProductRepository';
import { validateSNSQuantity } from 'src/validation/validate-product';

async function updateQuantity(
  repository: ProductRepository,
  event: SQSEvent,
) {
  const record: SQSRecord = event.Records[0];
  const msg: SNSMessage = JSON.parse(record.body);

  console.log('Records: ', event.Records);
  console.log('Msg: ', msg);

  const orders: SNSQuantityEditedPayload[] = JSON.parse(msg.Message);

  console.log('Orders: ', orders);

  orders.forEach(async (order: SNSQuantityEditedPayload) => {
    console.log(JSON.stringify(order, null, 4));

    const product: Product = await repository.getOne(order.id);

    console.log('Product: ', product);

    product.quantity -= order.quantity;

    console.log('New quantity: ', product.quantity);

    await repository.edit(product);
  });
}

export default updateQuantity;
