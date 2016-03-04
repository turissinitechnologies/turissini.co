'use strict';

const rx = require('rx');
const rxpress = require('rxpress');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const loadFile = require('./shared/load/file');


const app = {
    loadFile: function (path) {
        const fullPath = `${__dirname}/${path}`;

        return loadFile(fullPath);
    },

    writeFile: function (path, contents) {
        return rx.Observable.create(function (o) {
            const fullPath = `${__dirname}/${path}`;
            fs.writeFile(fullPath, contents, function (err, res) {
                if (err) {
                    o.onError(err);
                }

                o.onNext(res);
                o.onCompleted();

            });
        });
    }
};

const routes = rx.Observable.fromArray([{
    method: 'get',
    path: '/',
    handler: require('./home/main')
}, {
    method: 'post',
    path: '/contacts',
    handler: require('./lead/main')
}]);

rxpress.create()
    .map((rxpressApp) => {
        rxpressApp.use(bodyParser.json());

        rxpressApp.use('/scripts', express.static(`${__dirname}/../public/scripts`));
        rxpressApp.use('/styles', express.static(`${__dirname}/../public/styles`));
        rxpressApp.use('/images', express.static(`${__dirname}/../public/images`));

        return rxpressApp;
    })
    .flatMapLatest((rxpressApp) => {
        const mappedRoutes = routes.map((route) => {
            route.handler = route.handler.bind(route, app);

            return route;
        });

        return rxpressApp.addRoutes(mappedRoutes);
    })

    .subscribe((rxpressApp) => {
        rxpressApp.listen(8000);
        console.log('Listening on port 8000');
    });
