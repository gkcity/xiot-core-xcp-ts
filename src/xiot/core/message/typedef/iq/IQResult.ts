import {IQ} from './IQ';
import {IQType} from './IQType';

export class IQResult extends IQ {

  public method: string;

  constructor(id: string, method: string) {
    super(id, IQType.RESULT);
    this.method = method;
  }
}
