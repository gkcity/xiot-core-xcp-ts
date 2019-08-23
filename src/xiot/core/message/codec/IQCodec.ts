import {IQQuery} from '../typedef/iq/IQQuery';
import {IQResult} from '../typedef/iq/IQResult';

export interface IQCodec {

  encodeQueryContent(query: IQQuery): any | null;

  encodeResultContent(result: IQResult): any | null;

  decodeQuery(id: string, content: any): IQQuery | null;

  decodeResult(id: string, content: any): IQResult | null;
}
