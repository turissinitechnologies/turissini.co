'use strict';

const rx = require('rx');
const rxpress = require('rxpress');
const express = require('express');

const loadFile = require('./shared/load/file');


const app = {
    loadFile: function (path) {
        const fullPath = `${__dirname}/${path}`;

        return loadFile(fullPath);
    }
};

const routes = rx.Observable.fromArray([{
    method: 'get',
    path: '/',
    handler: require('./home/main')
}]);

rxpress.create()
    .map((rxpressApp) => {
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
        rxpressApp.listen(3000);
    });
