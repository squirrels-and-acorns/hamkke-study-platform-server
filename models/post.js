const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Post extends Model {
		static associate(models) {
			Post.belongsTo(models.User, {
				foreignKey: 'userId',
				as: 'user',
				onDelete: 'SET NULL',
			});
		}
	}
	Post.init(
		{
			title: { type: DataTypes.STRING, allowNull: false },
			contents: { type: DataTypes.STRING, allowNull: false },
			tags: { type: DataTypes.STRING, allowNull: false },
		},
		{
			sequelize,
			modelName: 'Post',
		},
	);
	return Post;
};
