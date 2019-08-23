import {IQCodec} from '../IQCodec';
import {IQQuery} from '../../typedef/iq/IQQuery';
import {IQResult} from '../../typedef/iq/IQResult';
import {DeviceChildCodec} from 'xiot-core-spec-ts';
import {QueryChildrenAdded, ResultChildrenAdded} from '../../typedef/iq/basic/ChildrenAdded';

export class ChildrenAddedCodec implements IQCodec {

  encodeQueryContent(query: IQQuery): any | null {
    if (query instanceof QueryChildrenAdded) {
      return {children: DeviceChildCodec.encodeArray(query.children)};
    }

    return null;
  }

  encodeResultContent(result: IQResult): any | null {
    return null;
  }

  decodeQuery(id: string, content: any): IQQuery | null {
    return new QueryChildrenAdded(id, DeviceChildCodec.decodeArray(content.children));
  }

  decodeResult(id: string, content: any): IQResult | null {
    return new ResultChildrenAdded(id);
  }
}

