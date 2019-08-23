import {IQCodec} from '../IQCodec';
import {IQQuery} from '../../typedef/iq/IQQuery';
import {IQResult} from '../../typedef/iq/IQResult';
import {QueryInvokeAction, ResultInvokeAction} from '../../typedef/iq/basic/InvokeAction';
import {ActionOperationCodec} from 'xiot-core-spec-ts';
import {ArgumentOperationCodec} from 'xiot-core-spec-ts/dist/xiot/core/spec/codec/operation/ArgumentOperationCodec';

export class InvokeActionCodec implements IQCodec {

  encodeQueryContent(query: IQQuery): any | null {
    if (query instanceof QueryInvokeAction) {
      return ActionOperationCodec.encodeOneQuery(query.operation);
    }

    return null;
  }

  encodeResultContent(result: IQResult): any | null {
    if (result instanceof ResultInvokeAction) {
      return {
        aid: result.aid ? result.aid.toString() : '',
        out: ArgumentOperationCodec.encodeArray(result.out)
      };
    }

    return null;
  }

  decodeQuery(id: string, content: any): IQQuery | null {
    return new QueryInvokeAction(id, ActionOperationCodec.decodeOneQuery(content));
  }

  decodeResult(id: string, content: any): IQResult | null {
    const aid = content.aid;
    const out = ArgumentOperationCodec.decodeArray(content.out);
    return new ResultInvokeAction(id, aid, out);
  }
}

