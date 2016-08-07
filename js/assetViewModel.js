define(['koComponent'], function (KoComponent) {
    'use strict';

    var AssetViewModel = function AssetViewModel (airings) {
        // Inherit methods from KoComponent.
        KoComponent.call(this, {containerId: 'assetViewModel'});

        var _this = this,
            _assetsToDisplay = _this.getKo().observableArray([]),
            _assets = [],
            _pagination = 21,
            _lastPosition = 0,
            /**
             * @param Promise
             */
            _airings = airings;

        function init() {
            _assetsToDisplay.extend({rateLimit: 250});

            loadMoreAsset();

            $('#moreAsset').bind('click', loadMoreAsset);
        }

        /**
         * @return {observableArray}
         */
        function getAssets() {
            return _assetsToDisplay;
        }

        function loadMoreAsset() {
            var cpt = 1;
            _airings.then(function(airings) {
                for(_lastPosition; (_lastPosition < airings.length) && (cpt%_pagination !== 0); _lastPosition++, cpt++) {
                    _assets.push({
                        url: airings[_lastPosition].poster,
                        details: airings[_lastPosition].title,
                        category: airings[_lastPosition].category,
                    });
                }

                _assetsToDisplay(_assets);
            });
        }

        function chosenCategoryEvent(chosenCategory) {
            var filteredAssets = _assets.filter(function (asset) {
                var found = false;
                for (var i = 0; i < chosenCategory.length; i++) {
                    if (asset.category === chosenCategory[i].category) {
                        found = true;
                        break;
                    }
                }

                return found;
            });
            _assetsToDisplay(filteredAssets);
        }

        init();

        _this.getAssets = getAssets;
        _this.loadMoreAsset = loadMoreAsset;
        _this.chosenCategoryEvent = chosenCategoryEvent;
        _this.displayAdvancedOptions = _this.getKo().observable(false);

        return _this;
    };

    return AssetViewModel;
});
