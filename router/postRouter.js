const express = require('express');
const router = express.Router();
const {
	createPost,
	updatePost,
	deletePost,
	getPost,
	getPosts,
	updateCompletePost,
} = require('../controller/postController');

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: 게시글 추가 수정 삭제 조회
 */

/**
 * @swagger
 * paths:
 *   /api/post/:
 *     get:
 *       summary: "게시글 리스트"
 *       description: "게시글 리스트 요청"
 *       tags: [Post]
 *       parameters:
 *         - in: query
 *           name: stacks
 *           description: 언어 스택
 *           schema:
 *             type: array
 *         - in: query
 *           name: limit
 *           description: 게시글 갯수
 *           schema:
 *             type: number
 *         - in: query
 *           name: page
 *           description: 페이지
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
 *                   posts:
 *                     type: array
 *                     example:
 *                       [
 *                         { "id": 2, "title": "Test Title", "stacks": [ "js", "ts", "java"], "createdAt": "2022-03-15T15:56:20.000Z", "updatedAt": "2022-03-15T15:56:20.000Z"},
 *                         { "id": 3, "title": "자바공부하실분", "stacks": [ "js", "ts", "java"], "createdAt": "2022-03-15T15:56:20.000Z", "updatedAt": "2022-03-15T15:56:20.000Z"}
 *                       ]
 */
router.get('', getPosts);

/**
 * @swagger
 * paths:
 *   /api/post/:id:
 *     get:
 *       summary: "상세 게시글"
 *       description: "상세 게시글 요청"
 *       tags: [Post]
 *       parameters:
 *         - in: params
 *           name: postId
 *           description: 포스트 아이디
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
 *                   post:
 *                     type: object
 *                     example:
 *                       {
 *                         "id": 2,
 *                         "title": "Test Title",
 *                         "contents": "Test Content",
 *                         "stacks": [ "js", "ts", "java" ],
 *                         "createdAt": "2022-03-15T15:56:20.000Z",
 *                         "updatedAt": "2022-03-15T15:56:20.000Z",
 *                         "user": {
 *                           "id": 1,
 *                           "nickname": "test"
 *                         }
 *                       }
 */
router.get('/:id', getPost);

/**
 * @swagger
 * paths:
 *   /api/post/:
 *     post:
 *       summary: "게시글 생성"
 *       description: "게시글 생성 요청"
 *       tags: [Post]
 *       requestBody:
 *         description: 게시글 정보를 전달합니다.
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: 제목
 *                 contents:
 *                   type: string
 *                   description: 내용
 *                 tags:
 *                   type: array
 *                   description: 기술 스택
 *                 userId:
 *                   type: number
 *                   description: 유저 아이디
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
 */
router.post('', createPost);

/**
 * @swagger
 * paths:
 *   /api/post/:
 *     put:
 *       summary: "게시글 수정"
 *       description: "게시글 수정 요청"
 *       tags: [Post]
 *       requestBody:
 *         description: 게시글 정보를 전달합니다.
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: 제목
 *                 contents:
 *                   type: string
 *                   description: 내용
 *                 tags:
 *                   type: array
 *                   description: 기술 스택
 *                 postId:
 *                   type: number
 *                   description: 포스트 아이디
 *       responses:
 *         "200":
 *           description: 수정 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 */
router.put('', updatePost);

/**
 * @swagger
 * paths:
 *   /api/post/:id:
 *     delete:
 *       summary: "게시글 삭제"
 *       description: "게시글 삭제 요청"
 *       tags: [Post]
 *       parameters:
 *         - in: params
 *           name: postId
 *           description: 포스트 아이디
 *           schema:
 *             type: number
 *       responses:
 *         "200":
 *           description: 삭제 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 */
router.delete('/:id', deletePost);

/**
 * @swagger
 * paths:
 *   /api/post/complete/:id:
 *     put:
 *       summary: "게시글 모집 상태 변경"
 *       description: "게시글 상태 변경 요청ㄴ"
 *       tags: [Post]
 *       parameters:
 *         - in: params
 *           name: postId
 *           description: 포스트 아이디
 *           schema:
 *             type: number
 *       responses:
 *         "200":
 *           description: 변경 완료
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   completed:
 *                     type: boolean
 */
router.put('/completed/:id', updateCompletePost)

module.exports = router;
