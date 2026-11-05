import ZAI from 'z-ai-web-dev-sdk'
import { createOpenAI } from '@ai-sdk/openai'
import { Agent } from '@mastra/core/agent'
import { createTool } from '@mastra/core/tools'
import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/libsql'
import { z } from 'zod'
import { getShopeeServiceFromDB } from '../shopee/affiliate-api'
import { getLazadaServiceFromDB } from '../lazada/affiliate-service'
import path from 'path'

// Load ZAI configuration dynamically from the SDK instance
async function getZaiConfig() {
  try {
    const zai = await ZAI.create()
    const config = (zai as any).config
    if (config?.baseUrl && config?.apiKey) {
      return {
        baseUrl: config.baseUrl,
        apiKey: config.apiKey,
        model: config.model || 'hermes-3',
      }
    }
  } catch (error) {
    console.error('Failed to load ZAI config from SDK:', error)
  }

  // Fallback to Universal AI Multi-Router (NVIDIA NIM / OpenRouter / Kilo)
  return {
    baseUrl: process.env.NVIDIA_NIM_BASE_URL || process.env.OPENROUTER_BASE_URL || process.env.KILO_BASE_URL || 'https://integrate.api.nvidia.com/v1',
    apiKey: process.env.NVIDIA_NIM_API_KEY || process.env.OPENROUTER_API_KEY || process.env.KILO_API_KEY || 'dummy-key',
    model: process.env.NVIDIA_NIM_MODEL || process.env.OPENROUTER_MODEL || 'meta/llama-3.3-70b-instruct',
  }
}

// ─── Shopee Search Tool ─────────────────────────────────────────
export const shopeeSearchTool = createTool({
  id: 'shopee-product-search',
  description: 'Search live product details, prices, and commission rates on Shopee Malaysia using keywords.',
  inputSchema: z.object({
    query: z.string().describe('The product keyword or search query (e.g. "wireless earbuds", "baju kurung")'),
    limit: z.number().optional().default(5).describe('The number of products to return (maximum 10)'),
  }),
  execute: async ({ query, limit }) => {
    try {
      const shopeeService = await getShopeeServiceFromDB()
      if (!shopeeService) {
        return { error: 'Shopee service is currently unavailable.' }
      }
      const actualLimit = Math.min(limit, 10)
      const result = await shopeeService.searchProducts(query, {
        limit: actualLimit,
        page: 1,
      })
      return {
        products: result.products.map((p) => ({
          itemId: p.itemId,
          name: p.name,
          price: p.price,
          commissionRate: p.commissionRate,
          sales: p.sales,
          ratingStar: p.ratingStar,
          shopName: p.shopName,
          productLink: p.productLink,
        })),
        total: result.total,
        source: result.source,
      }
    } catch (error: any) {
      return { error: error.message || 'Failed to search Shopee products.' }
    }
  },
})

// ─── Lazada Search Tool ─────────────────────────────────────────
export const lazadaSearchTool = createTool({
  id: 'lazada-product-search',
  description: 'Search live product details, prices, and commission rates on Lazada Malaysia using keywords.',
  inputSchema: z.object({
    query: z.string().describe('The product keyword or search query (e.g. "skincare set", "power bank")'),
    limit: z.number().optional().default(5).describe('The number of products to return (maximum 10)'),
  }),
  execute: async ({ query, limit }) => {
    try {
      const lazadaService = await getLazadaServiceFromDB()
      const actualLimit = Math.min(limit, 10)
      const result = await lazadaService.searchProducts(query, {
        limit: actualLimit,
        page: 1,
      })
      return {
        products: result.products.map((p) => ({
          itemId: p.itemId,
          name: p.name,
          price: p.price,
          commissionRate: p.commissionRate,
          sales: p.sales,
          ratingStar: p.ratingStar,
          shopName: p.shopName,
          productLink: p.productLink,
        })),
        total: result.total,
        source: result.source,
      }
    } catch (error: any) {
      return { error: error.message || 'Failed to search Lazada products.' }
    }
  },
})

// ─── Get SQLite Storage Path ─────────────────────────────────────
function getSqlitePath() {
  const dbUrl = process.env.DATABASE_URL || 'file:prisma/dev.db'
  if (dbUrl.startsWith('file:')) {
    let p = dbUrl.substring(5)
    // Handle windows path issues or absolute path issues
    if (p.startsWith('/') && process.platform === 'win32') {
      p = p.substring(1)
    }
    return p
  }
  return 'prisma/dev.db'
}

// ─── Hermes Agent Factory ────────────────────────────────────────
export async function getHermesAgent() {
  const zConfig = await getZaiConfig()

  // Initialize OpenAI-compatible provider pointing to ZAI endpoint
  const zaiProvider = createOpenAI({
    baseURL: zConfig.baseUrl,
    apiKey: zConfig.apiKey,
  })

  // Setup persistent long-term storage in the same SQLite database
  const sqliteFile = getSqlitePath()
  const absoluteSqlitePath = path.resolve(process.cwd(), sqliteFile)

  const memory = new Memory({
    storage: new LibSQLStore({
      id: 'hermes-agent-memory',
      url: `file:${absoluteSqlitePath}`,
    }),
    options: {
      workingMemory: {
        enabled: true,
      },
    },
  })

  const agent = new Agent({
    name: 'Hermes',
    instructions: `You are Hermes, a Shopee & Lazada Affiliate Marketing Expert AI Agent. You help affiliate marketers optimize their campaigns, analyze product trends, generate promotional content, and maximize their earnings on Shopee and Lazada Malaysia.

Key expertise areas:
- Shopee & Lazada affiliate program strategies and best practices
- Product selection and commission optimization
- Content creation for affiliate marketing (social media, blogs, reviews)
- Campaign performance analysis and improvement
- Market trend analysis for Malaysian e-commerce
- SEO optimization for affiliate content
- Conversion rate optimization techniques

Always provide actionable, practical advice. Use data-driven insights when possible. Format responses with clear headings and bullet points when appropriate. Be concise but thorough.`,
    model: zaiProvider(zConfig.model),
    memory,
    tools: {
      shopeeSearch: shopeeSearchTool,
      lazadaSearch: lazadaSearchTool,
    },
  })

  return agent;
}
