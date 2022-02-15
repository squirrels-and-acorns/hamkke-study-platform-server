import express from 'express';

const app = express();
// json parser
app.use(express.json());
// form data
app.use(express.urlencoded());

app.get('/', (req, res) => {
  return res.send('Welcome Hamkke!!!')
})

app.listen(5001, () => {
  console.log('Connected...');
})