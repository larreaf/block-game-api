import { cacheGet, cacheSet } from './customCache.js'

export default async function fetchCached(url, {headers, cache: {tag, expiration}}){
    const cachedResult = cacheGet(tag)
    
    if(cachedResult)
        return cachedResult;
    
    const response = await fetch(url, {headers});

    const value = await response.json();
    
    cacheSet(tag, value, expiration);
    return value;
}