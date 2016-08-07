/**
 * Created by bluenight on 8/5/16.
 */
define(function() {

    var ObservableEvent = function ObservableEvent() {

        var _this = this,

            _observers = [];

        _this.addObserver = function (observer) {
            _observers.push(observer);
        };

        _this.removeObserver = function (observer) {

        };

        _this.notifyObservers = function (event, data, observer) {
            if ( observer === undefined ) {
                _observers.forEach(function(observer) {
                    if ( typeof observer === 'object' && observer.hasOwnProperty('update') ) {
                        observer.update(event, data);
                    }
                });
            }
        };

        return _this;
    };

    return ObservableEvent;
});
