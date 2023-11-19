import { createClient } from '@vercel/kv';
 
export default async function getValues() {
  const users = createClient({
    url: process.env.KV_DB_REST_API_URL,
    token: process.env.KV_DB_REST_API_TOKEN,
  });
 
  const user = await users.hgetall('users');

  return response.status(200).json({ user });
}