
var Hapi = require('hapi');

var server = new Hapi.Server(3030, 'localhost');
var helper = require('./services/helper');
var $ = require('jquery');
var _ = require('underscore');

server.route({
    path : '/html/{path*}',
    method : 'GET',
    handler : {
        directory : {
            path : './html'
        }
    }
});

server.route({
    path : '/api/command/{command}',
    method : 'GET',
    handler : function (req, reply) {
        var command = req.params.command;
        if (helper[command]) {
            ((helper[command])()).then(function (result) {
                reply(result);
            }, function (err) {
                reply(err);
            });
        }
    }
});

server.route({
    path : '/api/command/{command}/{arg}',
    method : 'GET',
    handler : function (req, reply) {
        var command = req.params.command;
        if (helper[command]) {
            ((helper[command])(req.params.arg)).then(function (result) {
                reply(result);
            }, function (err) {
                reply(err);
            });
        }
    }
});

server.start(function () {
    console.log('Hapi server started @', server.info.uri);
});

