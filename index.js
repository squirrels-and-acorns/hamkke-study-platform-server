import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

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

app.get('/', (req, res) => {
  return res.send('Welcome Hamkke!!!');
});

app.listen(5002, () => {
  console.log('Connected...');
});
