import express from 'express';
import morgan from 'morgan';
import { kv } from '@vercel/kv';
import getValues from './create-client.js';

const PORT = process.env.PORT || 3000

const app = express();
//Configuraciones
app.set('port', PORT);
app.set('json spaces', 2)

//Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', () => getValues())

app.listen(PORT, () => {
    console.log(`Server listening on port ${app.get('port')}`);
});