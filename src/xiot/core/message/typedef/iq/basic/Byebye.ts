import {IQQuery} from '../IQQuery';
import {IQResult} from '../IQResult';

export const BYEBYE_METHOD = 'urn:xiot:bye-bye';

export class QueryByebye extends IQQuery {

  constructor(id: string) {
    super(id, BYEBYE_METHOD);
  }

  public result(): ResultByebye {
    const result = new ResultByebye(this.id);
    result.from = this.to;
    result.to = this.from;
    return result;
  }
}

export class ResultByebye extends IQResult {

  constructor(id: string) {
    super(id, BYEBYE_METHOD);
  }
}
