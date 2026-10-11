import Redis from 'ioredis';

let redisInstance: Redis | null = null;

export function getRedisConnection(): Redis {
  if (!redisInstance) {
    redisInstance = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: null,
      lazyConnect: true,
      enableOfflineQueue: false,
      retryStrategy(times) {
        // Interrompe tentativas contínuas para não travar builds se o Redis estiver ausente
        if (times > 2) return null;
        return 1000;
      }
    });

    redisInstance.on('error', (err) => {
      // Silencia erros de conexão offline para não poluir ou pausar o build
      if (process.env.NODE_ENV !== 'production' || !process.env.REDIS_HOST) {
        // Modo dev ou sem Redis configurado
        return;
      }
      console.warn('[Redis] Conexão indisponível:', err.message);
    });
  }
  return redisInstance;
}

export const connection = new Proxy({} as Redis, {
  get(target, prop, receiver) {
    return Reflect.get(getRedisConnection(), prop, receiver);
  }
});

