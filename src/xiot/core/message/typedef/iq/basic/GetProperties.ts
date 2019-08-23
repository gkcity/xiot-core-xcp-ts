import {IQQuery} from '../IQQuery';
import {IQResult} from '../IQResult';
import {PropertyOperation} from 'xiot-core-spec-ts/dist/xiot/core/spec/typedef/operation/PropertyOperation';

export const GET_PROPERTIES_METHOD = 'urn:xiot:get-properties';

export class QueryGetProperties extends IQQuery {

  public properties: Array<PropertyOperation>;

  constructor(id: string, properties: Array<PropertyOperation>) {
    super(id, GET_PROPERTIES_METHOD);
    this.properties = properties;
  }

  public result(): ResultGetProperties {
    const result = new ResultGetProperties(this.id, this.properties);
    result.from = this.to;
    result.to = this.from;
    return result;
  }
}

export class ResultGetProperties extends IQResult {

  public properties: Array<PropertyOperation>;

  constructor(id: string, properties: Array<PropertyOperation>) {
    super(id, GET_PROPERTIES_METHOD);
    this.properties = properties;
  }
}
