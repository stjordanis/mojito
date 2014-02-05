/*
* Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
* Copyrights licensed under the New BSD License.
* See the accompanying LICENSE file for terms.
*/


/*jslint node:true*/

'use strict';

var debug = require('debug')('app'),
    express = require('express'),
    libmojito = require('../../../../..'),
    app,
    mojito;

app = express();
app.set('port', process.env.PORT || 8666);
libmojito.extend(app);
mojito = app.mojito;

app.use(mojito.middleware());
app.mojito.attachRoutes();
app.post('/tunnel', mojito.tunnelMiddleware());

// flickr5
app.get('/flickr5', function (req, res, next) {
    req.param = req.param || {};
    req.param.image = '0';
    req.param.page = '1';
    next();
}, mojito.dispatch('flickr5.index'));

// default
app.get('/:type/:action', function (req, res, next) {
    mojito.dispatch(req.params.type + '.' + req.params.action)(req, res, next);
});

app.get('/status', function (req, res) {
    res.send('200 OK');
});

app.listen(app.get('port'), function () {
    debug('Server listening on port ' + app.get('port') + ' ' +
               'in ' + app.get('env') + ' mode');
});
