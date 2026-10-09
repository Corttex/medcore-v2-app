import Redis from 'ioredis';

// Cria uma conexão única com o Redis para reutilização
const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null // Necessário para o BullMQ
};

export const connection = new Redis(redisConfig);
