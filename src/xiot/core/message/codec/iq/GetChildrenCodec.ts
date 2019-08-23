import {IQCodec} from '../IQCodec';
import {IQQuery} from '../../typedef/iq/IQQuery';
import {IQResult} from '../../typedef/iq/IQResult';
import {QueryGetChildren, ResultGetChildren} from '../../typedef/iq/basic/GetChildren';
import {DeviceChildCodec} from 'xiot-core-spec-ts';

export class GetChildrenCodec implements IQCodec {

  encodeQueryContent(query: IQQuery): any | null {
    return null;
  }

  encodeResultContent(result: IQResult): any | null {
    if (result instanceof ResultGetChildren) {
      return {children: DeviceChildCodec.encodeArray(result.children)};
    }

    return null;
  }

  decodeQuery(id: string, content: any): IQQuery | null {
    return new QueryGetChildren(id);
  }

  decodeResult(id: string, content: any): IQResult | null {
    return new ResultGetChildren(id, DeviceChildCodec.decodeArray(content['children']));
  }
}

