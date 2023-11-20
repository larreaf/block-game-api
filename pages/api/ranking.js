import fetchCached from '../../fetchCached.js'
import { cacheGet, cacheSet, cacheExpire } from '../../customCache.js'

const getRanking = async (req, res) => {
    const { result: rankingArray } = await fetchCached(`${process.env.KV_REST_API_URL}/ZRANGE/ranking/0/9/WITHSCORES/REV`, {
        headers: {
            Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
        cache: { expiration: 3600, tag: 'ranking' }
    });

    // const { result: rankingArray } = await fetchResponse.json();

    const ranking = []

    for (let i = 0; i < rankingArray.length; i += 2) {
        const name = rankingArray[i].slice(0, rankingArray[i].indexOf(':'));
        const score = rankingArray[i + 1];
        ranking.push({ name, score });
    }

    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "https://block-game-kappa.vercel.app");
    res.setHeader('Content-Type', 'application/json');
    res.json(ranking);
}

const postRanking = async (req, res) => {
    const name = req.body['name']

    const score = req.body['score']

    const timestamp = Date.now();
    
    const response = await fetch(`${process.env.KV_REST_API_URL}/multi-exec`, {
        headers: {
            Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
        // ZADD ranking score name
        // HGET sessionData userEmail
        body: `[
          ["ZADD", "ranking", "${score}", "${name}:${timestamp}"],
          ["PFADD", "gamesPlayed", "${name}:${timestamp}"]
        ]`,
        method: 'POST',
    });
    
    cacheExpire('ranking');
    cacheExpire('gamesPlayed');

    const result = await response.json();
    
    // const result = await blockGameRedis.zadd('ranking', { score: score, member: name })
    // const {result: result1} = result[0]
    console.log({response})
    console.log({result})

    // if(result1 === 1){
    //     res.statusCode = 201
    //     res.json({name, score, success: Boolean(result1)})
    //     return
    // }

    res.statusCode = 201
    res.json({name, score, result})

    // res.statusCode = 505
    // res.json({error: "An error occured", success: false})
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