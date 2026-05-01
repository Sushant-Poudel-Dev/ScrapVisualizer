import { NextResponse } from "next/server";
import scrapeQuotes from "@/lib/scraper";
import type { ApiResponse, ScrapeResult } from "@/types";

// Module-level cache persists between requests within the same server instance.
// This avoids re-launching Playwright on every request unless explicitly refreshed.
let cache: ScrapeResult | null = null;

export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    // Run the Playwright scraper and update the cache
    const result = await scrapeQuotes();
    cache = result;

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    // Log the full error server-side for debugging
    console.error("[/api/scrape] Scrape failed:", error);

    // If scrape fails but we have stale data, return it rather than erroring out
    if (cache) {
      console.warn("[/api/scrape] Returning stale cache due to scrape failure");
      return NextResponse.json({
        success: true,
        data: cache,
      });
    }

    // No cache available — return a proper error response
    return NextResponse.json(
      {
        success: false,
        error: "Failed to scrape quotes. Please try again.",
      },
      { status: 500 },
    );
  }
}
