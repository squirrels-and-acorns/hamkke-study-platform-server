const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');

//local
const userRouter = require('./router/userRouter');
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

sequelize.sync({ alter: true });

app.get('/', (req, res) => {
  return res.send('Welcome Hamkke!!!');
});

app.use('/users', userRouter);

app.listen(5002, () => {
  console.log('Connected...');
});
