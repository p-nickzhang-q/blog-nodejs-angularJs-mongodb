'use strict';

var blogDirectives = angular.module('blogDirectives', []);

blogDirectives.directive('blgMenu', function() {
    return {
        restrict: 'A',
        templateUrl: 'partials/menu.html',
        link: function(scope, el, attrs) {
            scope.label = attrs.menuTitle
        }
    };
});

blogDirectives.directive('pagination', function() {
    return {
        restrict: 'EA',
        templateUrl: 'partials/pagination.html',
        replace: true,
        scope: {
            conf: '='
        },
        link: function(scope, el, attrs) {
            //页码数长度（显示页码数，必须是奇数,因为有'...'的存在）
            var pageLength = 3;
            //改变当前页
            scope.changeCurrentPage = function(item) {
                if (item == '...') {
                    return;
                } else {
                    scope.conf.currentPage = item;
                    if (scope.conf.changePage) {
                        scope.conf.changePage();
                    }
                }
            };

            //前一页
            scope.prePage = function(){
                if(scope.conf.currentPage === 1){
                    return ;
                }
                scope.changeCurrentPage(scope.conf.currentPage - 1);
            };
            //后一页
            scope.nextPage = function(){
                if(scope.conf.currentPage === scope.pageNum){
                    return ;
                }
                scope.changeCurrentPage(scope.conf.currentPage + 1);
            };

            //偏移量（因为要除去首页和尾页，所以要-1）
            var offset = parseInt(pageLength / 2) - 1;

            function initPageList() {
                //如果没有数据显示一页
                scope.conf.totalItems = scope.conf.totalItems > 0 ? scope.conf.totalItems : 1;
                //总页数
                scope.pageNum = Math.ceil(scope.conf.totalItems / scope.conf.pageItems);
                scope.pageList = [];
                if (scope.pageNum <= pageLength) {
                    for (var i = 1; i <= scope.pageNum; i++) {
                        scope.pageList.push(i);
                    }
                } else {
                    //左边没有'...'
                    if (scope.conf.currentPage < pageLength - offset) {
                        for (var i = 1; i < pageLength; i++) {
                            scope.pageList.push(i);
                        }
                        scope.pageList.push('...');
                        scope.pageList.push(scope.pageNum);
                    } else if (scope.conf.currentPage >= scope.pageNum - offset - 1) {
                        //右边没有'...'
                        scope.pageList.push(1);
                        scope.pageList.push('...');
                        for (var i = pageLength - 2; i >= 0; i--) {
                            scope.pageList.push(scope.pageNum - i);
                        }
                    } else {
                        //两边都有'...'
                        scope.pageList.push(1);
                        scope.pageList.push('...');
                        for (var i = scope.conf.currentPage - offset; i <= scope.conf.currentPage + offset; i++) {
                            scope.pageList.push(i);
                        }
                        scope.pageList.push('...');
                        scope.pageList.push(scope.pageNum);
                    }
                }
            };

            //监听数据变化，改变分页
            scope.$watch('conf.currentPage', initPageList);
            scope.$watch('conf.totalItems', function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    scope.conf.currentPage = 1
                    initPageList();
                }
            });
        }
    };
});