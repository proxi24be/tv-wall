define(['koComponent'], function (KoComponent) {
    'use strict';
    var CategoryViewModel = function CategoryViewModel(promiseCategories) {
        // Inherit methods from KoComponent.
        KoComponent.call(this, { containerId: 'categoryViewModel' });

        var _this = this,
            _promiseCategories = promiseCategories,

            _categories = _this.getKo().observableArray([]),
            _chosenCategories = _this.getKo().observableArray([]);

        function getCategories() {
            return _categories;
        }

        function getChosenCategories() {
            return _chosenCategories;
        }

        function init() {
            _promiseCategories.then(function (data) {
                data.forEach(function (category) {
                    var item = { category: category };
                    _categories.push(item);
                    _chosenCategories.push(item);
                });
            });
        }

        init();

        this.getCategories = getCategories;

        this.getChosenCategories = getChosenCategories;
    };

    return CategoryViewModel;
});
