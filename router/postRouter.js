const express = require('express');
const router = express.Router();
const {
	createPost,
	updatePost,
	deletePost,
	getPost,
	getPosts,
} = require('../controller/postController');

router.get('', getPosts);
router.get('/:id', getPost);
router.post('', createPost);
router.put('', updatePost);
router.delete('', deletePost);

module.exports = router;
