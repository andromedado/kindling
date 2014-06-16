
var tinder = require('./tinder');
var $ = require('jquery');
var config = require('./config');
var flags = require('../inc/flags');
var announce = require('../inc/announce');
var singletons = {};
var helper = {};

helper.login = function () {
    if (!singletons.login) {
        singletons.login = tinder.login(config.get('fbToken'), config.get('fbId'));
    }
    return singletons.login;
};

helper.getToken = function () {
    return helper.login().then(function (res) {
        if (!res.token) {
            return $.Deferred().reject(res.error || 'No Token');
        }
        return res.token;
    });
};

helper.getPotentialMatches = function () {
    return helper.getToken().then(function(token) {
        return tinder.getPotentialMatches(token);
    });
};

helper.getMatch = function(matchId) {
    return helper.getToken().then(function(token) {
        return tinder.getMatch(matchId, token);
    });
};

helper.likeProfile = function (profileId) {
    return helper.getToken().then(function(token) {
        return tinder.likeProfile(profileId, token);
    });
};

helper.passProfile = function (profileId) {
    return helper.getToken().then(function(token) {
        return tinder.passProfile(profileId, token);
    });
};

helper.getProfile = function () {
    return helper.getToken().then(function(token) {
        return tinder.getProfile(token);
    });
};

helper.getLikesMoments = function () {
    return helper.getToken().then(function (token) {
        return tinder.getLikesMoments(token);
    });
};

//

module.exports = helper;

