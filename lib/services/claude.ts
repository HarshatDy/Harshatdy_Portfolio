import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const MODEL = 'claude-haiku-4-5-20251001'

export interface NewsletterResult {
  subject: string
  htmlBody: string
  tokensUsed: number
}

/**
 * Generate a newsletter for a given domain using source content from Notion.
 */
export async function generateNewsletter(
  domain: string,
  domainLabel: string,
  sourceContent: string,
  date: string,
): Promise<NewsletterResult> {
  const prompt = `You are writing a daily technical newsletter called "${domainLabel} Daily" for ${date}.

Use the following source material to write an engaging, informative newsletter:

<source_content>
${sourceContent}
</source_content>

Write the newsletter in HTML format. Include:
1. A compelling subject line (return as the FIRST line: "Subject: <your subject>")
2. A brief greeting
3. 3-5 key insights or updates from the source material
4. Each insight as a section with a bold heading
5. A closing thought or call to action
6. Unsubscribe note at bottom: "To unsubscribe, visit {{UNSUBSCRIBE_LINK}}"

Keep the tone professional but approachable. Total length: 400-600 words.
Return valid HTML for the email body (no <html>/<head> tags, just body content).`

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  })

  const rawText = response.content[0].type === 'text' ? response.content[0].text : ''
  const lines = rawText.split('\n')
  const subjectLine = lines.find((l) => l.startsWith('Subject:'))
  const subject = subjectLine
    ? subjectLine.replace('Subject:', '').trim()
    : `${domainLabel} Daily — ${date}`
  const htmlBody = lines.filter((l) => !l.startsWith('Subject:')).join('\n')

  return {
    subject,
    htmlBody,
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
  }
}

export interface StockAnalysisResult {
  analyses: Record<
    string,
    { analysis: string; sentiment: 'bullish' | 'bearish' | 'neutral'; key_points: string[] }
  >
  tokensUsed: number
}

/**
 * Generate analysis for multiple stocks in a single batched Claude call.
 * priceHistory: { AAPL: [{ date, close }, ...], ... }
 */
export async function analyzeStocks(
  priceHistory: Record<string, { date: string; close: number }[]>,
): Promise<StockAnalysisResult> {
  const tickers = Object.keys(priceHistory)
  if (tickers.length === 0) return { analyses: {}, tokensUsed: 0 }

  const dataStr = tickers
    .map((ticker) => {
      const prices = priceHistory[ticker]
        .slice(0, 30)
        .map((p) => `${p.date}: $${p.close}`)
        .join(', ')
      return `${ticker}: ${prices}`
    })
    .join('\n')

  const prompt = `Analyze these stocks based on their recent 30-day closing prices.
For each stock provide a brief analysis (2 sentences), sentiment (bullish/bearish/neutral), and 3 key bullet points.

Price data:
${dataStr}

Return a JSON object (no markdown) in exactly this format:
{
  "TICKER": {
    "analysis": "2 sentence analysis...",
    "sentiment": "bullish",
    "key_points": ["point 1", "point 2", "point 3"]
  }
}`

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  })

  const rawText = response.content[0].type === 'text' ? response.content[0].text : '{}'
  const cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
  let analyses: StockAnalysisResult['analyses'] = {}
  try {
    analyses = JSON.parse(cleaned)
  } catch (err) {
    console.error('[analyzeStocks] JSON parse failed. Raw response:', rawText, err)
  }

  return {
    analyses,
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
  }
}

import type { IndiaStockAnalysisResult } from '@/app/data/types/indiaFinance'

/**
 * Generate target price, upside %, and rationale for multiple Indian stocks
 * in a single batched Claude Haiku call.
 */
export async function analyzeIndiaStocks(
  stocksData: Array<{
    ticker: string
    name: string
    currentPrice: number
    score: number
    signal: 'BUY' | 'HOLD' | 'SELL'
    prices7d: number[]
  }>,
): Promise<IndiaStockAnalysisResult> {
  if (stocksData.length === 0) return { analyses: {}, tokensUsed: 0 }

  const dataStr = stocksData
    .map((s) => {
      const priceList = s.prices7d.slice(0, 7).join(', ')
      return `${s.ticker} (${s.name}): currentPrice=₹${s.currentPrice}, score=${s.score}, signal=${s.signal}, 7d_prices=[${priceList}]`
    })
    .join('\n')

  const prompt = `You are a financial analyst specialising in Indian equities (NSE/BSE).
Analyse each stock below and return a JSON object with your assessment.

Stock data (prices in INR, newest first):
${dataStr}

Return a JSON object (no markdown, no explanation) in exactly this format:
{
  "TICKER": {
    "rationale": "1-2 sentence rationale referencing price action and signal",
    "target_price": <number — realistic 3-month target in INR>,
    "upside_pct": <number — percent upside from current price, can be negative>
  }
}

Include every ticker listed above. Be concise and data-driven.`

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2500,
    messages: [{ role: 'user', content: prompt }],
  })

  const rawText = response.content[0].type === 'text' ? response.content[0].text : '{}'
  const cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
  let analyses: IndiaStockAnalysisResult['analyses'] = {}
  try {
    analyses = JSON.parse(cleaned)
  } catch (err) {
    console.error('[analyzeIndiaStocks] JSON parse failed. Raw response:', rawText, err)
  }

  return {
    analyses,
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
  }
}
