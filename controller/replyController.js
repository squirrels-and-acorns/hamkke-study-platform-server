const db = require('../models');
// const { isEmpty } = require('lodash');

const Reply = db.Reply;
// const Post = db.Post;
const User = db.User;
// const Like = db.Like;

const getReply = async (req, res) => {
	try {
		const { query } = req;
		const { postId } = query;

		const reply = await Reply.findAll({ where: { postId }, order: [['id', 'DESC']] });

		const convertReplyList = await Promise.all(
			reply.map(async (rp) => {
				const reply = rp.dataValues;
				const userId = reply.userId;
				const data = await User.findOne({ where: { id: userId } });
				const user = data && data.dataValues;
				reply.nickname = user?.nickname;

				return reply;
			}),
		);

		convertReplyList.sort((a, b) => a - b);

		res.status(200).json({ success: true, reply: convertReplyList });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, message: '리스트를 가져오는데 실패, 서버 에러' });
	}
};

const createReply = async (req, res) => {
	try {
		const { postId, userId, contents } = req.body;

		const reply = await Reply.create({ postId, userId, contents });

		return res.status(201).json({ success: true, reply });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ success: false, message: 'Server Error' });
	}
};

const updateReply = async (req, res) => {
	try {
		const { replyId, contents } = req.body;

		const [success] = await Reply.update(
			{ contents },
			{ where: { id: replyId } },
		);
		if (success) {
			return res.status(200).json({ success: true });
		}
		return res.status(400).json({
			success: false,
			message: '유효하지 않는 값입니다(댓글 아이디 또는 내용)',
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ success: false, message: '서버에러' });
	}
};

const deleteReply = async (req, res) => {
	try {
		const { query } = req;
		const { replyId } = query;

		const result = await Reply.destroy({ where: { id: replyId } });

		if (result) {
			return res.status(200).json({ success: true, replyId });
		} else {
			return res.status(400).json({
				success: false,
				message: '잘못된 댓글 아이디 또는 이미 삭제된 댓글 입니다',
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ success: false, message: '서버에러' });
	}
};

module.exports = { getReply, createReply, updateReply, deleteReply };
