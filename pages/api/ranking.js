import { createClient } from '@vercel/kv';


const getRanking = async (req, res) => {
    const blockGameRedis = createClient({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
    });

    const rankingArray = await blockGameRedis.zrange('ranking', 0, 9, { withScores: true, rev: true });

    const ranking = []

    for (let i = 0; i < rankingArray.length; i += 2) {
        const name = rankingArray[i];
        const score = rankingArray[i + 1];
        ranking.push({ name, score });
    }

    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "https://block-game-kappa.vercel.app");
    res.setHeader('Content-Type', 'application/json');
    res.json(ranking);
}

const postRanking = async (req, res) => {
    const blockGameRedis = createClient({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
    });
    console.log(req.body)
    // const body = JSON.parse(req.body);

    const name = req.body['name']

    const score = req.body['score']

    const result = await blockGameRedis.zadd('ranking', { score: score, member: name })

    res.statusCode = 201
    res.json()
}

const methods = {
    'GET': getRanking,
    'POST': postRanking
}

export default async function handler(req, res) {
    const methodHandler = methods[req.method]

    if (methodHandler === null || typeof (methodHandler) === 'undefined') {
        res.statusCode = 404
        res.json()
        return;
    }

    await methodHandler(req, res);
}