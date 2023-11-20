import { createClient } from '@vercel/kv';

export default function createKVClient() {
  createClient({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

