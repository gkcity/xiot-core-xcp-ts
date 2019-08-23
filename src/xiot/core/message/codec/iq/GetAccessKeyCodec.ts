import {IQCodec} from '../IQCodec';
import {IQQuery} from '../../typedef/iq/IQQuery';
import {IQResult} from '../../typedef/iq/IQResult';
import {QueryGetAccessKey, ResultGetAccessKey} from '../../typedef/iq/basic/GetAccessKey';

export class GetAccessKeyCodec implements IQCodec {

  encodeQueryContent(query: IQQuery): any | null {
    return null;
  }

  encodeResultContent(result: IQResult): any | null {
    if (result instanceof ResultGetAccessKey) {
      return {key: result.key};
    }

    return null;
  }

  decodeQuery(id: string, content: any): IQQuery | null {
    return new QueryGetAccessKey(id);
  }

  decodeResult(id: string, content: any): IQResult | null {
    return new ResultGetAccessKey(id, content['key']);
  }
}

