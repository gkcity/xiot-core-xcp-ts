import {IQQuery} from '../IQQuery';
import {IQResult} from '../IQResult';

export const VERIFY_FINISH_METHOD = 'urn:xiot:verify-finish';

export class QueryVerifyFinish extends IQQuery {

  public udid: string;
  public signature: string;
  public codec: number;

  constructor(id: string, udid: string, signature: string, codec: number) {
    super(id, VERIFY_FINISH_METHOD);
    this.udid = udid;
    this.signature = signature;
    this.codec = codec;
  }

  public result(): ResultVerifyFinish {
    const result = new ResultVerifyFinish(this.id);
    result.from = this.to;
    result.to = this.from;
    return result;
  }
}

export class ResultVerifyFinish extends IQResult {

  constructor(id: string) {
    super(id, VERIFY_FINISH_METHOD);
  }
}
