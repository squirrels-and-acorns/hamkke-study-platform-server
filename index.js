const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');

//local
const userRouter = require('./router/userRouter');
const postRouter = require('./router/postRouter');
const sequelize = require('./models').sequelize;

const app = express();

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

sequelize.sync({ force: true });

app.get('/', (req, res) => {
	return res.send('Welcome Hamkke!!');
});

app.use('/api/users', userRouter);
app.use('/api/post', postRouter);

app.listen(5002, () => {
	console.log('Connected...');
});
