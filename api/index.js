import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import get_top10_ranking from './ranking.js';
import * as dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express();
//Configuraciones
app.set('port', PORT);
app.set('json spaces', 2)

//Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
}))

app.get('/ranking', async (req, res) => {
    const ranking = await get_top10_ranking();
    res.send(ranking);
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${app.get('port')}`);
});