import {IQQuery} from '../IQQuery';
import {IQResult} from '../IQResult';
import {IQError} from '../IQError';
import {ActionOperation} from 'xiot-core-spec-ts/dist/xiot/core/spec/typedef/operation/ActionOperation';
import {AID} from 'xiot-core-spec-ts/dist/xiot/core/spec/typedef/xid/AID';
import {Argument} from 'xiot-core-spec-ts/dist/xiot/core/spec/typedef/instance/Argument';

export const INVOKE_ACTION_METHOD = 'urn:xiot:invoke-action';

export class QueryInvokeAction extends IQQuery {

  public operation: ActionOperation;

  constructor(id: string, o: ActionOperation) {
    super(id, INVOKE_ACTION_METHOD);
    this.operation = o;
  }

  public result(): ResultInvokeAction {
    const result = new ResultInvokeAction(this.id, this.operation.aid, this.operation.getArgumentsOut());
    result.from = this.to;
    result.to = this.from;
    return result;
  }

  public error(): IQError {
    return super.error(this.operation.status, this.operation.description);
  }
}

export class ResultInvokeAction extends IQResult {

  public aid: AID | null;
  public out: Argument[];

  constructor(id: string, aid: AID | null, out: Argument[]) {
    super(id, INVOKE_ACTION_METHOD);
    this.aid = aid;
    this.out = out;
  }
}
