const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const Authorize = require('../middleware/authorization')

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/otp-verify', userController.otpVerify)
router.post('/changepasword', userController.changePassword)

router.get("/is-verify", Authorize, async (req, res) => {
    try {
      res.json(true);
    } catch (err) {
      res.status(500).send("Server Error");
    }
  });
  

module.exports = router;
