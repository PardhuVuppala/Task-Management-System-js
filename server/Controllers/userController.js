const bcrypt = require('bcrypt');
const userModel = require('../Models/userModel');
const mailService = require('../services/RegistrationServices'); // assuming you have a mail service
const jwtgenerator = require("../JwtToken/jwtgenerator");
const Authorize = require("../middleware/authorization");
const randomize = require('randomatic');


const registerUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      address,
      gender,
      dob,
      phonenumber,
      password,
      repassword,
    } = req.body;

    if (repassword !== password) {
      return res.status(401).send("Password Mismatch");
    }

    const existingUser = await userModel.findUserByEmail(email);

    if (existingUser) {
      return res.status(401).send("User already exists");
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const newUser = {
      first_name: firstname,
      last_name: lastname,
      email,
      address,
      gender,
      dob: new Date(dob),
      role: 'user',
      phone_number: phonenumber,
      password: bcryptPassword,
    };

    await userModel.createUser(newUser);

    await mailService.sendMail(
      email,
      "Cook Buddy",
      `${newUser.first_name}, Thank you for registering with us`
  );

    res.json({ status: true });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email });

    const user = await userModel.findUserByEmail(email);

    if (!user) {
      console.log('User not found');
      return res.status(401).send("Invalid Email or Password");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).send("Invalid Email or Password");
    }

    const token = jwtgenerator(user.id);
    const user_id = user.id;
    const role = user.role;
    const name = user.first_name;

    const body = {
      token,
      role,
      user_id,
      name
    };
    res.json(body);

  } catch (err) {
    console.error('Error in loginUser function:', err.message);
  }
};


const otpVerify = async (req, res) => {
  try {
    const { Email } = req.body;
    const check = await userModel.FindUserForOtp(Email);
    if (check) {
      const otp = randomize('0', 4);
      
      await mailService.sendMail(
        Email,
        'Here is the OTP to verify your account',
        `${otp}`
      );
      res.json({ otp });
    } else {
      res.status(401).json('User does not exist');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const changePassword = async (req, res) => {
  try {
    const { email, Password, repassword } = req.body;
    if (Password !== repassword) {
      return res.status(401).send('Password Mismatch');
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const bcryptPassword = await bcrypt.hash(Password, salt);

    const status = await userModel.updateUserPassword(email, bcryptPassword);
    await mailService.sendMail(email, 'Password has been changed', 'Thank you');
    
    res.json({ verify: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  otpVerify,changePassword,
  registerUser,
  loginUser

};
