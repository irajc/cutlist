var assert = require('assert');

var common = require('./common');
var Slate = common.Slate;
var Rectangle = common.Rectangle;
var Part = common.Part;
var Guillotine = require('./guillotine');

describe('Guillotine', () => {
    describe('#apply()', () => {
        it('should return empty result for no parts', () => {
            var guillotine = new Guillotine('v');
            var res = guillotine.apply(new Slate(new Rectangle(0, 0, 0, 0)), []);

            assert.equal(0, res.result.length);
            assert.equal(0, res.cuts.length);
        });

        it('should return correct vertical cut', () => {
            var guillotine = new Guillotine('v');
            var parts = [{
                name: 'a',
                w: 600,
                h: 200,
                canRotate: true
            }, {
                name: 'b',
                w: 300,
                h: 200,
                canRotate: true
            }, {
                name: 'c',
                w: 800,
                h: 200,
                canRotate: true
            }, {
                name: 'd',
                w: 400,
                h: 300,
                canRotate: true
            }, {
                name: 'e',
                w: 400,
                h: 500,
                canRotate: true
            }, {
                name: 'f',
                w: 400,
                h: 500,
                canRotate: true
            }].map(function (part) {
                return new Part(part.name, part.w, part.h, part.canRotate);
            });

            var res = guillotine.apply(new Slate(new Rectangle(0, 0, 1000, 1000)), parts);

            assert.equal(6, res.result.length);
            assert.equal(8, res.cuts.length);
            assert.deepEqual({'result':[{'name':'c','x':0,'y':0,'w':800,'h':200},{'name':'a','x':800,'y':0,'w':200,'h':600},{'name':'e','x':0,'y':200,'w':400,'h':500},{'name':'f','x':400,'y':200,'w':400,'h':500},{'name':'d','x':400,'y':700,'w':400,'h':300},{'name':'b','x':0,'y':700,'w':300,'h':200}],'cuts':[{'name':'c','x1':800,'y1':0,'x2':800,'y2':1000},{'name':'c','x1':0,'y1':200,'x2':800,'y2':200},{'name':'a','x1':800,'y1':600,'x2':1000,'y2':600},{'name':'e','x1':400,'y1':200,'x2':400,'y2':1000},{'name':'e','x1':0,'y1':700,'x2':400,'y2':700},{'name':'f','x1':400,'y1':700,'x2':800,'y2':700},{'name':'b','x1':300,'y1':700,'x2':300,'y2':1000},{'name':'b','x1':0,'y1':900,'x2':300,'y2':900}]}, res);
        });

        it('should return correct horizontal cut', () => {
            var guillotine = new Guillotine('h');
            var parts = [{
                name: 'a',
                w: 600,
                h: 200,
                canRotate: true
            }, {
                name: 'b',
                w: 300,
                h: 200,
                canRotate: true
            }, {
                name: 'c',
                w: 800,
                h: 200,
                canRotate: true
            }, {
                name: 'd',
                w: 400,
                h: 300,
                canRotate: true
            }, {
                name: 'e',
                w: 400,
                h: 500,
                canRotate: true
            }, {
                name: 'f',
                w: 400,
                h: 500,
                canRotate: true
            }].map(function (part) {
                return new Part(part.name, part.w, part.h, part.canRotate);
            });

            var res = guillotine.apply(new Slate(new Rectangle(0, 0, 1000, 1000)), parts);

            assert.equal(6, res.result.length);
            assert.equal(8, res.cuts.length);
            assert.deepEqual({'result':[{'name':'e','x':0,'y':0,'w':500,'h':400},{'name':'f','x':500,'y':0,'w':500,'h':400},{'name':'d','x':0,'y':400,'w':300,'h':400},{'name':'c','x':0,'y':800,'w':800,'h':200},{'name':'a','x':300,'y':400,'w':600,'h':200},{'name':'b','x':300,'y':600,'w':300,'h':200}],'cuts':[{'name':'e','x1':500,'y1':0,'x2':500,'y2':400},{'name':'e','x1':0,'y1':400,'x2':1000,'y2':400},{'name':'d','x1':300,'y1':400,'x2':300,'y2':800},{'name':'d','x1':0,'y1':800,'x2':1000,'y2':800},{'name':'c','x1':800,'y1':800,'x2':800,'y2':1000},{'name':'a','x1':900,'y1':400,'x2':900,'y2':600},{'name':'a','x1':300,'y1':600,'x2':1000,'y2':600},{'name':'b','x1':600,'y1':600,'x2':600,'y2':800}]}, res);
        });
    });
});
