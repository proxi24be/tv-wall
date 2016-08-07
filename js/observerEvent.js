define(function() {

    var ObserverEvent = function ObserverEvent() {
        var _this = this;

        _this.update = function (event, data) {
            throw new Error('function update (event, data) has not been implemented yet.');
        };

        return _this;
    };

    return ObserverEvent;
});
