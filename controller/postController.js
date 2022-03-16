const db = require('../models');

const Post = db.Post;
const User = db.User;

const createPost = async (req, res) => {
	try {
		const { title, contents, stacks: tag, userId } = req.body;
		const stacks = tag.join(',');

		await Post.create({
			title,
			contents,
			userId,
			stacks,
		});

		return res.status(200).json({ success: true });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}
};

const updatePost = async (req, res) => {
	try {
		const { postId: id, title, contents, stacks: tag } = req.body;

		await Post.update(
			{ title, contents, stacks: tag.join(',') },
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
		const { query } = req;
		const { stacks: tag, limit, page } = query;
		const startIndex = (+page - 1) * limit;
		const endIndex = +page * limit;
		const posts = await Post.findAll({
			order: [['id', 'DESC']],
			attributes: ['id', 'title', 'stacks', 'createdAt', 'updatedAt'],
		});

		const convertPosts = posts.map((post) => {
			post.stacks = post.stacks.split(',');
			return post;
		});

		let result;

		if (tag) {
			const tagHash = {};

			tag.forEach((tag) => {
				tagHash[tag] = 1;
			});

			result = convertPosts.filter((post) => {
				return post.stacks.find((stack) => stack in tagHash);
			});
			console.log(limit, page);
			console.log(startIndex, endIndex);
			result = result.slice(startIndex, endIndex);
		}

		const result2 = convertPosts.slice(startIndex, endIndex);

		return res.status(200).json({ posts: result ? result : result2 });
	} catch (error) {
		console.log(error);
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
			post.stacks = post.stacks.split(',');
			return res.status(200).json({ post });
		} else {
			return res.status(400).json({ message: '잘못된 Post Id' });
		}
	} catch (error) {
		return res.status(500).json({ message: 'DB Connect Fail...', error });
	}
};

module.exports = { createPost, updatePost, deletePost, getPost, getPosts };
