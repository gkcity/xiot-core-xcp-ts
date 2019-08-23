import {Notice} from '../typedef/notice/Notice';

export interface NoticeCodec {

  encode(notice: Notice): any;

  decode(id: string, content: Object): Notice;
}
