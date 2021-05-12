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

  const orders: SNSQuantityEditedPayload[] = JSON.parse(msg.Message);

  orders.forEach(async (order: SNSQuantityEditedPayload) => {
    if (validateSNSQuantity(order)) {
      const product: Product = await repository.getOne(order.id);

      product.quantity -= order.quantity;

      await repository.edit(product);
    }
  });
}

export default updateQuantity;
