const db = require('../models');

// 리스트 , 상세, 좋아요

const Post = db.Post;
const User = db.User;
const Like = db.Like;

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
		const {
			stacks: tag,
			limit,
			page,
			sort = 'recent',
			completed = false,
		} = query;
		const startIndex = (+page - 1) * limit;
		const endIndex = +page * limit;
		const completedConvert = completed === 'true' ? true : false;
		const order = [sort === 'recent' ? ['id', 'DESC'] : ['hit', 'DESC']];
		const findAllOptions = {
			order,
			attributes: [
				'id',
				'title',
				'stacks',
				'hit',
				'completed',
				'createdAt',
				'updatedAt',
			],
		};

		if (!completedConvert) {
			findAllOptions['where'] = { completed: completedConvert };
		}

		const posts = await Post.findAll(findAllOptions);

		const convertPosts = await Promise.all(
			posts.map(async (post) => {
				const { dataValues } = post;
				dataValues.like = await Like.count({ where: { postId: post.id } });
				dataValues.stacks = dataValues.stacks.split(',');
				return dataValues;
			}),
		);

		if (tag) {
			const tagHash = {};

			tag.forEach((tag) => {
				tagHash[tag] = 1;
			});

			const filterPosts = convertPosts.filter((post) => {
				return post.stacks.find((stack) => stack in tagHash);
			});
			const resultPosts = filterPosts.slice(startIndex, endIndex);
			const isLastPost = !filterPosts[endIndex];
			return res.status(200).json({ posts: resultPosts, isLastPost });
		}

		const resultPosts = convertPosts.slice(startIndex, endIndex);
		const isLastPost = !convertPosts[endIndex];

		return res.status(200).json({ posts: resultPosts, isLastPost });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'DB Connect Fail...', error });
	}
};

const getPost = async (req, res) => {
	try {
		const { params } = req;
		const { query } = req;
		const { id: postId } = params;
		const { userId } = query;

		const { dataValues } = await Post.findOne({
			include: [
				{
					model: User,
					as: 'user',
					attributes: ['id', 'nickname'],
				},
			],
			where: { id: postId },
			attributes: { exclude: ['userId'] },
		});

		const like = await Like.count({ where: { postId: dataValues.id } });
		const isLike = userId && await Like.findOne({ where: { postId, userId } });

		if (dataValues) {
			await Post.update({ hit: dataValues.hit + 1 }, { where: { id: postId } });
			dataValues.stacks = dataValues.stacks.split(',');
			dataValues.hit++;
			dataValues.like = like;
			dataValues.isLike = !!isLike;
			return res.status(200).json({ post: dataValues });
		} else {
			return res.status(400).json({ message: '잘못된 Post Id' });
		}
	} catch (error) {
		return res.status(500).json({ message: 'DB Connect Fail...', error });
	}
};

const updateCompletePost = async (req, res) => {
	try {
		const { params } = req;
		const { id } = params;

		// 조회
		const post = await Post.findOne({ where: { id } });
		// 업데이트
		const [result] = await Post.update(
			{ completed: !post.completed },
			{ where: { id } },
		);

		if (result) {
			return res
				.status(200)
				.json({ success: true, completed: !post.completed });
		}
	} catch (error) {
		return res.status(500).json({ success: false, message: 'ServerError' });
	}
};

const likePost = async (req, res) => {
	try {
		// Like에 해당하는 postId, userId 있는지 확인
		//   - 있으면 delete , { success: true, like: false }
		//   - 없으면 create , { success: true, like: true }
		const { userId, postId } = req.body;
		const like = await Like.findOne({ where: { userId, postId } });

		if (like) {
			await Like.destroy({ where: { postId, userId } });
			res.status(200).json({ success: true, like: false });
		} else {
			await Like.create({ postId, userId });
			res.status(200).json({ success: true, like: true });
		}
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Sever Error' });
	}
};

module.exports = {
	createPost,
	updatePost,
	deletePost,
	getPost,
	getPosts,
	updateCompletePost,
	likePost,
};
