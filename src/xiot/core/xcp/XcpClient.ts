import {IQError, IQQuery, IQResult} from '../../..';

export interface XcpClient {

  connect(host: string, port: number, uri: string): Promise<void>;

  disconnect(): void;

  getSerialNumber(): string;

  getProductId(): number;

  getProductVersion(): number;

  getUdid(): string;

  getDeviceId(): string;

  getNextId(): string;

  addQueryHandler(method: string, handler: (query: IQQuery) => void): void;

  addDisconnectHandler(handler: () => void): void;

  sendQuery(query: IQQuery): Promise<IQResult>;

  sendResult(result: IQResult): void;

  sendError(error: IQError): void;
}
