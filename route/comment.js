/*
 * @Author: Administrator
 * @Date:   2018-01-02 14:11:06
 * @Last Modified by:   Administrator
 * @Last Modified time: 2018-01-09 15:50:13
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
        dao.getBlogById(id, function(err, blog) {
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
        })
    });

    return router;
}