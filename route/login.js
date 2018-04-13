/*
 * @Author: Administrator
 * @Date:   2018-01-02 14:11:06
 * @Last Modified by:   Administrator
 * @Last Modified time: 2018-01-04 14:44:41
 */
const express = require('express');
const dao = require('../dao/dao');

module.exports = function() {
    var router = express.Router();

    router.post('/', function(req, res) {
        console.log('login');
        var postData = req.body;
        console.log(postData);
        var returns = {};
        dao.login(postData.username, function(err, data) {
            if (err == null) {
                if (data != null) {
                    if (data.password == postData.password) {
                        returns.authenticated = true;
                    } else {
                        returns.errmsg = 'username or password is wrong'
                    }
                } else {
                    returns.errmsg = 'there is no this user';
                }
                res.send(returns);
            } else {
                res.status(500).send('database err').end();
            }
        })
    });

    return router;
}