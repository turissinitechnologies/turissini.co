'use strict';

const rx = require('rx');
const fs = require('fs');

module.exports = function (app, req) {
    const date = new Date();

    return app.writeFile('./shared/contacts/' + date + '.json', JSON.stringify(req.body, null, '\t'))
        .map(() => {
            return JSON.stringify({
                success: true
            });
        });

};
