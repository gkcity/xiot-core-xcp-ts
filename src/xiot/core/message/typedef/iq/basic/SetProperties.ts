import {IQQuery} from '../IQQuery';
import {IQResult} from '../IQResult';
import {PropertyOperation} from 'xiot-core-spec-ts/dist/xiot/core/spec/typedef/operation/PropertyOperation';

export const SET_PROPERTIES_METHOD = 'urn:xiot:set-properties';

export class QuerySetProperties extends IQQuery {

  public oid: string;
  public properties: Array<PropertyOperation>;

  constructor(id: string, oid: string, properties: Array<PropertyOperation>) {
    super(id, SET_PROPERTIES_METHOD);
    this.oid = oid;
    this.properties = properties;
  }

  public result(): ResultSetProperties {
    const result = new ResultSetProperties(this.id, this.properties);
    result.from = this.to;
    result.to = this.from;
    return result;
  }
}

export class ResultSetProperties extends IQResult {

  public properties: Array<PropertyOperation>;

  constructor(id: string, properties: Array<PropertyOperation>) {
    super(id, SET_PROPERTIES_METHOD);
    this.properties = properties;
  }
}
