import { expect } from 'chai';
import {diff} from 'yajsondiff';
import 'mocha';
import * as fs from 'async-file';
import {XcpMessageCodec} from '../../../../../src';

describe('XcpMessageCodec', async () => {

    const folder = './resources/message/';
    const dir = await fs.readdir(folder);

    it('reading message, folder: ' + folder, () => {
        expect(true).to.equal(true);
    });

    const codec: XcpMessageCodec = new XcpMessageCodec();

    for (const file of dir) {
        it('  check: ' + file, async () => {

            const a = await fs.readFile(folder + file);
            const oldJson = JSON.parse(a.toString());
            const message = codec.decode(a.toString());

            if (message == null) {
                console.log('message invalid: ', a.toString());
                expect(JSON.stringify(oldJson)).to.equal('null');
                return;
            }

            const newJson = codec.encode(message);
            const differences = diff(oldJson, newJson);
            if (differences == null) {
                expect(true).to.equal(true);
            } else {
                console.log('differences: ', differences);
                expect(JSON.stringify(oldJson)).to.equal(JSON.stringify(newJson));
            }
        });
    }
});
