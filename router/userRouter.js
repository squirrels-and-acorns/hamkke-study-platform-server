const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const saltRounds = 10;

const db = require('../models');
const User = db.User;
const router = express.Router();
const upload = require('../module/multer');

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		const findUser = await User.findOne({ where: { email } });

		if (!findUser) {
			return res.status(409).json({ success: false, message: '존재하지 않는 이메일 입니다.' });
		}

		const { dataValues } = findUser;

		return bcrypt.compare(password, dataValues.password, (err, isMatch) => {
			if (isMatch) {
				const token = jwt.sign({ ...dataValues, password: '' }, 'hello', {
					expiresIn: '1h',
				});
				const { id, email, nickname, profile } = findUser;

				return res.cookie('TID', token).status(200).json({ id, email, nickname, profile });
			} else {
				return res.status(400).json({ success: false, message: '비밀번호가 틀립니다' });
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
				return res.status(409).json({ success: false, message: '존재하는 이메일 입니다.' });
			}
			return bcrypt.genSalt(saltRounds, (err, salt) => {
				if (err) {
					return res.send('서버 에러 잠시 후 시도해주세요!');
				}
				return bcrypt.hash(plainPassword, salt, (err, hashPassword) => {
					if (err) {
						return res.send('서버 에러 잠시 후 시도해주세요!');
					}
					User.create({ email, password: hashPassword, nickname }).then(() => {
						return res.status(201).json({ success: true });
					});
				});
			});
		} catch (error) {
			return res.status(506).json({ success: false, message: 'Failed Register' });
		}
	},
);

router.put('/', async (req, res) => {
	const {
		body: { userId, type, data },
	} = req;
	try {
		switch (type) {
			// 1. 닉네임 변경
			case 'nickname':
				const result = await User.findOne({ where: { nickname: data } });

				if (result) {
					return res.status(400).json({ success: false, message: '존재하는 닉네임' });
				}

				await User.update({ nickname: data }, { where: { id: userId } });
				return res.status(200).json({ success: true });
			// 2. 비밀번호 변경
			case 'password':
				const {
					dataValues: { password: dbPassword },
				} = await User.findOne({ where: { id: userId } });

				return bcrypt.compare(data, dbPassword, (err, isMatch) => {
					if (isMatch) {
						return res.status(400).json({ success: false, message: '이전 비밀번호와 같습니다.' });
					} else {
						return bcrypt.genSalt(saltRounds, (err, salt) => {
							return bcrypt.hash(data, salt, async (err, hashPassword) => {
								await User.update({ password: hashPassword }, { where: { id: userId } });
								return res.status(200).json({ success: true });
							});
						});
					}
				});
			// 3. 관심있는 언어
			case 'stacks':
			// 구현 예정
			default:
				return res.status(400).json({ message: '잘못된 요청 값' });
		}
	} catch (error) {
		return res.status(500).json({ message: 'Server Error', error });
	}
});

router.post('/profile', upload.single('image'), async (req, res) => {
	try {
		const image = req.file.location;
		const { userId } = req.query;
		if (image === undefined) {
			return res.status(400).json({ message: '이미지가 존재하지 않습니다.' });
		}
		const result = await User.update({ profile: image }, { where: { id: userId } });
		return res.status(result ? 200 : 500).json({ success: result ? true : false, data: { image } });
	} catch (error) {
		return res.status(500).json({ message: '서버 에러' });
	}
});

module.exports = router;
