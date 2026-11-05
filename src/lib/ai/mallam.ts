import { generateWithFailover } from './router';

export interface MallamGenerateOptions {
  type: string;
  product: string;
  niche?: string;
  platform?: string;
  language?: string;
  tone?: string;
}

const DIALECT_PROMPTS: Record<string, string> = {
  kelate: 'Gunakan loghat Kelantan (Kelate) yang pekat. Gunakan perkataan seperti "gapo", "sohor", "bekwoh", "gak", "nyaknyo", "demo", "kawe", "kemah keming". Buat pembaca Kelantan rasa dekat dan percaya.',
  ganu: 'Gunakan loghat Terengganu (Ganu) yang pekat. Gunakan perkataan seperti "mung", "guane", "sapa", "dokang", "sangak", "dok", "nye", "kemas", "bulang". Jadikan ia bersahaja and mesra Pantai Timur.',
  utara: 'Gunakan loghat Utara (Kedah/Penang) yang pekat. Gunakan perkataan seperti "hang", "depa", "habaq", "ligan", "cemuih", "segak", "ketegaq", "pi", "tula". Sesuai untuk audiens di Kedah, Perlis, dan Pulau Pinang.',
  manglish: 'Mix English and Bahasa Malaysia dynamically in typical Malaysian Manglish. Use words like "lah", "leh", "weih", "gila", "confirm", "best giler", "cannot go", "chop", "bojio", "steady". Keep the tone natural and highly engaging.',
  bahasa: 'Tulis dalam Bahasa Malaysia standard tetapi kasual, seolah-olah bercakap dengan rakan rapat. Tambah slanga tempatan yang popular di media sosial.',
};

export class MallamClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.MALLAM_API_KEY || '';
    this.baseUrl = process.env.MALLAM_BASE_URL || 'https://api.mesolitica.com/v1';
  }

  async generate(options: MallamGenerateOptions): Promise<string> {
    const { type, product, niche, platform, language = 'manglish', tone = 'casual' } = options;

    const dialectInstruction = DIALECT_PROMPTS[language.toLowerCase()] || DIALECT_PROMPTS.manglish;
    const prompt = `You are a professional Malaysian affiliate content creator. Generate a highly converting post.
    Product: ${product}
    Niche/Category: ${niche || 'General'}
    Platform: ${platform || 'social media'}
    Post Type: ${type}
    Tone: ${tone}
    
    Style Instructions:
    ${dialectInstruction}
    
    Make it punchy, authentic, and ready to convert readers into buyers immediately.`;

    try {
      const { text } = await generateWithFailover({
        messages: [
          { role: 'system', content: 'You are an expert Malaysian e-commerce affiliate marketer.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        maxTokens: 1000,
      });
      return text;
    } catch (err: any) {
      console.warn('AI Multi-Router fallback notice:', err.message);
      return `Dapatkan ${product} sekarang di Shopee/TikTok Shop! Tawaran terhad & rating tinggi. Klik link sekarang!`;
    }
  }
}
