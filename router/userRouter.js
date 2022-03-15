const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const upload = require('../module/multer');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 유저 추가 수정 삭제 조회
 */
const {
	authCheck,
	loginUser,
	registerUser,
	updateUser,
	uploadUserProfile,
	deleteUser,
} = require('../controller/userController');

/**
 * @swagger
 * paths:
 *   /api/users/auth:
 *     get:
 *       summary: "유저 토큰 인증"
 *       description: "유저의 토큰 유효체크 요청"
 *       tags: [Users]
 *       responses:
 *         "200":
 *           description: 토큰 유효 정보
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   user:
 *                     type: object
 *                     example:
 *                       { "id": 1, "email": "hamkke@org.com", "nickname": "hamkke", "profile": "image url", "createdAt": "생성일", "updatedAt": "수정일"}
 */
router.get('/auth', authCheck);

/**
 * @swagger
 * paths:
 *   /api/users/login:
 *     post:
 *       summary: "로그인"
 *       description: "로그인 요청"
 *       tags: [Users]
 *       requestBody:
 *         description: 사용자의 이메일과 비밀번호를 전달합니다.
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   description: 이메일
 *                 password:
 *                   type: string
 *                   description: 비밀번호
 *       responses:
 *         "200":
 *           description: 로그인 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   user:
 *                     type: object
 *                     example:
 *                       { "id": 1, "email": "hamkke@org.com", "nickname": "hamkke", "profile": "image url", "createdAt": "생성일", "updatedAt": "수정일"}
 */

router.post('/login', loginUser);

/**
 * @swagger
 * paths:
 *   /api/users/register:
 *     post:
 *       summary: "회원가입"
 *       description: "회원가입 요청"
 *       tags: [Users]
 *       requestBody:
 *         description: 회원가입 정보를 전달합니다.
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   description: 이메일
 *                 password:
 *                   type: string
 *                   description: 비밀번호
 *                 nickname:
 *                   type: string
 *                   description: 닉네임
 *       responses:
 *         "200":
 *           description: 회원가입 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 */
router.post(
	'/register',
	body('email').isEmail(),
	body('password').isLength({ min: 5 }),
	body('nickname').not(),
	registerUser,
);

/**
 * @swagger
 * paths:
 *   /api/users/:
 *     put:
 *       summary: "회원정보 수정"
 *       description: "회원정보 수정 요청"
 *       tags: [Users]
 *       requestBody:
 *         description: 변경된 회원정보를 전달합니다.
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: number
 *                   description: 유저 아이디
 *                 password:
 *                   type: string
 *                   description: 비밀번호
 *                 nickname:
 *                   type: string
 *                   description: 닉네임
 *                 tags:
 *                   type: array
 *                   description: 언어
 *       responses:
 *         "200":
 *           description: 회원정보 수정 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 */
router.put('/', updateUser);

/**
 * @swagger
 * paths:
 *   /api/users/profile:
 *     post:
 *       summary: "프로필 이미지 수정"
 *       description: "프로필 이미지 수정 요청"
 *       tags: [Users]
 *       parameters:
 *         - in: query
 *           name: userId
 *           required: true
 *           description: 유저 아이디
 *           schema:
 *             type: number
 *       requestBody:
 *         description: 이미지 파일을 전달합니다.
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   type: file
 *                   description: 이미지 파일
 *       responses:
 *         "200":
 *           description: 프로필 이미지 수정 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   image:
 *                     type: string
 */
router.post('/profile', upload.single('image'), uploadUserProfile);

/**
 * @swagger
 * paths:
 *   /api/users/:
 *     delete:
 *       summary: "회원 삭제"
 *       description: "회원 삭제 요청"
 *       tags: [Users]
 *       parameters:
 *         - in: query
 *           name: userId
 *           required: true
 *           description: 유저 아이디
 *           schema:
 *             type: number
 *       responses:
 *         "200":
 *           description: 회원 삭제 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 */
router.delete('/', deleteUser);

module.exports = router;
