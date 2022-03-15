const options = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: 'Hamkke Service with swagger',
			version: '1.0.0',
			description: 'API Document',
		},
		servers: [
			{
				url: 'http://localhost:5002',
			},
		],
	},
	apis: ['./models/*.js', './router/*.js'],
};

module.exports = options;
