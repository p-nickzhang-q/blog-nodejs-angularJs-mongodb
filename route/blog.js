/*
 * @Author: Administrator
 * @Date:   2018-01-04 14:51:31
 * @Last Modified by:   p-nickzhang-q
 * @Last Modified time: 2018-04-20 16:03:11
 */

const express = require('express');
const dao = require('../dao/dao');
const pathlib = require('path');
const fs = require('fs');


module.exports = function() {
    var router = express.Router();

    router.post('/blogPost', function(req, res) {
        console.log('blogPost post');
        var postData = req.body;
        var returns = {};
        postData.comments = [];
        postData.date = new Date();
        console.log(postData);
        dao.saveBlog(postData, function(err, data) {
            if (err == null) {
                returns = data;
                res.send(returns);
            } else {
                res.status(500).send('database err').end();
            }
        });
    });

    router.get('/blogPost', function(req, res) {
        console.log('blogPost get');
        var getData = req.query;
        console.log(getData);
        var returns = {};
        dao.getBlogById(getData.id, function(err, data) {
            if (err == null) {
                returns = data;
                res.send(returns);
            } else {
                res.status(500).send('database err').end();
            }
        });
    });

    router.get('/blogList', function(req, res) {
        console.log('blogList');
        var returns = {};
        var pageSize = parseInt(req.query.pageSize);
        var pageNumber = parseInt(req.query.pageNumber);
        dao.getBlogs(pageNumber, pageSize, function(err, data, total) {
            if (err == null) {
                returns.data = data;
                returns.total = total;
                console.log(returns);
                res.send(returns).end();
            } else {
                res.status(500).send('database err').end();
            }
        });
    });

    router.post('/upload', function(req, res) {
        var returns = {};
        returns.path = upload(req);
        console.log(returns);
        res.send(returns);
    });

    router.delete('/blogPost', function(req, res) {
        console.log('blogPost delete');
        var returns = {};
        dao.deleteBlog(req.query.id, function(err) {
            if (err == null) {
                console.log(returns);
                res.send(returns).end();
            } else {
                res.status(500).send('database err').end();
            }
        })
    });

    router.put('/blogPost', function(req, res) {
        console.log('blogPost put');
        var returns = {};
        var postData = req.body;
        console.log(postData);
        //var update  = {$set : {age : 27, title : 'model_demo_title_update'}};
        var update = { $set: { blogText: postData.blogText } };
        dao.updateBlog(postData.id, update, function(err) {
            if (err == null) {
                console.log(returns);
                res.send(returns).end();
            } else {
                res.status(500).send('database err').end();
            }
        })
    });

    return router;
};

var upload = function(req) {
    console.log('upload');
    if (req.files != null) {
        var file = req.files[0];
        var oldpath = file.path;
        var newpath = oldpath + pathlib.parse(file.originalname).ext;
        fs.rename(oldpath, newpath, function(err) {
            if (err) {
                console.log(er);
            }
        });
        return newpath;
    }
};