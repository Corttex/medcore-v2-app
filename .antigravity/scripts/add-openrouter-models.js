// Adicionar modelos OpenRouter dinamicamente
const openRouterModels = [
  {
    id: 'glm-5.1',
    name: 'GLM-5.1',
    provider: 'openrouter',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    maxTokens: 32000,
    contextWindow: 128000,
    temperature: 0.7,
    cost: 'free'
  },
  {
    id: 'qwen-coder',
    name: 'Qwen 2.5 Coder',
    provider: 'openrouter',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    maxTokens: 32000
  }
];

// Registrar modelos no Antigravity
openRouterModels.forEach(model => {
  antigravity.registerModel({
    ...model,
    apiKey: process.env.OPENROUTER_API_KEY,
    headers: {
      'HTTP-Referer': 'https://antigravity.dev',
      'X-Title': 'Antigravity IDE'
    }
  });
});

console.log('✅ Modelos OpenRouter registrados:', openRouterModels.map(m => m.name));