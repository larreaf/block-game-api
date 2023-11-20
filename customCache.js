const cache = {}

export const cacheSet = (key, value, expirationSeconds = 0) => cache[key] = { value, expiration: Date.now() + expirationSeconds * 1000 }

export const cacheGet = (key) => {
    const item = cache[key];

    if (item && 
        (item.expiration === 0 || Date.now() < item.expiration)) {
        return item.value;
    }
    
    delete cache[key]

    return null;
}

export const cacheExpire = (key) => delete cache[key]