import {IQCodec} from './IQCodec';
import {NoticeCodec} from './NoticeCodec';
import {INITIALIZE_METHOD} from '../typedef/iq/basic/Initialize';
import {InitializeCodec} from './iq/InitializeCodec';
import {VERIFY_START_METHOD} from '../typedef/iq/basic/VerifyStart';
import {VerifyStartCodec} from './iq/VerifyStartCodec';
import {VerifyFinishCodec} from './iq/VerifyFinishCodec';
import {VERIFY_FINISH_METHOD} from '../typedef/iq/basic/VerifyFinish';
import {SetPropertiesCodec} from './iq/SetPropertiesCodec';
import {SET_PROPERTIES_METHOD} from '../typedef/iq/basic/SetProperties';
import {GetPropertiesCodec} from './iq/GetPropertiesCodec';
import {GET_PROPERTIES_METHOD} from '../typedef/iq/basic/GetProperties';
import {PropertiesChangedCodec} from './iq/PropertiesChangedCodec';
import {PROPERTIES_CHANGED_METHOD} from '../typedef/iq/basic/PropertiesChanged';
import {InvokeActionCodec} from './iq/InvokeActionCodec';
import {INVOKE_ACTION_METHOD} from '../typedef/iq/basic/InvokeAction';
import {GetAccessKeyCodec} from './iq/GetAccessKeyCodec';
import {SetAccessKeyCodec} from './iq/SetAccessKeyCodec';
import {GET_ACCESS_KEY_METHOD} from '../typedef/iq/basic/GetAccessKey';
import {SET_ACCESS_KEY_METHOD} from '../typedef/iq/basic/SetAccessKey';
import {ByebyeCodec} from './iq/ByebyeCodec';
import {BYEBYE_METHOD} from '../typedef/iq/basic/Byebye';
import {XcpMessage} from '../typedef/XcpMessage';
import {IQ} from '../typedef/iq/IQ';
import {IQType, IQTypeFromString, IQTypeToString} from '../typedef/iq/IQType';
import {IQQuery} from '../typedef/iq/IQQuery';
import {IQResult} from '../typedef/iq/IQResult';
import {IQError} from '../typedef/iq/IQError';
import {PING_METHOD} from '../typedef/iq/basic/Ping';
import {PingCodec} from './iq/PingCodec';
import {EventOccurredCodec} from './iq/EventOccurredCodec';
import {EVENT_OCCURRED_METHOD} from '../typedef/iq/basic/EventOccurred';
import {GetChildrenCodec} from './iq/GetChildrenCodec';
import {GET_CHILDREN_METHOD} from '../typedef/iq/basic/GetChildren';
import {CHILDREN_ADDED_METHOD} from '../typedef/iq/basic/ChildrenAdded';
import {CHILDREN_REMOVED_METHOD} from '../typedef/iq/basic/ChildrenRemoved';
import {ChildrenAddedCodec} from './iq/ChildrenAddedCodec';
import {ChildrenRemovedCodec} from './iq/ChildrenRemovedCodec';

export class XcpMessageCodec {

  private iqCodecs: Map<String, IQCodec>;
  private noticeCodecs: Map<String, NoticeCodec>;

  constructor() {
    this.iqCodecs = new Map<String, IQCodec>();
    this.noticeCodecs = new Map<String, NoticeCodec>();

    this.iqCodecs.set(INITIALIZE_METHOD, new InitializeCodec());
    this.iqCodecs.set(VERIFY_START_METHOD, new VerifyStartCodec());
    this.iqCodecs.set(VERIFY_FINISH_METHOD, new VerifyFinishCodec());
    this.iqCodecs.set(SET_PROPERTIES_METHOD, new SetPropertiesCodec());
    this.iqCodecs.set(GET_PROPERTIES_METHOD, new GetPropertiesCodec());
    this.iqCodecs.set(PROPERTIES_CHANGED_METHOD, new PropertiesChangedCodec());
    this.iqCodecs.set(INVOKE_ACTION_METHOD, new InvokeActionCodec());
    this.iqCodecs.set(EVENT_OCCURRED_METHOD, new EventOccurredCodec());
    this.iqCodecs.set(GET_ACCESS_KEY_METHOD, new GetAccessKeyCodec());
    this.iqCodecs.set(SET_ACCESS_KEY_METHOD, new SetAccessKeyCodec());
    this.iqCodecs.set(BYEBYE_METHOD, new ByebyeCodec());
    this.iqCodecs.set(PING_METHOD, new PingCodec());
    this.iqCodecs.set(GET_CHILDREN_METHOD, new GetChildrenCodec());
    this.iqCodecs.set(CHILDREN_ADDED_METHOD, new ChildrenAddedCodec());
    this.iqCodecs.set(CHILDREN_REMOVED_METHOD, new ChildrenRemovedCodec());
  }

  public encode(m: XcpMessage): any | null {
    if (m instanceof IQ) {
      return this.encodeIQ(m);
    }

    return null;
  }

  private encodeIQ(iq: IQ): any | null {
    if (iq instanceof IQQuery) {
      return this.encodeQuery(iq);
    }

    if (iq instanceof IQResult) {
      return this.encodeResult(iq);
    }

    if (iq instanceof IQError) {
      return this.encodeError(iq);
    }

    return null;
  }

  private encodeQuery(query: IQQuery): any | null {
    const iq = {
      id: query.id,
      type: IQTypeToString(query.type),
      method: query.method,
      from: query.from,
      to: query.to,
    };
    this.addQueryContent(iq, query);
    return {iq: iq};
  }

  private addQueryContent(o: any, query: IQQuery) {
    const codec = this.iqCodecs.get(query.method);
    if (codec != null) {
      const content = codec.encodeQueryContent(query);
      if (content != null) {
        o['content'] = content;
      }
    }
  }

  private encodeResult(result: IQResult): any {
    const iq = {
      id: result.id,
      type: IQTypeToString(result.type),
      method: result.method,
      from: result.from,
      to: result.to
    };
    this.addResultContent(iq, result);
    return {iq: iq};
  }

  private addResultContent(o: any, result: IQResult) {
    const codec = this.iqCodecs.get(result.method);
    if (codec != null) {
      const content = codec.encodeResultContent(result);
      if (content != null) {
        o['content'] = content;
      }
    }
  }

  private encodeError(error: IQError): any {
    const e = {
      id: error.id,
      type: IQTypeToString(error.type),
      from: error.from,
      to: error.to,
      content: {
        status: error.status,
        description: error.description
      }
    };

    return {iq: e};
  }

  public decode(string: string): XcpMessage | null {
    const o = JSON.parse(string);
    const iq = o['iq'];
    if (iq != null) {
      return this.decodeIQ(iq);
    } else {
      console.log('iq is null');
    }

    return null;
  }

  private decodeIQ(o: any): IQ | null {
    const id = o['id'];
    const type = o['type'];
    const method = o['method'];
    const from = o['from'];
    const to = o['to'];
    const content = o['content'];

    switch (IQTypeFromString(type)) {
      case IQType.QUERY:
        return this.decodeQuery(id, method, from, to, content);

      case IQType.RESULT:
        return this.decodeResult(id, method, from, to, content);

      case IQType.ERROR:
        return this.decodeError(id, from, to, content);

      default:
        return null;
    }
  }

  private decodeQuery(id: string, method: string, from: string, to: string, content: any): IQQuery | null {
    let query: IQQuery | null;

    const codec = this.iqCodecs.get(method);
    if (codec != null) {
      query = codec.decodeQuery(id, content);
    } else {
      query = new IQQuery(id, method);
    }

    if (query) {
      query.from = from;
      query.to = to;
    }

    return query;
  }

  private decodeResult(id: string, method: string, from: string, to: string, content: any): IQResult | null {
    let result: IQResult | null;

    const codec = this.iqCodecs.get(method);
    if (codec != null) {
      result = codec.decodeResult(id, content);
    } else {
      result = new IQQuery(id, method);
    }

    if (result) {
      result.from = from;
      result.to = to;
    }

    return result;
  }

  private decodeError(id: string, from: string, to: string, content: any): IQError | null {
    if (content != null) {
      const status = content['status'];
      const description = content['description'];
      const error = new IQError(id, status, description);
      error.from = from;
      error.to = to;
      return error;
    }

    return null;
  }
}
