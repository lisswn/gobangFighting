/**
 * Created by mycontent on 2017/7/30.
 */

var express = require('express');

var ctrl = require('./controller.js');

var router = express.Router();

router
    // .get('/',ctrl.showIndexPage)
    // .post('/',ctrl.addData)
    .get('/reStart',ctrl.deleteData)

module.exports = router;


