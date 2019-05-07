import {IQQuery} from 'xiot-core-message-ts/dist/xiot/core/message/typedef/iq/IQQuery';
import {IQResult} from 'xiot-core-message-ts/dist/xiot/core/message/typedef/iq/IQResult';
import {IQError} from 'xiot-core-message-ts/dist/xiot/core/message/typedef/iq/IQError';

export interface XcpClient {

  connect(host: string, port: number, uri: string): Promise<void>;

  disconnect(): void;

  getSerialNumber(): string;

  getProductId(): number;

  getProductVersion(): number;

  getUdid(): string;

  getNextId(): string;

  addQueryHandler(method: string, handler: (query: IQQuery) => void): void;

  sendQuery(query: IQQuery): Promise<IQResult>;

  sendResult(result: IQResult): void;

  sendError(error: IQError): void;
}
