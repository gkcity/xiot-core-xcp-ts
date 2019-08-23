import {IQQuery} from '../IQQuery';
import {IQResult} from '../IQResult';

export const INITIALIZE_METHOD = 'urn:xiot:initialize';

export class QueryInitialize extends IQQuery {

  public version: string;
  public authentication: string;

  constructor(id: string, version: string, auth: string) {
    super(id, INITIALIZE_METHOD);
    this.version = version;
    this.authentication = auth;
  }

  public result(): ResultInitialize {
    const result = new ResultInitialize(this.id);
    result.from = this.to;
    result.to = this.from;
    return result;
  }
}

export class ResultInitialize extends IQResult {

  constructor(id: string) {
    super(id, INITIALIZE_METHOD);
  }
}
