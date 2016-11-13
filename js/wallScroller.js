define(['observableEvent', 'underscore'], function(Observable, underscore) {
    var WallScroller = function WallScroller(containerId) {

        var _this = this,

            _scrollPosition = {
                /**
                 * @param {int} see element.scrollTop
                 */
                current : 0,
                /**
                 * @param {int} see element.scrollHeight
                 */
                scrollHeight: 0,
                clientHeight: 0,
                clientWidth: 0,
                successiveScrollHeight: [],
            },

            _selector = {
                asset: '.js-asset',
            },

            _assetInformation = {
                offsetWidth : 0,
                offsetHeight: 0
            },

            _containerId = containerId;

        function getContainer() {
            return document.getElementById(_containerId);
        }

        function getScrollInformation() {
            return _scrollPosition;
        }

        function getAssetInformation() {
            return _assetInformation;
        }

        function reachedBottom(container) {
            return container.scrollHeight - container.scrollTop === container.clientHeight;
        }

        function reachedTop(container) {
            return container.scrollTop === 0;
        }

        function scrollUp(container) {
            return container.scrollTop < _scrollPosition.current;
        }

        function scrollDown(container) {
            return container.scrollTop > _scrollPosition.current; 
        }

        function recycleTop(numberOfElementsToRecycle) {
            console.warn('recycleTop', numberOfElementsToRecycle);
        }

        function recycleBottom(numberOfElementsToRecycle) {
            console.warn('recycleBottom', numberOfElementsToRecycle);
        }

        function hideElement(numberOfElement) {
            var nodeList = getContainer().querySelectorAll(_selector.asset);
            for(var i = 0; i < numberOfElement; i++) {
                nodeList[i].innerHTML = '';
            }
        }

        function getNumberOfElementsPerRow(scrollInformation, assetInformation) {
            return Math.floor(scrollInformation.clientWidth / assetInformation.offsetWidth);
        }

        function getNumberOfRowsScrolled(scrollInformation, assetInformation) {
            return Math.floor(scrollInformation.current / assetInformation.offsetHeight);
        }

        function getTotalOfRows(scrollInformation, assetInformation) {
            return Math.floor(scrollInformation.scrollHeight / assetInformation.offsetHeight);
        }

        function getNumberOfBufferedRowsAllowed(scrollInformation, assetInformation) {
            return Math.floor((scrollInformation.clientHeight * 2) / assetInformation.offsetHeight);
        }

        function getNumberOfElementToRecycle() {
            var scrollInformation = getScrollInformation(),
                assetInformation = getAssetInformation();
            
            var delta = getNumberOfRowsScrolled(scrollInformation, assetInformation) 
                - getNumberOfBufferedRowsAllowed(scrollInformation, assetInformation);
            
            return delta * getNumberOfElementsPerRow(scrollInformation, assetInformation);
        }

        function updateAssetInformation() {
            var element = getContainer().querySelector(_selector.asset);
            _assetInformation.offsetHeight = element.offsetHeight;
            _assetInformation.offsetWidth = element.offsetWidth;
        }

        function initListener() {
            getContainer().addEventListener('scroll', underscore.debounce(function(event) {
                if (_assetInformation.offsetHeight === 0) {
                    updateAssetInformation();
                }
                if (scrollUp(this)) {
                    _this.notifyObservers(_this.EVENT_SCROLL_UP);
                    if (reachedTop(this)) {
                        _this.notifyObservers(_this.EVENT_REACHED_TOP);
                    }
                } else {
                    _this.notifyObservers(_this.EVENT_SCROLL_DOWN);
                    if (reachedBottom(this)) {
                        _this.notifyObservers(_this.EVENT_REACHED_BOTTOM);
                        _scrollPosition.successiveScrollHeight.push(this.scrollHeight);
                    }
                }

                _scrollPosition.current = this.scrollTop;
                _scrollPosition.scrollHeight = this.scrollHeight;
                _scrollPosition.clientHeight = this.clientHeight;
                _scrollPosition.clientWidth = this.clientWidth;

                var numberOfElementsToRecycle = getNumberOfElementToRecycle();
                if (numberOfElementsToRecycle > 0) {
                    recycleTop(numberOfElementsToRecycle);
                } else {
                    recycleBottom(numberOfElementsToRecycle);
                }
            }, 250));

            window.addEventListener('resize', function(event) {
                updateAssetInformation();
            });
        }

        function init() {
            Observable.call(_this); // call super constructor.

            initListener();
        }

        init();

        _this.EVENT_REACHED_BOTTOM = 'WallScroller.reachedBottom';
        _this.EVENT_REACHED_TOP = 'WallScroller.reachedTop';
        _this.EVENT_SCROLL_UP = 'WallScroller.scrollUp';
        _this.EVENT_SCROLL_DOWN = 'WallScroller.scrollDown';

        _this.getScrollInformation = getScrollInformation;

        _this.recycleTop = recycleTop;

        _this.recycleBottom = recycleBottom;

        _this.getNumberOfElementsPerRow = getNumberOfElementsPerRow;

        _this.hideElement = hideElement;

        _this.updateAssetInformation = updateAssetInformation;
    };

    return WallScroller;
});
