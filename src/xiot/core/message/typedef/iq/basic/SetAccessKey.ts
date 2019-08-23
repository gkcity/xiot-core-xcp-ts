import {IQQuery} from '../IQQuery';
import {IQResult} from '../IQResult';

export const SET_ACCESS_KEY_METHOD = 'urn:xiot:set-access-key';

export class QuerySetAccessKey extends IQQuery {

  public key: string;

  constructor(id: string, key: string) {
    super(id, SET_ACCESS_KEY_METHOD);
    this.key = key;
  }

  public result(): ResultSetAccessKey {
    const result = new ResultSetAccessKey(this.id);
    result.from = this.to;
    result.to = this.from;
    return result;
  }
}

export class ResultSetAccessKey extends IQResult {

  constructor(id: string) {
    super(id, SET_ACCESS_KEY_METHOD);
  }
}
