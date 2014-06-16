
var config = {};
var data = require('../config/config.js');

config.get = function (name) {
    return data[name];
};

module.exports = config;

