'use strict';

const rx = require('rx');
const fs = require('fs');

module.exports = function (path) {
    return rx.Observable.create(function (o) {
        fs.readFile(path, function (err, contents) {
            if (err) {
                o.onError(err);
            }

            o.onNext(contents.toString());
            o.onCompleted();
        })
    });
}
