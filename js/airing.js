define(['observerEvent', 'observableEvent'], function(ObserverEvent, ObservableEvent) {

    var Airing = function Airing () {

        var _this = this,

            _airingImage = 'https://experience-cache.proximustv.be/posterserver/poster/EPG/w-300_h-140/',
            /**
             * @var Promise
             */
            _promiseAiringsByCategory,

            _airingsByCategory = {};

        /**
         * @returns {Promise}
         */
        function getCategories() {
            return _promiseAiringsByCategory.then(function() {
                return Object.keys(_airingsByCategory);
            });
        }

        /**
         * @returns {Promise}
         */
        function getAirings() {
            return _promiseAiringsByCategory;
        }

        function init() {
            _promiseAiringsByCategory = new Promise(function(resolve) {
                $.getJSON('data/airings.json', function (airings) {
                    airings.forEach(function(airing) {
                        if ( typeof _airingsByCategory[airing.category] === 'undefined' ) {
                            _airingsByCategory[airing.category] = [];
                        }
                        airing.poster = _airingImage + airing.poster;
                        _airingsByCategory[airing.category].push(airing);
                    });

                    resolve(airings);
                });
            });

        }

        init();

        _this.getCategories = getCategories;
        _this.getAirings = getAirings;

        Object.freeze(_this);

        return _this;
    };

    return Airing;

});
