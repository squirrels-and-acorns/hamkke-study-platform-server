const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const upload = require('../module/multer');

const { loginUser, registerUser, updateUser, uploadUserProfile } = require('../controller/userController');

router.post('/login', loginUser);

router.post(
	'/register',
	body('email').isEmail(),
	body('password').isLength({ min: 5 }),
	body('nickname').not(),
	registerUser,
);

router.put('/', updateUser);

router.post('/profile', upload.single('image'), uploadUserProfile);

module.exports = router;
