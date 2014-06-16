
var flags = {};
var argv = require('optimist').argv;

flags.value = function (name) {
    return argv[name];
};

flags.subVal = function (name) {
    return flags.value(name);
};

flags.any = function () {
    var yes = false;
    [].slice.apply(arguments).forEach(function (flag) {
        yes = yes || flags.value(flag);
    });
    return yes;
};

module.exports = flags;

