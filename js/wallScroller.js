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

        function recycleTop(scrollInformation) {
            var delta = scrollInformation.current - scrollInformation.clientHeight;
            console.warn('recycleTop', delta);
        }

        function recycleBottom(scrollInformation) {
            var delta = 
                scrollInformation.scrollHeight - scrollInformation.current + scrollInformation.clientHeight;
            console.warn('recycleBottom', delta);
        }

        function hideElement(numberOfElement) {
            var nodeList = getContainer().querySelectorAll(_selector.asset);
            for(var i = 0; i < numberOfElement; i++) {
                nodeList[i].innerHTML = '';
            }
        }

        function getNumberOfElementPerRow() {
            if (_assetInformation.offsetHeight === 0) {
                updateAssetInformation();
            }
            
            var scrollInformation = getScrollInformation();

            return Math.floor(scrollInformation.clientWidth / _assetInformation.offsetWidth);
        }

        function computeScroll() {
            var elementPerRow = getNumberOfElementPerRow();
            var scrollInformation = getScrollInformation();

            console.warn(
                scrollInformation.scrollHeight / _assetInformation.offsetHeight,
                scrollInformation.scrollHeight,
                _assetInformation.offsetHeight
            );
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

                console.warn('number of rows ', _scrollPosition.current / _assetInformation.offsetHeight);
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

        _this.getNumberOfElementPerRow = getNumberOfElementPerRow;

        _this.hideElement = hideElement;

        _this.updateAssetInformation = updateAssetInformation;

        _this.computeScroll = computeScroll;
    };

    return WallScroller;
});
