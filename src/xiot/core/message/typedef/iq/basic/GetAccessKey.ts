import {IQQuery} from '../IQQuery';
import {IQResult} from '../IQResult';

export const GET_ACCESS_KEY_METHOD = 'urn:xiot:get-access-key';

export class QueryGetAccessKey extends IQQuery {

  constructor(id: string) {
    super(id, GET_ACCESS_KEY_METHOD);
  }

  public result(key: string): ResultGetAccessKey {
    const result = new ResultGetAccessKey(this.id, key);
    result.from = this.to;
    result.to = this.from;
    return result;
  }
}

export class ResultGetAccessKey extends IQResult {

  public key: string;

  constructor(id: string, key: string) {
    super(id, GET_ACCESS_KEY_METHOD);
    this.key = key;
  }
}
