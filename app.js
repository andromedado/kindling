
var helper = require('./services/helper');
var announce = require('./inc/announce');

//console.log(helper.login());

helper.login().done(function (a) {
    announce.success('');
    announce.json(a);
}).fail(function (err) {
    announce.error(err, true);
});


//*/