import * as cheerio from 'cheerio';

export async function scrapeWebsite(url) {
  try {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    const response = await fetch(fullUrl, {
      headers: { 'User-Agent': 'AI-Business-Growth-OS/1.0' },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();
    const $ = cheerio.load(html);

    $('script, style, nav, footer, header').remove();

    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content') || '';
    const headings = [];
    $('h1, h2, h3').each((_, el) => {
      const text = $(el).text().trim();
      if (text) headings.push(text);
    });

    const bodyText = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 3000);

    return { title, description, headings, bodyText, url: fullUrl };
  } catch (error) {
    return {
      title: '',
      description: '',
      headings: [],
      bodyText: '',
      url,
      error: error.message,
    };
  }
}

export function buildContextFromScrape(scraped, userInput) {
  if (scraped.error) {
    return userInput || 'No content available';
  }
  return `
Website: ${scraped.url}
Title: ${scraped.title}
Description: ${scraped.description}
Headings: ${scraped.headings.join(', ')}
Content: ${scraped.bodyText}
Additional Input: ${userInput || 'None'}
  `.trim();
}
