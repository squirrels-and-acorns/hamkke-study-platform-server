const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			// define association here
		}
	}
	User.init(
		{
			email: { type: DataTypes.STRING, allowNull: false },
			password: { type: DataTypes.STRING, allowNull: false },
			nickname: { type: DataTypes.STRING, allowNull: false },
			profile: { type: DataTypes.STRING, allowNull: true },
			removed: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			modelName: 'User',
		},
	);

	return User;
};
