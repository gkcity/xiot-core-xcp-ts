import {XcpMessage} from '../XcpMessage';
import {IQType} from './IQType';

export const IQ_TYPE = 'type';
export const IQ_METHOD = 'method';
export const IQ_CONTENT = 'content';

export class IQ extends XcpMessage {

  public type: IQType;
  public content: any;

  constructor(id: string, type: IQType) {
    super(id);
    this.type = type;
  }
}
