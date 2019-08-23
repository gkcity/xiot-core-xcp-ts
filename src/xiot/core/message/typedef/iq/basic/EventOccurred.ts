import {IQQuery} from '../IQQuery';
import {IQResult} from '../IQResult';
import {AID, EID, EventOperation} from 'xiot-core-spec-ts';

export const EVENT_OCCURRED_METHOD = 'urn:xiot:event-occurred';

export class QueryEventOccurred extends IQQuery {

  public operation: EventOperation;

  constructor(id: string, o: EventOperation) {
    super(id, EVENT_OCCURRED_METHOD);
    this.operation = o;
  }

  public result(): ResultEventOccurred {
    const result = new ResultEventOccurred(this.id, this.operation.eid);
    result.from = this.to;
    result.to = this.from;
    return result;
  }
}

export class ResultEventOccurred extends IQResult {

  public eid: AID | null;

  constructor(id: string, eid: EID | null) {
    super(id, EVENT_OCCURRED_METHOD);
    this.eid = eid;
  }
}
