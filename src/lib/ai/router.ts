/**
 * TheViralFindsMY - Universal AI Multi-Router
 * 
 * Supports OpenAI-compatible providers:
 *   1. NVIDIA NIM (Primary - High Performance TensorRT GPU Inference)
 *   2. OpenRouter (Secondary / Auto-Failover Aggregator with Free Tiers)
 *   3. Kilo Gateway (Tertiary Fallback)
 * 
 * Features:
 *   - Automatic Failover between providers upon 429/timeout/errors
 *   - Native Malaysian dialect prompting (Kelate, Ganu, Utara, Manglish, Bahasa)
 *   - Serverless / Vercel Edge ready (Zero native binary dependencies)
 */

export type AIProvider = 'nvidia' | 'openrouter' | 'kilo';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIGenerateOptions {
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
  provider?: AIProvider;
}

export interface ViralScriptOptions {
  product: string;
  niche?: string;
  platform?: 'tiktok' | 'reels' | 'shorts' | 'telegram';
  language?: 'kelate' | 'ganu' | 'utara' | 'manglish' | 'bahasa';
  tone?: 'racun' | 'santai' | 'formal' | 'surirumah';
  targetAudience?: string;
}

export interface SocialCaptionOptions {
  product: string;
  affiliateUrl: string;
  originalPrice?: string | number;
  discountPrice?: string | number;
  commissionRate?: string | number;
  keyFeatures?: string[];
  language?: 'kelate' | 'ganu' | 'utara' | 'manglish' | 'bahasa';
}

const DIALECT_INSTRUCTIONS: Record<string, string> = {
  kelate: 'Gunakan loghat Kelantan (Kelate) yang pekat dan memikat. Selit perkataan seperti "gapo", "sohor", "bekwoh", "gak", "nyaknyo", "demo", "kawe", "kemah keming". Buat pembaca Kelantan rasa dekat dan percaya.',
  ganu: 'Gunakan loghat Terengganu (Ganu) yang pekat. Selit perkataan seperti "mung", "guane", "sapa", "dokang", "sangak", "dok", "nye", "kemas", "bulang". Jadikan ia bersahaja dan mesra Pantai Timur.',
  utara: 'Gunakan loghat Utara (Kedah/Penang) yang pekat. Selit perkataan seperti "hang", "depa", "habaq", "ligan", "cemuih", "segak", "ketegaq", "pi", "tula". Sesuai untuk audiens di Kedah, Perlis, dan Pulau Pinang.',
  manglish: 'Gunakan gaya Malaysian Manglish yang popular di media sosial. Campur English dan Bahasa Malaysia secara dinamik: "lah", "leh", "weih", "gila", "confirm", "best giler", "cannot go wrong", "padu beb".',
  bahasa: 'Tulis dalam Bahasa Malaysia santai dan rancak gaya influencer TikTok Malaysia. Gunakan perkataan seperti "korang", "racun", "murah gila", "auto checkout", "tengok ni".',
};

interface ProviderConfig {
  name: AIProvider;
  baseUrl: string;
  apiKey: string;
  defaultModel: string;
}

function getProviderConfigs(): ProviderConfig[] {
  return [
    {
      name: 'nvidia',
      baseUrl: (process.env.NVIDIA_NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1').replace(/\/$/, ''),
      apiKey: process.env.NVIDIA_NIM_API_KEY || '',
      defaultModel: process.env.NVIDIA_NIM_MODEL || 'meta/llama-3.3-70b-instruct',
    },
    {
      name: 'openrouter',
      baseUrl: (process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1').replace(/\/$/, ''),
      apiKey: process.env.OPENROUTER_API_KEY || '',
      defaultModel: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free',
    },
    {
      name: 'kilo',
      baseUrl: (process.env.KILO_BASE_URL || 'https://api.kilo.ai/v1').replace(/\/$/, ''),
      apiKey: process.env.KILO_API_KEY || '',
      defaultModel: process.env.KILO_MODEL || 'kilo-default',
    },
  ];
}

async function callProvider(
  config: ProviderConfig,
  messages: AIMessage[],
  temperature = 0.7,
  maxTokens = 1024
): Promise<string> {
  if (!config.apiKey) {
    throw new Error(`API key for provider ${config.name} is not set.`);
  }

  const endpoint = `${config.baseUrl}/chat/completions`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.apiKey}`,
  };

  // OpenRouter requires extra headers for leaderboard attribution
  if (config.name === 'openrouter') {
    headers['HTTP-Referer'] = process.env.NEXTAUTH_URL || 'https://theviralfindsmy.com';
    headers['X-Title'] = 'TheViralFindsMY';
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: config.defaultModel,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(`Provider ${config.name} returned HTTP ${res.status}: ${errorBody.slice(0, 200)}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error(`Provider ${config.name} returned an empty response.`);
  }

  return content.trim();
}

/**
 * Universal text generation with multi-provider failover.
 */
export async function generateWithFailover(options: AIGenerateOptions): Promise<{ text: string; providerUsed: AIProvider }> {
  const configs = getProviderConfigs();
  const preferred = options.provider || (process.env.AI_PROVIDER as AIProvider) || 'nvidia';

  // Sort providers so preferred comes first, followed by others in order
  const ordered = [
    ...configs.filter((c) => c.name === preferred),
    ...configs.filter((c) => c.name !== preferred),
  ];

  let lastError: Error | null = null;

  for (const config of ordered) {
    if (!config.apiKey) continue; // Skip unconfigured provider

    try {
      const text = await callProvider(config, options.messages, options.temperature, options.maxTokens);
      return { text, providerUsed: config.name };
    } catch (err: any) {
      console.warn(`[AI Router] ${config.name} failed: ${err.message}. Trying next provider...`);
      lastError = err;
    }
  }

  throw new Error(`All configured AI providers failed. Last error: ${lastError?.message || 'No API keys configured.'}`);
}

/**
 * Generate high-converting 30-second TikTok / Shorts script with 3-part viral hook formula.
 */
export async function generateViralVideoScript(opts: ViralScriptOptions): Promise<string> {
  const dialectRule = DIALECT_INSTRUCTIONS[opts.language || 'bahasa'] || DIALECT_INSTRUCTIONS.bahasa;
  
  const systemPrompt = `Anda adalah pakar pencipta kandungan video affiliate Shopee & TikTok Shop No.1 di Malaysia.
Tugasan anda adalah menjana skrip video 30 saat yang mengikut formula viral:
1. [0-3s] HOOK VIRAL: Tangkap perhatian serta-merta dengan rasa ingin tahu atau masalah harian yang menyakitkan.
2. [3-15s] THE PROBLEM & AGITATION: Ceritakan situasi masalah yang dialami audiens.
3. [15-25s] THE SOLUTION & DEMO: Tunjukkan produk ini sebagai penyelamat dengan kelebihan unik.
4. [25-30s] CALL TO ACTION: Arahkan audiens klik link kuning / bio / komen sebelum promo habis.

Gaya Bahasa:
${dialectRule}
Nada (Tone): ${opts.tone || 'racun'}`;

  const userPrompt = `Jana skrip video viral untuk produk berikut:
- Nama Produk: ${opts.product}
- Niche: ${opts.niche || 'Umum'}
- Platform Sasaran: ${opts.platform || 'tiktok'}
- Sasaran Audiens: ${opts.targetAudience || 'Pengguna Shopee Malaysia'}

Sertakan juga panduan visual (scene cues) ringkas dalam kurungan [ ] supaya mudah dirakam.`;

  const { text } = await generateWithFailover({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    maxTokens: 1200,
  });

  return text;
}

/**
 * Generate engaging Telegram / WhatsApp broadcast post (Format Racun Shopee).
 */
export async function generateTelegramBroadcastPost(opts: SocialCaptionOptions): Promise<string> {
  const dialectRule = DIALECT_INSTRUCTIONS[opts.language || 'bahasa'] || DIALECT_INSTRUCTIONS.bahasa;

  const systemPrompt = `Anda adalah kurator deal dan racun Shopee/TikTok Malaysia profesional.
Tugasan: Jana posting siaran Telegram/WhatsApp yang padat, menarik, kemas, dan memicu pembelian impulsif (FOMO).
Gunakan format perenggan kemas, emoji berkaitan, dan elak perenggan terlalu panjang.
${dialectRule}`;

  const userPrompt = `Sila bina mesej racun affiliate untuk:
- Produk: ${opts.product}
- Harga Asal: ${opts.originalPrice ? `RM${opts.originalPrice}` : 'Harga Biasa'}
- Harga Promo: ${opts.discountPrice ? `RM${opts.discountPrice}` : 'Promosi Menarik'}
- Komisen / Diskaun: ${opts.commissionRate ? `${opts.commissionRate}%` : 'Diskaun Khas'}
- Kelebihan Utama: ${opts.keyFeatures ? opts.keyFeatures.join(', ') : 'Kualiti padu, rating tinggi'}
- Link Affiliate: ${opts.affiliateUrl}

Formatkan dengan tajuk menarik [HOT DEAL 🔥], poin penting kelebihan, dan butang/link CTA di bahagian bawah.`;

  const { text } = await generateWithFailover({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.6,
    maxTokens: 800,
  });

  return text;
}
