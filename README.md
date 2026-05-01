# Quote Dashboard

A modern Next.js web application for browsing, searching, and filtering inspirational quotes scraped from external sources. Features a sleek dark/light theme, pagination, copy-to-clipboard, and smooth performance optimizations.

![Quote Dashboard Screenshot](/scrapevisualizer/images/dashboard.png)

## Features

- **Quote Browsing** - View quotes with author attribution and tags
- **Search & Filter** - Filter quotes by text content, author, or tags
- **Pagination** - 50 quotes per page with smooth navigation
- **Theme Toggle** - Switch between light and dark modes
- **Copy to Clipboard** - One-click copy of quotes with author
- **Expandable Quotes** - View full quote or truncated preview
- **Responsive Design** - Works on desktop and mobile
- **Performance Optimized** - Uses React best practices for smooth interactions

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with CSS Variables
- **Scraping**: Playwright (browser automation)
- **State**: React Hooks (useState, useMemo, useCallback, useDeferredValue)

## Prerequisites

- Node.js 18+
- npm or yarn
- A source website with quotes (configure via environment variables)

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd scrapevisualizer
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory:

```env
# Required - Source website credentials
SCRAPE_URL=https://your-quote-website.com
SCRAPE_USERNAME=your_username
SCRAPE_PASSWORD=your_password
```

4. Run the development server:

```bash
npm run dev
```

## Environment Variables

| Variable          | Description                          | Required |
| ----------------- | ------------------------------------ | -------- |
| `SCRAPE_URL`      | Base URL of the quote source website | Yes      |
| `SCRAPE_USERNAME` | Username for authentication          | Yes      |
| `SCRAPE_PASSWORD` | Password for authentication          | Yes      |

## How It Works

1. **Data Fetching**: The `/api/scrape` endpoint uses Playwright to log into the source website, navigate through paginated quote pages, and extract quote data (text, author, tags).

2. **Client Rendering**: The frontend fetches data from the API and displays quotes in a responsive grid layout.

3. **Filtering**: Search and tag filters use `useDeferredValue` and `startTransition` for smooth, non-blocking interactions.

4. **Theming**: CSS variables define semantic colors that automatically switch between light and dark modes by toggling the `.dark` class on the `<html>` element.

## License

MIT License

## Acknowledgments

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Playwright](https://playwright.dev)
