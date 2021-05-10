import * as fileType from 'file-type';
import { v4 as uuidv4 } from 'uuid';

import S3Repository from 'src/repositories/S3Repository';

async function uploadImageToS3(s3: S3Repository, image: string): Promise<string> {
  let imageData: string = image;
  let imageUrl: string;

  if (imageData.startsWith('data:image/png;base64,')) {
    imageData = imageData.replace('data:image/png;base64,', '');
  }

  console.log(imageData);

  const buffer = Buffer.from(imageData, 'base64');
  const fileInfo = await fileType.fromBuffer(buffer);

  const detectedExt = fileInfo.ext;
  const name = uuidv4();

  const key = `${name}.${detectedExt}`;

  try {
    imageUrl = await s3.uploadImage(buffer, key);
  } catch (e) {
    imageUrl = '';
  }

  return imageUrl;
}

export default uploadImageToS3;
