'use strict';

/* Services */

var blogServices = angular.module('blogServices', ['ngResource']);

blogServices.factory('BlogPost', ['$resource', '$routeParams',
    function($resource, $routeParams) {
        return $resource("./blog/blogPost", {}, {
            get: {
                method: 'GET',
                cache: false,
                isArray: false
            },
            save: {
                method: 'POST',
                cache: false,
                isArray: false
            },
            update: {
                method: 'PUT',
                cache: false,
                isArray: false
            },
            del: {
                method: 'DELETE',
                cache: false,
                isArray: false
            }
        });
    }
]);

blogServices.factory('BlogList', ['$resource', function($resource) {
    return $resource("./blog/blogList", {}, {
        get: {
            method: 'GET',
            cache: false,
            isArray: false
        }
    });
}]);

blogServices.factory('test', ['$resource', function($resource) {
    return $resource("./test", {}, {
        get: {
            method: 'GET',
            cache: false,
            isArray: false
        }
    });
}]);

blogServices.factory('Login', ['$resource', function($resource) {
    return $resource("./login", {}, {
        login: {
            method: 'POST',
            cache: false,
            isArray: false
            //			params: {callback: 'JSON_CALLBACK'}
            //			format: 'json'
        }
    });
}]);

blogServices.factory('BlogPostComments', ['$resource', function($resource) {
    return $resource("./comment", {}, {
        save: {
            method: 'POST',
            cache: false,
            isArray: false
        },
        del: {
            method: 'DELETE',
            cache: false,
            isArray: false
        }
    });
}]);

// blogServices.factory('PageService', ['$http', '$scope', function() {
// 	return {

// 	};
// } ]);