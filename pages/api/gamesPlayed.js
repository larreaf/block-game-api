import fetchCached from '../../fetchCached.js'
import { cacheGet, cacheSet, cacheExpire } from '../../customCache.js'

export default async function handler(req, res) {

  const { result } = await fetchCached(`${process.env.KV_REST_API_URL}/PFCOUNT/gamesPlayed`, {
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
    },
    cache: { expiration: 3600, tag: 'gamesPlayed' }
  });

  res.statusCode = 200;
  res.setHeader("Access-Control-Allow-Origin", "https://block-game-kappa.vercel.app");
  res.setHeader('Content-Type', 'application/json');

  res.json({ gamesPlayed: result });
}
