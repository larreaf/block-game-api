import { createClient } from '@vercel/kv';

function getCORSHeaderOrigin($allowed, $input)
{
    if ($allowed == '*') {
        return '*';
    }

    $allowed = preg_quote($allowed, '/');

    if (($wildcardPos = strpos($allowed, '*')) !== false) {
        $allowed = str_replace('*', '(.*)', $allowed);
    }

    $regexp = '/^' . $allowed . '$/';

    if (!preg_match($regexp, $input, $matches)) {
        return 'none';
    }

    return $input;
}

export default async function handler(req, res) {
    const blockGameRedis = createClient({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
    });
    
    const rankingArray = await blockGameRedis.zrange('ranking', 0, 9, {withScores: true, rev: true});

    const ranking = []

    for (let i = 0; i < rankingArray.length; i += 2) {
    const name = rankingArray[i];
    const score = rankingArray[i + 1];
    ranking.push({ name, score });
    }

    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", getCORSHeaderOrigin('https://*.vercel.app', req.headers['Origin']));
    res.setHeader('Content-Type', 'application/json');
    res.json(ranking);
}