var browserify = require('../');
var vm = require('vm');
var test = require('tap').test;
var through = require('through2');

test('delay for pipelines', function (t) {
    t.plan(2);
    
    var b = browserify(__dirname + '/delay/main.js');
    b.pipeline.get('record').push(through(function (row, enc, next) {
        t.equal(row.file, __dirname + '/delay/main.js');
        row.file = __dirname + '/delay/diverted.js';
        this.push(row);
        next();
    }));
    
    b.bundle(function (err, src) {
        vm.runInNewContext(src, { console: { log: log } });
        function log (msg) {
            t.equal(msg, 900);
        }
    });
});
