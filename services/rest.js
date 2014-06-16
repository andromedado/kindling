
var $ = require('jquery');
var http = require('http');
var https = require('https');
var _ = require('underscore');
var announce = require('../inc/announce');

var defaultOptions = {
    method : 'GET',
    hostname : 'api.gotinder.com',
    port : 443,
    path : '/',
    headers : {
        'User-Agent' : 'Tinder/4.0.1 (iPhone; iOS 7.1.1; Scale/2.00)',
        'Accept-Language' : 'en;q=1, fr;q=0.9, de;q=0.8, zh-Hans;q=0.7, zh-Hant;q=0.6, ja;q=0.5',
        'os_version' : '70000100001',
        'Accept': '*/*',
        'platform': 'ios',
        'app-version' : 79
    }
};
var rest = {};

function buildOptions (basedOn) {
    var headers;
    basedOn = basedOn || {};
    headers = basedOn.headers || {};
    _.defaults(headers, defaultOptions.headers);
    _.defaults(basedOn, defaultOptions);
    basedOn.headers = headers;
    return basedOn;
}

rest.get = function (path, options) {
    return rest.request(_.extend({
        method : 'GET',
        path : path
    }, options));
};

rest['delete'] = function (path, options) {
    return rest.request(_.extend({
        method : 'DELETE',
        path : path
    }, options));
};

rest.post = function (path, payload, options) {
    return rest.request(_.extend({
        method : 'POST',
        path : path
    }, options), payload);
};

rest.request = function () {
    return rest.rawRequest.apply(this, arguments).then(function (resObj) {
        return resObj.data;
    });
};

rest.rawRequest = function (options, payload) {
    var htp;
    var req;
    var def = $.Deferred();
    options = buildOptions(options);
    htp = options.port === 443 ? https : http;

    if (payload) {
        options.headers = options.headers || {};
        if (typeof payload !== 'string') {
            payload = JSON.stringify(payload);
            options.headers['Content-Type'] = 'application/json';
        }
        options.headers['Content-Length'] = payload.length;
    }

    announce.explainRequest(options, payload);
    req = htp.request(options, function (res) {
        var data = '';
        var json = false;
        announce.explainResponseHeaders(res, options);
        if (res.headers && res.headers['content-type'] && res.headers['content-type'].match(/application\/json/i)) {
            json = true;
        }
        res.on('data', function (datum) {
            data += datum;
        });
        res.on('end', function () {
            announce.explainResponseBody(data, options);
            if (json) {
                try {
                    data = JSON.parse(data);
                    if (data.error) {
                        announce.error(data.error, true);
                    }
                } catch (e) {
                    def.reject(e);
                    return;
                }
            }
            def.resolve({
                res : res,
                data : data
            });
        });
    });

    req.on('error', function (err) {
        def.reject(err);
    });

    if (payload) {
        req.write(payload);
    }
    req.end();

    return def.promise();
};

module.exports = rest;

