/**
 * Created by bluenight on 8/6/16.
 */
define(['ko'], function (ko) {
    'use strict';

    var KoComponent = function KoComponent(options) {
        var _this = this,

            _options = {
            containerId: undefined
        };



        function getContainer(id) {
            if (_options.containerId === undefined) {
                throw new Error('containerId must be defined and be public.');
            }

            if (id !== undefined) {
                _options.containerId = id;
            }

            return document.getElementById(_options.containerId);
        }

        function getKo() {
            return ko;
        }

        function setOptions() {
            _options = options;
        }

        setOptions(options);

        _this.getContainer = getContainer;

        _this.getKo = getKo;
    };

    return KoComponent;

});