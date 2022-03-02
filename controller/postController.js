const db = require('../models');

const Post = db.Post;
const User = db.User;

const createPost = async (req, res) => {
	try {
		const { title, contents, tags, userId } = req.body;

		await Post.create({
			title,
			contents,
			userId,
			tags: tags.join(','),
		});

		return res.status(200).json({ success: true });
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}
};

const updatePost = async (req, res) => {
	try {
		const { postId: id, title, contents, tags } = req.body;

		await Post.update(
			{ title, contents, tags: tags.join(',') },
			{ where: { id } },
		);
		return res.status(200).json({ success: true });
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}
};

const deletePost = async (req, res) => {
	try {
		const { params } = req;
		const { id } = params;

		const deleted = await Post.destroy({ where: { id } });

		if (deleted) {
			return res.status(200).json({ success: true });
		} else {
			return res.status(400).json({ message: '잘못된 Post Id' });
		}
	} catch (error) {
		return res.status(500).json({ message: 'DB Connect Fail...', error });
	}
};

const getPosts = async (req, res) => {
	try {
		const posts = await Post.findAll({
			include: [
				{
					model: User,
					as: 'user',
					attributes: ['id', 'nickname'],
				},
			],
			attributes: { exclude: ['userId'] },
		});
		return res.status(200).json({ posts });
	} catch (error) {
		return res.status(500).json({ message: 'DB Connect Fail...', error });
	}
};

const getPost = async (req, res) => {
	try {
		const { params } = req;
		const { id } = params;

		const post = await Post.findOne({
			include: [
				{
					model: User,
					as: 'user',
					attributes: ['id', 'nickname'],
				},
			],
			where: { id },
			attributes: { exclude: ['userId'] },
		});

		if (post) {
			return res.status(200).json({ post });
		} else {
			return res.status(400).json({ message: '잘못된 Post Id' });
		}
	} catch (error) {
		return res.status(500).json({ message: 'DB Connect Fail...', error });
	}
};

module.exports = { createPost, updatePost, deletePost, getPost, getPosts };
