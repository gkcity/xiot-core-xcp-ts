export const XCP_MSG_IQ = 'iq';
export const XCP_MSG_NOTICE = 'notice';
export const XCP_MSG_ID = 'id';
export const XCP_MSG_FROM = 'from';
export const XCP_MSG_TO = 'to';

export class XcpMessage {

  public id: string;
  public from: string;
  public to: string;

  constructor(id: string) {
    this.id = id;
    this.from = '';
    this.to = '';
  }
}
