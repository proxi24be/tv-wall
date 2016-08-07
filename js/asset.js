define(['observableEvent'], function(Observable) {
    var Asset = function Asset() {

        Observable.call(this); // call super constructor.

        return this;
    };

    return Asset;
});
