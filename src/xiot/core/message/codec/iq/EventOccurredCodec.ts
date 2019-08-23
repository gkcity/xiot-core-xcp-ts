import {IQCodec} from '../IQCodec';
import {IQQuery} from '../../typedef/iq/IQQuery';
import {IQResult} from '../../typedef/iq/IQResult';
import {QueryEventOccurred, ResultEventOccurred} from '../../typedef/iq/basic/EventOccurred';
import {EID, EventOperationCodec} from 'xiot-core-spec-ts';

export class EventOccurredCodec implements IQCodec {

  encodeQueryContent(query: IQQuery): any | null {
    if (query instanceof QueryEventOccurred) {
      return EventOperationCodec.encodeOneQuery(query.operation);
    }

    return null;
  }

  encodeResultContent(result: IQResult): any | null {
    if (result instanceof ResultEventOccurred) {
      return {
        eid: result.eid ? result.eid.toString() : '',
      };
    }

    return null;
  }

  decodeQuery(id: string, content: any): IQQuery | null {
    return new QueryEventOccurred(id, EventOperationCodec.decodeOneQuery(content));
  }

  decodeResult(id: string, content: any): IQResult | null {
    let eid = 'a.0.0';
    if (content) {
      eid = content.eid || 'a.0.0';
    }

    return new ResultEventOccurred(id, EID.parseString(eid));
  }
}

