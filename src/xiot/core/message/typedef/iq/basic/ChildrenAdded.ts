import {IQQuery} from '../IQQuery';
import {IQResult} from '../IQResult';
import {DeviceChild} from 'xiot-core-spec-ts';

export const CHILDREN_ADDED_METHOD = 'urn:xiot:children-added';

export class QueryChildrenAdded extends IQQuery {

  public children: DeviceChild[];

  constructor(id: string, children: DeviceChild[]) {
    super(id, CHILDREN_ADDED_METHOD);
    this.children = children;
  }

  public result(): ResultChildrenAdded {
    const result = new ResultChildrenAdded(this.id);
    result.from = this.to;
    result.to = this.from;
    return result;
  }
}

export class ResultChildrenAdded extends IQResult {

  constructor(id: string) {
    super(id, CHILDREN_ADDED_METHOD);
  }
}
