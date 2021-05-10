interface S3Repository {
  uploadImage(buffer: Buffer, key: string): Promise<string>;
}

export default S3Repository;
