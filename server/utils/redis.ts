import Redis from "ioredis";

require("dotenv").config();

// Create Redis client
const redisClient = () => {
    if (process.env.REDIS_URL) {
        const redis = new Redis(process.env.REDIS_URL);
        console.log(`Redis connected`);
        return redis;
    }
    throw new Error("Redis connection failed");
};

// Export Redis instance
export const redis = redisClient();
