import {IQQuery} from '../IQQuery';
import {IQResult} from '../IQResult';
import {PropertyOperation} from 'xiot-core-spec-ts/dist/xiot/core/spec/typedef/operation/PropertyOperation';

export const PROPERTIES_CHANGED_METHOD = 'urn:xiot:properties-changed';

export class QueryPropertiesChanged extends IQQuery {

  public oid: string;
  public properties: Array<PropertyOperation>;

  constructor(id: string, oid: string, properties: Array<PropertyOperation>) {
    super(id, PROPERTIES_CHANGED_METHOD);
    this.oid = oid;
    this.properties = properties;
  }

  public result(): ResultPropertiesChanged {
    const result = new ResultPropertiesChanged(this.id, this.properties);
    result.from = this.to;
    result.to = this.from;
    return result;
  }
}

export class ResultPropertiesChanged extends IQResult {

  public properties: Array<PropertyOperation>;

  constructor(id: string, properties: Array<PropertyOperation>) {
    super(id, PROPERTIES_CHANGED_METHOD);
    this.properties = properties;
  }
}
