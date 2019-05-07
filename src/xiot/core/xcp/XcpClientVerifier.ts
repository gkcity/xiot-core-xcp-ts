import {XcpSessionKey} from './common/XcpSessionKey';

export interface XcpClientVerifier {

  start(): Promise<XcpSessionKey>;
}