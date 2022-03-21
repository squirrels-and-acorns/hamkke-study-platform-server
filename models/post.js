const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Post extends Model {
		static associate(models) {
			Post.belongsTo(models.User, {
				foreignKey: 'userId',
				as: 'user',
				onDelete: 'cascade',
			});
		}
	}
	Post.init(
		{
			title: { type: DataTypes.STRING, allowNull: false },
			contents: { type: DataTypes.STRING(1500), allowNull: false },
			stacks: { type: DataTypes.STRING, allowNull: false },
		},
		{
			sequelize,
			modelName: 'Post',
		},
	);
	return Post;
};
