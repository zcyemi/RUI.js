import {RUIContainer, RUILabel} from '../../../src/script/rui';

import * as mocha from 'mocha';
import * as chai from 'chai';


const expect = chai.expect;

describe('RUIContainer-Add-Children',()=>{
    it('Same-Child',()=>{
        let c = new RUIContainer();
        const label = new RUILabel('label');
        c.addChild(label);
        c.addChild(label);

        expect(c.children.length).to.equal(1);
    });
    it('Null-Child',()=>{
        let c = new RUIContainer();
        c.addChild(null);
        expect(c.children.length).to.equal(0);
    });
    it('Add-Self',()=>{
        let c = new RUIContainer();
        c.addChild(c);
        expect(c.children.length).to.equal(0);
    });
})