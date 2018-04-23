'use strict';


const editorMenus = [
    'head', // 标题
    'bold', // 粗体
    'fontSize', // 字号
    'fontName', // 字体
    'italic', // 斜体
    'underline', // 下划线
    'strikeThrough', // 删除线
    'foreColor', // 文字颜色
    'backColor', // 背景颜色
    'link', // 插入链接
    'list', // 列表
    'justify', // 对齐方式
    //    'quote', // 引用
    'emoticon', // 表情
    'image', // 插入图片
    'table', // 表格
    //    'video', // 插入视频
    //    'code', // 插入代码
    'undo', // 撤销
    'redo' // 重复
]

/*--------------------------------------------------*/


var blogControllers = angular.module('blogControllers', ['angularFileUpload']);

blogControllers.controller('BlogCtrl', ['$scope', 'BlogList', '$location',
    'checkCreds', 'BlogPost',
    function($scope, BlogList, $location, checkCreds, BlogPost) {
        if (!checkCreds()) {
            $location.path('/login');
        }
        $scope.brandColor = "color: white;";
        $scope.blogList = [];

        $scope.paginationConf = {
            currentPage: 1,
            totalItems: 0,
            pageItems: 3,
            changePage: function() {
                $scope.queryList(); //翻页时候执行的方法
            }
        };

        $scope.queryList = function() {
            var params = {
                pageNumber: $scope.paginationConf.currentPage - 1,
                pageSize: $scope.paginationConf.pageItems
            };
            BlogList.get(params, function success(res) {
                $scope.blogList = res.data;
                $scope.paginationConf.totalItems = res.total;
            }, function error(errorResponse) {
                console.log("error: " + JSON.stringify(errorResponse));
            });
        };

        $scope.deleteBlog = function(id) {
            var r = confirm("really?");
            if (r == true) {
                BlogPost.del({ 'id': id }, function success(res) {
                    $scope.paginationConf.changePage();
                }, function error(errRes) {
                    console.log("error: " + JSON.stringify(errRes));
                })
            }
        }

        $scope.queryList();

    }
]);

blogControllers.controller('BlogViewCtrl', [
    '$scope',
    '$routeParams',
    'BlogPost',
    '$location',
    'checkCreds',
    '$http',
    'getToken',
    'BlogPostComments',
    '$route',
    function($scope, $routeParams, BlogPost, $location, checkCreds, $http,
        getToken, BlogPostComments, $route) {
        if (!checkCreds()) {
            $location.path('/login');
        }
        $scope.load = function() {
            var E = window.wangEditor;
            var blogTextEditor = new E('#blogTextEditor');
            blogTextEditor.customConfig.menus = editorMenus;
            blogTextEditor.create();
            $scope.blogTextEditor = blogTextEditor;
        };
        var blogId = $routeParams.id;
        BlogPost.get({
            id: blogId
        }, function success(response) {
            console.log("success: " + JSON.stringify(response));
            $scope.blogEntry = response;
            $scope.blogTextEditor.txt.html(response.blogText);
        }, function error(errorResponse) {
            console.log("error: " + JSON.stringify(errorResponse));
        });

        $scope.updateBlog = function() {
            if (confirm("really?")) {
                var postData = { id: blogId, blogText: $scope.blogTextEditor.txt.html() };
                BlogPost.update(postData, function success(res) {
                    console.log("success: " + JSON.stringify(res));
                    $location.path('/blogPost/' + blogId);
                    $route.reload();
                }, function error(errRes) {
                    console.log("error: " + JSON.stringify(errRes));
                });
            };
        };

        $scope.deleteComment = function(id) {
            if (confirm("really?")) {
                var queryData = {
                    'blogId': blogId,
                    'commentId': id
                };
                BlogPostComments.del(queryData, function success(res) {
                    console.log("success: " + JSON.stringify(res));
                    $location.path('/blogPost/' + blogId);
                    $route.reload();
                }, function error(errRes) {
                    console.log("error: " + JSON.stringify(errRes));
                })
            }
        }

        $scope.submit = function() {
            $scope.sub = true;
            $http.defaults.headers.common['Authorization'] = 'Basic ' +
                getToken();
            var postData = {
                commentText: $scope.commentText,
                blog: blogId
            };

            BlogPostComments.save(postData, function success(response) {
                console.log("success: " + JSON.stringify(response));
                $location.path('/blogPost/' + blogId);
                $route.reload();
            }, function error(errorResponse) {
                console.log("error: " + JSON.stringify(errorResponse));
            });
        };
    }
]);


blogControllers.controller('LoginCtrl', ['$scope', '$location',
    'Login', 'setCreds', 'checkCreds',
    function LoginCtrl($scope, $location, Login, setCreds, checkCreds) {
        if (checkCreds()) {
            $location.path('/');
        }
        $scope.submit = function() {
            $scope.sub = true;
            var postData = {
                username: $scope.username,
                password: $scope.password
            };
            Login.login(postData,
                function success(response) {
                    console.log("Success:" + JSON.stringify(response));
                    if (response.authenticated) {
                        setCreds($scope.username, $scope.password)
                        $location.path('/');
                    } else {
                        $scope.error = "Login Failed"
                    }

                },
                function error(errorResponse) {
                    $scope.error = "Login Failed"
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
            );

        };
    }
]);

blogControllers.controller('LogoutCtrl', ['$location', 'deleteCreds',
    function($location, deleteCreds) {
        deleteCreds();
        $location.path('/login');
    }
]);

blogControllers.controller('NewBlogPostCtrl', ['$scope', 'BlogPost', '$location', 'checkCreds', '$http', 'getToken', 'FileUploader',
    function($scope, BlogPost, $location, checkCreds, $http, getToken, FileUploader) {
        upload($scope, FileUploader);
        $scope.load = function() {
            var E = window.wangEditor;
            var blogTextEditor = new E('#blogTextEditor');
            blogTextEditor.customConfig.menus = editorMenus;
            blogTextEditor.create();
            $scope.blogTextEditor = blogTextEditor;
        };
        if (!checkCreds()) {
            $location.path('/login');
        }
        $scope.languageList = [{
            "id": 1,
            "name": "English"
        }, {
            "id": 2,
            "name": "Spanish"
        }];
        $scope.languageId = 1;
        $scope.newActiveClass = "active";
        $scope.submit = function() {
            $scope.sub = true;
            $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
            $scope.uploader.uploadAll();
            $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
                var postData = {
                    introText: $scope.introText,
                    blogText: $scope.blogTextEditor.txt.html(),
                    languageId: $scope.languageId,
                    img: response.path
                };
                BlogPost.save(postData,
                    function success(response) {
                        //alert($scope.challenge.question);
                        console.log("Success:" + JSON.stringify(response));
                        $location.path('/');
                    },
                    function error(errorResponse) {
                        console.log("Error:" + JSON.stringify(errorResponse));
                    }
                );
            };
        };
    }
]);

var upload = function($scope, FileUploader) {
    var uploader = $scope.uploader = new FileUploader({
        url: 'http://localhost:8080/blog/upload'
    });

    // FILTERS

    // a sync filter
    uploader.filters.push({
        name: 'syncFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options) {
            console.log('syncFilter');
            return this.queue.length < 10;
        }
    });

    // an async filter
    uploader.filters.push({
        name: 'asyncFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options, deferred) {
            console.log('asyncFilter');
            setTimeout(deferred.resolve, 1e3);
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    console.info('uploader', uploader);
};