const express = require('express');
const { body, validationResult } = require('express-validator');

const db = require('../models');
const User = db.User;

const router = express.Router();

router.post('/login', (req, res) => {
	res.send('로그인 요청 들어왔습니다!!');
	// 로그인 로직
	// 1. 아이디 디비에 있는지 확인한다.
	// 1-1. 없다면 -> 401 -> 존재하지않는 이메일 입니다.
	// 2. 비밀번호 확인한다. (받은 패스워드 암호화 해서 비교하기)
	// 2-1. 없다면 -> 401 -> 비밀번호가 틀립니다.
	// 3. 토큰을 생성한다.
	// 4. 클라이언트 쿠키에 토큰을 저장하고, 유저 정보를 응답으로 보내준다.
});

router.post(
	'/register',
	body('email').isEmail(),
	body('password').isLength({ min: 5 }),
  body('nickname').not(),
	(req, res) => {
    // 회원가입 로직
    // 1. 유효성 검사
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

		const { email, password, nickname } = req.body;
		// 2. 디비에 존재하는 아이디인지 확인
    
		// 2-1. 존재한다면 -> 41 -> 이미 존재하는 이메일 입니다.
		// 3. 비밀번호 Bcrypt로 암호화
		// 4. 데이터 베이스 저장
		// 5. 성공했다고 응답
	},
);

module.exports = router;
