/*
 * @Author: Administrator
 * @Date:   2018-01-02 14:11:06
 * @Last Modified by:   p-nickzhang-q
 * @Last Modified time: 2018-04-23 15:20:56
 */
const express = require('express');
const dao = require('../dao/dao');

module.exports = function() {
    var router = express.Router();

    router.post('/', function(req, res) {
        console.log('comment');
        var postData = req.body;
        console.log(postData);
        var id = postData.blog;
        var returns = {};
        var comment = {
            commentText: postData.commentText,
            date : new Date()
        };
        dao.addComment(id, comment, function(err, result) {
            if (err == null) {
                console.log(result);
                returns.authenticated = true;
                res.send(returns);
            } else {
                res.status(500).send('database err').end();
            }
        });
        /*dao.getBlogById(id, function(err, blog) {
            if (err == null) {
                delete postData.blog;
                var comment = postData;
                comment.date = new Date();
                blog.comments.push(comment);
                console.log(blog);
                dao.updateBlog(id, blog, function(err, result) {
                    if (err == null) {
                        console.log(result);
                        returns.authenticated = true;
                        res.send(returns);
                    } else {
                        res.status(500).send('database err').end();
                    }
                });
            } else {
                res.status(500).send('database err').end();
            }
        })*/
    });

    router.delete('/', function(req, res) {
        console.log('comment');
        var queryData = req.query;
        console.log(queryData);
        var blogId = queryData.blogId;
        var commentId = queryData.commentId;
        var returns = {};
        dao.deleteComment(blogId, commentId, function(err, result) {
            if (err == null) {
                console.log(result);
                returns.authenticated = true;
                res.send(returns);
            } else {
                res.status(500).send('database err').end();
            }
        });
        // dao.getBlogById(id, function(err, blog) {
        //     if (err == null) {
        //         dao.updateBlog(id, blog, function(err, result) {
        //             if (err == null) {
        //                 console.log(result);
        //                 returns.authenticated = true;
        //                 res.send(returns);
        //             } else {
        //                 res.status(500).send('database err').end();
        //             }
        //         });
        //     } else {
        //         res.status(500).send('database err').end();
        //     }
        // })
    });

    return router;
}