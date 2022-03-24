'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Reply extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Reply.belongsTo(models.Post, {
				foreignKey: 'postId',
				as: 'post',
				onDelete: 'cascade',
			});
			Reply.belongsTo(models.User, {
				foreignKey: 'userId',
				as: 'user',
				onDelete: 'cascade',
			});
		}
	}
	Reply.init(
		{
			postId: DataTypes.INTEGER,
			userId: DataTypes.INTEGER,
			contents: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'Reply',
		},
	);
	return Reply;
};
