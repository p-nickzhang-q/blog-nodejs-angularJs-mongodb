/*
 * @Author: Administrator
 * @Date:   2017-12-26 15:46:45
 * @Last Modified by:   Administrator
 * @Last Modified time: 2017-12-26 16:00:07
 */
const crypto = require('crypto');

const MD5_SuFFIX = 'asdfasfdsg1234asdf';

module.exports = {

    md5: function(str) {

        var obj = crypto.createHash('md5');

        obj.update(str+MD5_SuFFIX);

        return obj.digest('hex')
    }
}