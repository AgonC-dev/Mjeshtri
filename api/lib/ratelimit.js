import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './redis.js';

export const apiRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '1 m'),
    analytics: true,
    prefix: '@upstash/ratelimit/api',
})

export const uidRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 d'),
    analytics: true,
    prefix: '@upstash/ratelimit/uid',
})