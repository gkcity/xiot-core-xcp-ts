import {IQQuery} from '../IQQuery';
import {IQResult} from '../IQResult';

export const CHILDREN_REMOVED_METHOD = 'urn:xiot:children-removed';

export class QueryChildrenRemoved extends IQQuery {

  public children: string[];

  constructor(id: string, children: string[]) {
    super(id, CHILDREN_REMOVED_METHOD);
    this.children = children;
  }

  public result(): ResultChildrenRemoved {
    const result = new ResultChildrenRemoved(this.id);
    result.from = this.to;
    result.to = this.from;
    return result;
  }
}

export class ResultChildrenRemoved extends IQResult {

  constructor(id: string) {
    super(id, CHILDREN_REMOVED_METHOD);
  }
}
