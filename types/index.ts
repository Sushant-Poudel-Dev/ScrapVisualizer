// Represents a single quote scraped from the site
export interface Quote {
  text: string;
  author: string;
  tags: string[];
}

// The full result returned after a scrape session
export interface ScrapeResult {
  quotes: Quote[];
  totalQuotes: number;
  totalAuthors: number;
  lastUpdated: string;
}

// Standard API response envelope used across all endpoints
export interface ApiResponse {
  success: boolean;
  data?: ScrapeResult;
  error?: string;
}
