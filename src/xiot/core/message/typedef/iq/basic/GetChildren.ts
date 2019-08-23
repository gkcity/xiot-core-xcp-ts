import {IQQuery} from '../IQQuery';
import {IQResult} from '../IQResult';
import {DeviceChild} from 'xiot-core-spec-ts';

export const GET_CHILDREN_METHOD = 'urn:xiot:get-children';

export class QueryGetChildren extends IQQuery {

  constructor(id: string) {
    super(id, GET_CHILDREN_METHOD);
  }

  public result(children: DeviceChild[]): ResultGetChildren {
    const result = new ResultGetChildren(this.id, children);
    result.from = this.to;
    result.to = this.from;
    return result;
  }
}

export class ResultGetChildren extends IQResult {

  public children: DeviceChild[];

  constructor(id: string, children: DeviceChild[]) {
    super(id, GET_CHILDREN_METHOD);
    this.children = children;
  }
}
