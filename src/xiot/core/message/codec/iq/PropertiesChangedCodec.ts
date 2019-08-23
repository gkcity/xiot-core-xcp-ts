import {IQCodec} from '../IQCodec';
import {IQQuery} from '../../typedef/iq/IQQuery';
import {IQResult} from '../../typedef/iq/IQResult';
import {PropertyOperationCodec} from 'xiot-core-spec-ts/dist/xiot/core/spec/codec/operation/PropertyOperationCodec';
import {QueryPropertiesChanged, ResultPropertiesChanged} from '../../typedef/iq/basic/PropertiesChanged';

export class PropertiesChangedCodec implements IQCodec {

  encodeQueryContent(query: IQQuery): any | null {
    if (query instanceof QueryPropertiesChanged) {
      const list = PropertyOperationCodec.encodeQuerySET(query.properties);
      return {properties: list};
    }

    return null;
  }

  encodeResultContent(result: IQResult): any | null {
    if (result instanceof ResultPropertiesChanged) {
      const list = PropertyOperationCodec.encodeResultSET(result.properties);
      return {properties: list};
    }

    return null;
  }

  decodeQuery(id: string, content: Object): IQQuery | null {
    const list = PropertyOperationCodec.decodeValues(content);
    return new QueryPropertiesChanged(id, '', list);
  }

  decodeResult(id: string, content: Object): IQResult | null {
    const list = PropertyOperationCodec.decodeStatus(content);
    return new ResultPropertiesChanged(id, list);
  }
}

