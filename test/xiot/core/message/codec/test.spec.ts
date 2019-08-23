import { expect } from 'chai';
import 'mocha';
import {diff} from 'yajsondiff';

describe('test', async () => {

    it('test json', () => {
        const s1 = '{"iq":{"type":"result","method":"urn:xiot:set-access-key","id":"5014"}}';
        const s2 = '{"iq":{"id":"5014","type":"result","method":"urn:xiot:set-access-key"}}';
        const json1 = JSON.parse(s1);
        const json2 = JSON.parse(s2);
        const differences = diff(json1, json2);

        if (differences == null) {
            expect(true).to.equal(true);
        } else {
            console.log('differences: ', differences);
            expect(JSON.stringify(json1)).to.equal(json2);
        }
    });
});
