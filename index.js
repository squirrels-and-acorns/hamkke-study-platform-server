const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

//local
const swaggerOptions = require('./swagger.js');
const userRouter = require('./router/userRouter');
const postRouter = require('./router/postRouter');
const sequelize = require('./models').sequelize;

const app = express();
const specs = swaggerJsDoc(swaggerOptions);
const PORT = 5002;

// json parser
app.use(express.json());
// form data
app.use(express.urlencoded());
// cookie Read
app.use(cookieParser());
// log
app.use(morgan('dev'));
// security header
app.use(helmet());
// cors
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	}),
);
app.use(
	'/swagger',
	swaggerUi.serve,
	swaggerUi.setup(specs),
);

sequelize.sync({ alter: true });

app.get('/', (req, res) => {
	return res.send('Welcome Hamkke!!');
});

app.use('/api/users', userRouter);
app.use('/api/post', postRouter);

app.listen(PORT, () => {
	console.log('Connected...');
	console.log(`PORT is ${PORT}`)
});
