import { createClient } from '@vercel/kv';

export default async function get_top10_ranking() {
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
  
    return ranking;
  }