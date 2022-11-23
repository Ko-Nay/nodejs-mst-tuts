const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

// router.route('/')
//     .get((req, res) => {
//         console.log("hello get")
//     })
//     .post(registerController.handleNewRegister)
//     .put()
//     .delete()


router.post('/',registerController.handleNewRegister )

module.exports = router;