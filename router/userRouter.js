const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const saltRounds = 10;

const db = require('../models');
const User = db.User;

const router = express.Router();

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		const findUser = await User.findOne({ where: { email } });

		if (!findUser) {
			return res.status(409).json({ message: '존재하지 않는 이메일 입니다.' });
		}

		const {
			dataValues: { password: dbPassword },
		} = findUser;

		bcrypt.compare(password, dbPassword, (err, isMatch) => {
			if (isMatch) {
				const token = jwt.sign({ ...findUser, password: '' }, 'hello', {
					expiresIn: '1h',
				});
				const { id, email, nickname } = findUser;

				return res
					.cookie('TID', token)
					.status(200)
					.json({ id, email, nickname });
			}
		});
	} catch (error) {
		return res.status(506).send('Failed Login');
	}
});

router.post(
	'/register',
	body('email').isEmail(),
	body('password').isLength({ min: 5 }),
	body('nickname').not(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(401).json({ errors: errors.array() });
		}
		try {
			const { email, password: plainPassword, nickname } = req.body;

			const data = await User.findOne({ where: { email } });
			if (data) {
				return res.status(409).json({ message: '존재하는 이메일 입니다.' });
			}
			bcrypt.genSalt(saltRounds, (err, salt) => {
				if (err) {
					return res.send('서버 에러 잠시 후 시도해주세요!');
				}
				bcrypt.hash(plainPassword, salt, (err, hashPassword) => {
					if (err) {
						return res.send('서버 에러 잠시 후 시도해주세요!');
					}
					User.create({ email, password: hashPassword, nickname }).then(() => {
						return res.status(201).json({ success: true });
					});
				});
			});
		} catch (error) {
			return res.status(506).json({ message: 'Failed Register' });
		}
	},
);

module.exports = router;
