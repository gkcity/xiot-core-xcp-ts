import {IQCodec} from '../IQCodec';
import {IQQuery} from '../../typedef/iq/IQQuery';
import {IQResult} from '../../typedef/iq/IQResult';
import {QueryVerifyFinish, ResultVerifyFinish} from '../../typedef/iq/basic/VerifyFinish';

export class VerifyFinishCodec implements IQCodec {

  encodeQueryContent(query: IQQuery): any | null {
    if (query instanceof QueryVerifyFinish) {
      return {
        'udid': query.udid,
        signature: query.signature,
        codec: query.codec
      };
    }

    return null;
  }

  encodeResultContent(result: IQResult): any | null {
    return null;
  }

  decodeQuery(id: string, content: any): IQQuery | null {
    return new QueryVerifyFinish(id,
      content['udid'],
      content['signature'],
      content['codec']);
  }

  decodeResult(id: string, content: any): IQResult | null {
    return new ResultVerifyFinish(id);
  }
}
