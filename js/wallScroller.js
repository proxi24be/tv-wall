define(['observableEvent'], function(Observable) {
    var WallScroller = function WallScroller(containerId) {
        var _this = this,
            _scrollPosition = {
                current : 0,
            },
            _containerId = containerId;

        function getContainer() {
            return document.getElementById(_containerId);
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

        function initListener() {
            getContainer().addEventListener('scroll', function(event) {
                if (scrollUp(this)) {
                    _this.notifyObservers(_this.EVENT_SCROLL_UP);
                    if (reachedTop(this)) {
                        _this.notifyObservers(_this.EVENT_REACHED_TOP);
                    }
                } else {
                    _this.notifyObservers(_this.EVENT_SCROLL_DOWN);
                    if (reachedBottom(this)) {
                        _this.notifyObservers(_this.EVENT_REACHED_BOTTOM);
                    }
                }

                _scrollPosition.current = this.scrollTop;
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
    };

    return WallScroller;
});
