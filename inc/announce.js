
var id = 1;
var flags = require('./flags');
var bar = require('../config/bar');
var util = require('util');
var colors = require('colors');
var crypto = require('crypto');
var optId = 1;
var optLookup = {};
var fs = require('fs');
var canWriteToLog = true;

var starBar = require('../config/starBar');

function output (str) {
    //Clean/No-Format str would be str.stripColors
    console.log(str);
    if ((flags.subVal('logFile') || flags.value('log')) && canWriteToLog) {
        fs.appendFile(flags.value('logFile'), (str.stripColors) + '\n', function (err) {
            var sayIt;
            if (err) {
                sayIt = canWriteToLog;
                canWriteToLog = false;
                if (sayIt) {
                    error('Can\'t write to log: ' + err, true);
                }
            }
        });
    }
}

function barBreak () {
    output(bar.grey);
}

function infoBlocks(blocks) {
    if (flags.value('silent')) {
        return;
    }
    var lines = [bar];
    blocks.forEach(function (el) {
        lines.push(el);
        lines.push(bar);
    });
    output(lines.join('\n').grey);
}

function hashOptions(options) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(JSON.stringify(options));
    return sha1.digest('base64');
}

function getOptId(options) {
    var hash = hashOptions(options);
    if (!optLookup[hash]) {
        optLookup[hash] = optId++;
    }
    return optLookup[hash];
}

function requestToText(options) {
    return util.format('[%d] %s\nhttp://%s:%d%s', getOptId(options), options.method, options.hostname, options.port, options.path);
}

function explainRequest(options, payload) {
    if (flags.any('showRequests', 'showPayloads')) {
        barBreak();
    }
    if (flags.value('showRequests')) {
        output('Making Request:'.yellow);
        output(requestToText(options));
        if (options.headers) {
            output(util.format(' -> Headers: %s', JSON.stringify(options.headers, void 0, ' ')));
        }
    }
    if (flags.value('showPayloads')) {
        if (payload) {
            output('Payload:'.yellow);
            output(JSON.stringify(payload, void 0, ' '));
        } else {
            output('No Payload'.yellow);
        }
    }
}

function explainResponseHeaders(res, options) {
    if (!flags.value('showResponses')) {
        return;
    }
    barBreak();
    output(util.format('Response Headers to %s'.yellow, requestToText(options)));
    output(util.format('HTTP %s: %s', res.httpVersion, res.statusCode));
    output(util.format('Headers : %s', JSON.stringify(res.headers, void 0, ' ')));
}

function explainResponseBody (body, options) {
    if (!flags.value('showResponseBodies')) {
        return;
    }
    barBreak();
    output(util.format('Response Body to %s'.yellow, requestToText(options)));
    output(body);
}

function announceUser(user) {
    output(util.format('Acting as User Id %s %s'.cyan, user.id, user.profile && user.profile.email || ''));
}

//Key information
function keyInfo (what) {
    if (flags.value('dontAnnounceKeyInfo')) {
        return;
    }
    if (arguments.length > 1) {
        what = util.format.apply(util, arguments);
    }
    output(util.format('%s'.cyan, what));
}

//Less important info
function minorInfo (what) {
    if (flags.value('dontAnnounceMinorInfo')) {
        return;
    }
    if (arguments.length > 1) {
        what = util.format.apply(util, arguments);
    }
    output(util.format('...%s'.grey, what));
}

function error (err, force) {
    if (!force && !flags.value('verbose')) {
        minorInfo('suppressing errors. use `verbose` if you really want them all');
        return;
    }
    output(util.format('Error: %s'.red.bold, err));
}

function success (what) {
    if (arguments.length > 1) {
        what = util.format.apply(util, arguments);
    }
    output(util.format('%s\nSuccess! %s\n%s'.green.bold, starBar, what, starBar));
}

function good (what) {
    if (arguments.length > 1) {
        what = util.format.apply(util, arguments);
    }
    output(util.format('%s'.green, what));
}

function infoLink (name, url) {
    output(util.format('%s'.yellow, name));
    output(util.format('%s'.magenta.underline, url));
}

function json (obj) {
    //Special formatting?
    output(util.format('%s', JSON.stringify(obj, void 0, ' ')));
}

function intention (what) {
    if (!flags.value('showIntentions')) {
        return;
    }
    if (arguments.length > 1) {
        what = util.format.apply(util, arguments);
    }
    output(util.format('%s'.cyan.blueBG, what));
}

function warning (what) {
    if (arguments.length > 1) {
        what = util.format.apply(util, arguments);
    }
    output('  ---- WARNING ---- '.red);
    output(util.format('    %s'.yellow, what));
}

function epilogue (what) {
    if (flags.value('dontAnnounceMinorInfo')) {
        return;
    }
    if (arguments.length > 1) {
        what = util.format.apply(util, arguments);
    }
    output(util.format('%s'.grey, what));
}

function sectionHeader(what) {
    if (arguments.length > 1) {
        what = util.format.apply(util, arguments);
    }
    barBreak();
    output(util.format('%s'.yellow, what));
    barBreak();
}

function alert (what) {
    if (arguments.length > 1) {
        what = util.format.apply(util, arguments);
    }
    output(util.format(' - %s'.yellow, what));
}

function query (what) {
    if (!flags.value('showSql')) {
        return;
    }
    if (arguments.length > 1) {
        what = util.format.apply(util, arguments);
    }
    barBreak();
    output('Query:'.yellow);
    output(what);
}

module.exports = {
    good : good,
    query : query,
    alert : alert,
    sectionHeaer : sectionHeader,
    epilogue : epilogue,
    warning : warning,
    warn : warning,
    log : output,
    bar : barBreak,
    infoBlocks : infoBlocks,
    json : json,
    intention : intention,
    infoLink : infoLink,
    success : success,
    error : error,
    minorInfo : minorInfo,
    keyInfo : keyInfo,
    explainRequest : explainRequest,
    user : announceUser,
    explainResponseBody : explainResponseBody,
    explainResponseHeaders : explainResponseHeaders
};

