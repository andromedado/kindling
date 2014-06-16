
var $ = require('jquery');
var rest = require('./rest');
var util = require('util');
var tinder = {};

function authHeaders(token) {
    return {
        'X-Auth-Token' : token,
        Authorization: util.format('Token token="%s"', token)
    };
}

tinder.login = function (fbToken, fbId) {
    return rest.post('/auth', {
        facebook_token : fbToken,
        facebook_id : fbId
    });
};

tinder.removeMatch = function (matchId, token) {
    return rest.delete(util.format('/users/matches/%s/', matchId), {
        headers : authHeaders(token)
    });
};

tinder.getMatch = function (matchId, token) {
    return rest.get('/user/matches/' + matchId, {
        headers : authHeaders(token)
    }).then(function (res) {
        return res && res.results;
    });
};

tinder.sendMessage = function (matchId, message, token) {
    return rest.post('/user/matches/' + matchId, {
        message : message
    }, {
        headers : authHeaders(token)
    });
};

tinder.likeProfile = function (profileId, token) {
    return rest.get('/like/' + profileId, {
        headers : authHeaders(token)
    }).then(function (res) {
        return res.match;
    });
};

tinder.passProfile = function (profileId, token) {
    return rest.get('/pass/' + profileId, {
        headers : authHeaders(token)
    });
};

tinder.getProfile = function (token) {
    return rest.get('/profile', {
        headers : authHeaders(token)
    });
};

tinder.getLikesMoments = function (token) {
    return rest.post('/feed/moments', {
        last_moment_id : '',
        last_activity_date : ''
    }, {
        headers : authHeaders(token)
    }).then(function (res) {
        return res && res.moments;
    });
};

tinder.getPotentialMatches = function (token) {
    return rest.get('/user/recs', {
        headers : authHeaders(token)
    }).then(function (res) {
        return res && res.results;
    });
};

tinder.getUpdates = function (token) {
    return rest.post('/updates', '{}', {
        headers : authHeaders(token)
    });
};

tinder.setLocation = function (lat, lng, token) {
    return rest.post('/user/ping', {
        lat : lat,
        lon : lng
    }, {
        headers : authHeaders(token)
    })
};

module.exports = tinder;

