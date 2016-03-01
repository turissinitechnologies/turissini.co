'use strict';

const rx = require('rx');
const mustache = require('mustache');
const loadFile = require('./../shared/load/file');

module.exports = function (app, req) {
    return app.loadFile('./shared/mustache/layout.mustache')
        .flatMapLatest((layout) => {
            return app.loadFile(('./home/template.mustache'))
                .map((page) => {
                    return mustache.render(layout, {
                        bodyclass: 'page-home',
                        head: `
                            <link rel="stylesheet" href="/styles/home.css" type="text/css" />
                        `,
                        body: page,
                        footer: `
                            <script src="/scripts/home.js" charset="utf-8"></script>
                        `
                    });
                });
        });
}
