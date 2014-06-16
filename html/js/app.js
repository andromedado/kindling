
(function ($) {
    var app = {};
    var templates = {};
    var $profiles = $();
    var $matches = $();
    var renderWidth = 172;
    var renderHeight = 172;

    _.templateSettings = _.extend({}, _.templateSettings, {
        'variable' : 'obj'
    });

    $(function () {
        $(document.body).on('click', '.command', function (e) {
            var data = $(e.target).data();
            var command = data.command;
            data = _.extend({}, data);
            data.command = void 0;
            if (typeof app[command] === 'function') {
                (app[command])(data);
            }
        });
        $('script[type="text/template"]').each(function (i, E) {
            templates[E.id] = _.template($(E).detach().html());
        });
        $profiles = $('#profiles');
        $matches = $('#matches');
    });

    app.likeProfile = function (data) {
        return $.ajax({
            url : '/api/command/likeProfile/' + data.profileid
        }).then(function (res) {
            var $el = $('#profile-' + data.profileid);
            console.log(res);
            if (res && res._id) {
                alert('Match!');
                $el.appendTo($matches);
            } else {
                $el.remove();
            }
        });
    };

    app.passProfile = function (data) {
        $('#profile-' + data.profileid).remove();
        return $.ajax({
            url : '/api/command/passProfile/' + data.profileid
        }).then(function (res) {
            console.log(res);
        });
    };

    app.loadSomeProfiles = function () {
        $profiles.empty();
        return $.ajax({
            url : '/api/command/getPotentialMatches'
        }).then(function (profiles) {
            _.each(profiles, function (profile) {
                var srcs = [];
                _.each(profile.photos, function (photo) {
                    var max;
                    _.each(photo.processedFiles, function (file) {
                        if (!max || max.height < file.height) {
                            max = file;
                        }
                    });
                    if (max) {
                        srcs.push(max.url);
                    }
                });
                profile._photos = srcs;
                profile._photoWidth = renderWidth;
                profile._photoHeight = renderHeight;
                $profiles.append(templates.profile(profile));
            });
            $('img').resizable({
                aspectRatio : true
            });
        });
    };

    window.app = app;

}(jQuery));

