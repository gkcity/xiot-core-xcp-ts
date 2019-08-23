import {IQ} from './IQ';
import {IQType} from './IQType';

export const IQ_ERROR_STATUS = 'status';
export const IQ_ERROR_DESCRIPTION = 'description';

export class IQError extends IQ {

  public status: number;
  public description: string;

  public constructor(id: string, status: number, description: string) {
    super(id, IQType.ERROR);
    this.status = status;
    this.description = description;
  }
}
