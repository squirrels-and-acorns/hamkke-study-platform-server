const express = require('express');
const { getReply, createReply } = require('../controller/replyController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reply
 *   description: 댓글 읽기 추가 수정 삭제
 */

/**
 * @swagger
 * paths:
 *   /api/reply/:
 *     get:
 *       summary: "댓글 리스트"
 *       description: "댓글 리스트 요청"
 *       tags: [Reply]
 *       parameters:
 *         - in: query
 *           name: postId
 *           description: 게시글 아이디
 *           schema:
 *             type: number
 *       responses:
 *         "200":
 *           description: 조회 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example:
 *                       true
 *                   reply:
 *                     type: array
 *                     example:
 *                       [
 *                         { id: 0, postId: 0, userId: 0, nickname: 'quokka', contents: '댓글 테스트', createdAt: '생성날짜', updatedAt: '업데이트 날짜' },
 *                         { id: 1, postId: 0, userId: 0, nickname: 'quokka', contents: '댓글 테스트2', createdAt: '생성날짜', updatedAt: '업데이트 날짜' }
 *                       ]
 */
router.get('/', getReply);

/**
 * @swagger
 * paths:
 *   /api/reply/:
 *     post:
 *       summary: "댓글 생성"
 *       description: "댓글 생성 요청"
 *       tags: [Reply]
 *       requestBody:
 *         description: 생성할 댓글 정보
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 postId:
 *                   type: number
 *                   description: 포스트 아이디
 *                 userId:
 *                   type: number
 *                   description: 유저 아이디
 *                 contents:
 *                   type: string
 *                   description: 댓글 내용
 *       responses:
 *         "200":
 *           description: 생성 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example:
 *                       true
 *                   reply:
 *                     type: object
 *                     example:
 *                       { id: 0, postId: 0, userId: 0, nickname: 'quokka', contents: '댓글 테스트', createdAt: '생성날짜', updatedAt: '업데이트 날짜' }
 */
router.post('/', createReply);

module.exports = router;
