import AWS, { S3 } from 'aws-sdk';
import S3Repository from './S3Repository';

function createImageUrl(key: string, region: string) {
  return `https://${process.env.PRODUCTS_IMAGES_S3}.s3-${region}.amazonaws.com/${key}`;
}

class ProductsImagesS3Repository implements S3Repository {
  private s3: S3;

  private bucketName: string;

  private region: string;

  constructor() {
    this.s3 = new AWS.S3();
    this.bucketName = process.env.PRODUCTS_IMAGES_S3;
    this.region = 'eu-west-2';
  }

  async uploadImage(buffer: Buffer, key: string): Promise<string> {
    await this.s3.putObject({
      Body: buffer,
      Key: key,
      ContentType: 'image/*',
      Bucket: this.bucketName,
      ACL: 'public-read',
    }).promise();

    return createImageUrl(key, this.region);
  }

  async deleteImage(key: string): Promise<void> {
    await this.s3.deleteObject({
      Bucket: this.bucketName,
      Key: key,
    }).promise();
  }
}

export default ProductsImagesS3Repository;
