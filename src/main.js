'use strict';

const rx = require('rx');
const rxpress = require('rxpress');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const mustache = require('mustache');
const ImmutableMap = require('immutable').Map;
const ImmutableList = require('immutable').List;
const _ = require('lodash');

const loadFile = require('./shared/load/file');

function createEmbedded (packageName) {
    const module = require(packageName);
    const pathToServerModule = 'server';
    const pathToClientModule = 'client';

    function getNodeModuleFilePath (path) {
        return `./node_modules/${packageName}/${path}`;
    }

    return _.extend({
        packageName: packageName,
        serverController: require(`${packageName}/${pathToServerModule}`),
        fileExistsInPackage: function (path) {
            return rx.Observable.create((o) => {
                const fullPath = getNodeModuleFilePath(path);

                fs.exists(fullPath, (exists) => {
                    o.onNext(exists);
                    o.onCompleted();
                });
            });
        }
    }, module);
}

const headerPackage = createEmbedded('turissinico-header');

function renderEmbeddedPackage (app, req, res, page, embedded, location) {
    return embedded.fileExistsInPackage('client.js')
        .map((exists) => {
            if (exists) {
                return page.update('scripts', function (l) {
                    return l.push(`/scripts/${embedded.packageName}.js`);
                });
            }

            return page;

        })
        .flatMapLatest((scriptsPage) => {
            return embedded.fileExistsInPackage('client.css')
                .map((exists) => {
                    if (exists) {
                        return scriptsPage.update('styles', function (l) {
                            return l.push(`/styles/${embedded.packageName}.css`);
                        });
                    } else {
                        return scriptsPage;
                    }
                });
        })
        .flatMapLatest((p) => {
            return embedded.serverController(app, req).map((contents) => {
                return p.set(location, contents);
            });
        })
        .map((p) => {
            return p.set('bodyclass', embedded.bodyclass);
        })
}

const app = {
    routePackages: [],
    embededPackages: [],

    createHandler: function (embedded) {
        return function (req, res) {
            return app.loadFile('./shared/mustache/layout.mustache')
                .map((layout) => {
                    return ImmutableMap({
                        layout: layout,
                        styles: ImmutableList(),
                        scripts: ImmutableList()
                    });
                })
                .flatMapLatest((page) => {
                    return app.packages().reduce((seed, p) => {
                        return seed.flatMapLatest((set) => {
                            return renderEmbeddedPackage(app, req, res, set, p.package, p.placement);
                        });
                    }, rx.Observable.return(page))
                    .flatMapLatest((obs) => {
                        return obs;
                    });
                })
                .flatMapLatest((page) => {
                    return renderEmbeddedPackage(app, req, res, page, embedded, 'body');
                })
                .map((fullPage) => {
                    return fullPage.toJS();
                })
                .map((pageObj) => {
                    return mustache.render(pageObj.layout, pageObj);
                });
        }
    },

    loadFile: function (path, dirname) {
        dirname = dirname || __dirname;
        const fullPath = `${dirname}/${path}`;

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
    },

    addPackage: function (path, placement) {
        this.embededPackages.push({
            package: createEmbedded(path),
            placement: placement
        });
    },

    addRoutePackage: function (path, verb, packageName) {
        const embeddedPackage = createEmbedded(packageName);

        this.routePackages.push({
            method: verb,
            path: path,
            package: embeddedPackage,
            handler: app.createHandler(embeddedPackage)
        });
    },

    routes: function () {
        return rx.Observable.fromArray(this.routePackages);
    },

    packages: function () {
        return rx.Observable.fromArray(this.embededPackages);
    }
};


app.addRoutePackage('/', 'get', 'turissinico-home');
app.addPackage('turissinico-header', 'header');
app.addRoutePackage('/javascript-playground/spring-physics-animation', 'get', 'turissinico-springplayground');


rxpress.create()
    .map((rxpressApp) => {
        rxpressApp.use(bodyParser.json());

        rxpressApp.use('/images', express.static(`${__dirname}/../src/images`));
        rxpressApp.use('/styles', express.static(`${__dirname}/../public/styles`));


        rxpressApp.use(`/:package_name/images/:image_name`, function (req, res) {
            const packageName = req.params.package_name;
            const imageName = `./node_modules/${packageName}/src/images/${req.params.image_name}`;

            fs.exists(imageName, function (exists) {
                if (exists) {
                    fs.readFile(imageName, function (err, contents) {
                        res.write(contents);
                        res.end();
                    })
                } else {
                    res.status(404);
                    res.end();
                }
            });
        });

        rxpressApp.use(`/scripts/:package_name.js`, function (req, res) {
            const packageName = req.params.package_name;
            const path = `./node_modules/${packageName}/client.js`;

            fs.exists(path, function (exists){
                if (exists) {
                    fs.readFile(path, function (err, contents) {
                        res.header('Content-Type', 'script/javascript');
                        res.write(contents.toString());
                        res.end();
                    })
                } else {
                    res.status(404);
                    res.end();
                }
            });
        });

        rxpressApp.use(`/styles/:package_name.css`, function (req, res) {
            const packageName = req.params.package_name;
            const path = `./node_modules/${packageName}/client.css`;

            fs.exists(path, function (exists){
                if (exists) {
                    fs.readFile(path, function (err, contents) {
                        res.header('Content-Type', 'text/css');
                        res.write(contents.toString());
                        res.end();
                    })
                } else {
                    res.status(404);
                    res.end();
                }
            });
        });


        return rxpressApp;
    })
    .flatMapLatest((rxpressApp) => {
        const mappedRoutes = app.routes().map((route) => {
            route.handler = route.handler.bind(route, app);

            return route;
        });

        return rxpressApp.addRoutes(mappedRoutes);
    })

    .subscribe((rxpressApp) => {
        rxpressApp.listen(8000);
        console.log('Listening on port 8000');
    });
