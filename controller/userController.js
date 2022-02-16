const loginUser = async (req, res) => {
	// 로그인 로직
	const { email, password } = req.body;
	try {
		// 1. 아이디 디비에 있는지 확인한다.
		const findUser = await User.findOne({ where: { email } });

		if (!findUser) {
			// 1-1. 없다면 -> 401 -> 존재하지않는 이메일 입니다.
			return res.status(409).json({ message: '존재하지 않는 이메일 입니다.' });
		}

		const {
			dataValues: { password: dbPassword },
		} = findUser;

		// 2. 비밀번호 확인한다. (받은 패스워드 암호화 해서 비교하기)
		bcrypt.compare(password, dbPassword, (err, isMatch) => {
			if (isMatch) {
				// 3. 토큰을 생성한다.
				const token = jwt.sign({ ...findUser, password: '' }, 'hello', {
					expiresIn: '1h',
				});
				// 4. 클라이언트 쿠키에 토큰을 저장하고, 유저 정보를 응답으로 보내준다.
				const { id, email, nickname } = findUser;

				return res
					.cookie('TID', token)
					.status(200)
					.json({ id, email, nickname });
			}
			// 2-1. 없다면 -> 401 -> 비밀번호가 틀립니다.
		});
	} catch (error) {}
};

const registerUser = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(401).json({ errors: errors.array() });
	}

	const { email, password: plainPassword, nickname } = req.body;
	// 2. 디비에 존재하는 아이디인지 확인
	User.findOne({ where: { email } })
		.then((data) => {
			if (data) {
				// 2-1. 존재한다면 -> 409 -> 이미 존재하는 이메일 입니다.
				return res.status(409).json({ message: '존재하는 이메일 입니다.' });
			}
			// 3. 비밀번호 Bcrypt로 암호화
			bcrypt.genSalt(saltRounds, (err, salt) => {
				if (err) {
					return res.send('서버 에러 잠시 후 시도해주세요!');
				}
				bcrypt.hash(plainPassword, salt, (err, hashPassword) => {
					if (err) {
						return res.send('서버 에러 잠시 후 시도해주세요!');
					}
					// 4. 데이터 베이스 저장
					User.create({ email, password: hashPassword, nickname }).then(() => {
						// 5. 성공했다고 응답
						return res.status(201).json({ success: true });
					});
				});
			});
		})
		.catch((error) => {
			// 에러 발생
			return res.status(500).json({ message: '서버 에러' });
		});
};

module.exports = { loginUser, registerUser };
