import { HttpHeaders } from 'aws-sdk/clients/iot';
import Response from './Response';

class ResponseOk<T> implements Response {
  readonly statusCode: number = 200;

  readonly headers: HttpHeaders = {
    'Content-Type': 'application/json',
  };

  readonly body: string;

  constructor(body?: T) {
    this.body = JSON.stringify(body || {});
  }

  toString(): string {
    return JSON.stringify(this);
  }
}

export default ResponseOk;
