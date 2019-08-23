import {IQ} from './IQ';
import {IQError} from './IQError';
import {IQType} from './IQType';

export class IQQuery extends IQ {

  public method: string;

  constructor(id: string, method: string) {
    super(id, IQType.QUERY);
    this.method = method;
  }

  public error(status: number, description: string): IQError {
    return new IQError(this.id, status, description);
  }
}
