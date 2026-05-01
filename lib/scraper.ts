import { chromium } from "playwright";
import type { Quote, ScrapeResult } from "@/types";

// Load credentials and base URL from environment variables
const BASE_URL = process.env.SCRAPE_URL;
const USERNAME = process.env.SCRAPE_USERNAME;
const PASSWORD = process.env.SCRAPE_PASSWORD;

async function scrapeQuotes(): Promise<ScrapeResult> {
  if (!BASE_URL || !USERNAME || !PASSWORD) {
    throw new Error(
      "Missing required environment variables: SCRAPE_URL, SCRAPE_USERNAME, SCRAPE_PASSWORD",
    );
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (err) {
    throw new Error(`Failed to launch browser: ${err instanceof Error ? err.message : "Unknown error"}`);
  }

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to login page and authenticate
    await page.goto(`${BASE_URL}/login`);
    await page.fill("input[name='username']", USERNAME);
    await page.fill("input[name='password']", PASSWORD);
    await page.click("input[type='submit']");

    // Wait for redirect to confirm successful login
    await page.waitForURL(`${BASE_URL}/`);

    const quotes: Quote[] = [];
    let nextPageUrl: string | null = `${BASE_URL}/`;

    // Paginate through all available pages until no "next" button is found
    while (nextPageUrl) {
      await page.goto(nextPageUrl);

      // Extract all quotes from the current page using browser context
      const pageQuotes = await page.evaluate((): Quote[] => {
        const quoteElements = document.querySelectorAll(".quote");

        return Array.from(quoteElements).map((el) => ({
          text:
            el
              .querySelector(".text")
              ?.textContent?.replace(/[""]/g, "")
              .trim() ?? "",
          author: el.querySelector(".author")?.textContent?.trim() ?? "",
          tags: Array.from(el.querySelectorAll(".tag")).map(
            (tag) => tag.textContent?.trim() ?? "",
          ),
        }));
      });

      quotes.push(...pageQuotes);

      // Check if a next page link exists and build the full URL
      const nextLink = await page.$("li.next > a");
      if (nextLink) {
        const href = await nextLink.getAttribute("href");
        nextPageUrl = href ? `${BASE_URL}${href}` : null;
      } else {
        nextPageUrl = null;
      }
    }

    // Derive unique author count from the collected quotes
    const uniqueAuthors = new Set(quotes.map((q) => q.author));

    return {
      quotes,
      totalQuotes: quotes.length,
      totalAuthors: uniqueAuthors.size,
      lastUpdated: new Date().toISOString(),
    };
  } finally {
    // Always close the browser regardless of success or failure
    await browser.close();
  }
}

export default scrapeQuotes;
