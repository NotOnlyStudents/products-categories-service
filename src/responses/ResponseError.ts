import { HttpHeaders } from 'aws-sdk/clients/iot';
import Response from './Response';

interface BodyError {
  message: string;
}

class ResponseError implements Response {
  readonly statusCode: number;

  readonly headers: HttpHeaders = {
    'Content-Type': 'application/json',
  };

  readonly body: string;

  constructor(body: BodyError, statusCode: number = 400) {
    this.statusCode = statusCode;
    this.body = JSON.stringify(body);
  }

  toString(): string {
    return JSON.stringify(this);
  }
}

export default ResponseError;
