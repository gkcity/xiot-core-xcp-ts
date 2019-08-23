import {IQQuery} from '../IQQuery';
import {IQResult} from '../IQResult';

export const PING_METHOD = 'urn:xiot:ping';

export class QueryPing extends IQQuery {

  constructor(id: string) {
    super(id, PING_METHOD);
  }

  public result(): ResultPing {
    const result = new ResultPing(this.id);
    result.from = this.to;
    result.to = this.from;
    return result;
  }
}

export class ResultPing extends IQResult {

  constructor(id: string) {
    super(id, PING_METHOD);
  }
}
