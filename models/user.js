const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			// define association here
		}
	}
	User.init(
		{
			email: DataTypes.STRING,
			password: DataTypes.STRING,
			nickname: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'User',
		},
	);

  User.static.find = () => {

  }

  User.static.compare = () => {
    
  }

	return User;
};
