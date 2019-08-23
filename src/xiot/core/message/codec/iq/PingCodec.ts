import {IQCodec} from '../IQCodec';
import {IQQuery} from '../../typedef/iq/IQQuery';
import {IQResult} from '../../typedef/iq/IQResult';
import {QueryPing, ResultPing} from '../../typedef/iq/basic/Ping';

export class PingCodec implements IQCodec {

  encodeQueryContent(query: IQQuery): any | null {
    return null;
  }

  encodeResultContent(result: IQResult): any | null {
    return null;
  }

  decodeQuery(id: string, content: any): IQQuery | null {
    return new QueryPing(id);
  }

  decodeResult(id: string, content: any): IQResult | null {
    return new ResultPing(id);
  }
}
