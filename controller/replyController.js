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

		const reply = await Reply.findAll({ where: { postId } });

		const convertReplyList = await Promise.all(
			reply.map(async (rp) => {
				const { dataValues } = rp;
				const { userId } = dataValues;

				const user = await User.findOne({ where: { id: userId } });
        const { dataValues: data } = user;
        const { nickname } = data;
        
        dataValues.nickname = nickname;
        return dataValues;
			}),
		);

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

module.exports = { getReply, createReply };
