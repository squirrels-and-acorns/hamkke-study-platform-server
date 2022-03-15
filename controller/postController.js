const db = require('../models');
 
const Post = db.Post;
const User = db.User;

const createPost = async (req, res) => {
	try {
		const { title, contents, tags, userId } = req.body;
		const stacks = tags.join(',');

		await Post.create({
			title,
			contents,
			userId,
			stacks
		});

		return res.status(200).json({ success: true });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}
};

const updatePost = async (req, res) => {
	try {
		const { postId: id, title, contents, tags } = req.body;

		await Post.update({ title, contents, stacks: tags.join(',') }, { where: { id } });

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
		const { tags } = query;
		const posts = await Post.findAll({ attributes: ["id", "title", "stacks", "createdAt", "updatedAt"] });



		const convertPosts = posts.map(post => {
			post.stacks = post.stacks.split(',');
			return post;
		})
		let result;
		if(tags) {
			const tagHash = {};

			tags.forEach(tag => {
				tagHash[tag] = 1;
			})

			result = convertPosts.filter(post => {
				return post.stacks.find(stack => stack in tagHash);
			})

		}



		return res.status(200).json({ posts: result ? result : convertPosts, tags });
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
