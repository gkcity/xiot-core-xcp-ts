import {IQCodec} from '../IQCodec';
import {IQQuery} from '../../typedef/iq/IQQuery';
import {IQResult} from '../../typedef/iq/IQResult';
import {QueryChildrenRemoved, ResultChildrenRemoved} from '../../typedef/iq/basic/ChildrenRemoved';

export class ChildrenRemovedCodec implements IQCodec {

  encodeQueryContent(query: IQQuery): any | null {
    if (query instanceof QueryChildrenRemoved) {
      return {children: query.children};
    }

    return null;
  }

  encodeResultContent(result: IQResult): any | null {
    return null;
  }

  decodeQuery(id: string, content: any): IQQuery | null {
    return new QueryChildrenRemoved(id, content.children);
  }

  decodeResult(id: string, content: any): IQResult | null {
    return new ResultChildrenRemoved(id);
  }
}

