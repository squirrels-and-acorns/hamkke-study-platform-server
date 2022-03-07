const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const upload = require('../module/multer');

const {
	authCheck,
	loginUser,
	registerUser,
	updateUser,
	uploadUserProfile,
	deleteUser,
} = require('../controller/userController');

router.get('/auth', authCheck);

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

router.delete('/', deleteUser);

module.exports = router;
