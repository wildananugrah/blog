# Blog App

A simple blog application with articles, PDF reader, and infographics viewer. Built with React (Vite) frontend and Hono (Bun) backend.

## Features

- **Articles** - Markdown-based articles with search, tags, and pagination
- **PDFs** - Upload and view PDF documents with metadata
- **Infographics** - Image gallery with fullscreen viewer and download
- **Admin Mode** - Toggle admin features via environment variable

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router
- React Markdown (GFM support)

**Backend:**
- Hono (Bun runtime)
- JSON file storage

## Project Structure

```
blog-app/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   └── types/         # TypeScript types
│   └── package.json
│
├── backend/                # Hono backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── middleware/    # Middleware (admin guard)
│   └── package.json
│
├── data/                   # Content storage
│   ├── articles/          # Markdown files + index.json
│   ├── pdfs/              # PDF files + index.json
│   └── infographics/      # Image files + index.json
│
└── package.json            # Root package.json
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.0+

### Installation

```bash
# Install all dependencies
bun install
```

### Development

```bash
# Run both frontend and backend
bun run dev

# Or run separately:
bun run dev:backend   # Backend on http://localhost:3001
bun run dev:frontend  # Frontend on http://localhost:5173
```

### Build

```bash
bun run build
```

## Configuration

### Backend (.env)

```env
ADMIN_MODE=true              # Enable admin features
PORT=3001                    # Backend port
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (.env)

```env
VITE_PORT=5173               # Frontend port
VITE_API_URL=http://localhost:3001
VITE_ALLOWED_HOSTS=localhost
```

## Content Management

### Articles

Articles are stored as Markdown files in `data/articles/`. To add an article:

1. Add metadata to `data/articles/index.json`:

```json
{
  "articles": [
    {
      "slug": "my-article",
      "filename": "my-article.md",
      "title": "My Article Title",
      "excerpt": "A short description",
      "tags": ["tag1", "tag2"],
      "createdAt": "2024-01-10T00:00:00Z"
    }
  ]
}
```

2. Create `data/articles/my-article.md` with your content.

### PDFs & Infographics

Upload via the Admin page when `ADMIN_MODE=true`, or manually:

1. Place file in `data/pdfs/` or `data/infographics/`
2. Add entry to corresponding `index.json`

## API Endpoints

### Articles
- `GET /api/articles` - List articles (search, tag, page, limit)
- `GET /api/articles/:slug` - Get article by slug

### PDFs
- `GET /api/pdfs` - List PDFs
- `GET /api/pdfs/:id` - Get PDF file
- `GET /api/pdfs/:id/metadata` - Get PDF metadata
- `POST /api/pdfs` - Upload PDF (admin)
- `DELETE /api/pdfs/:id` - Delete PDF (admin)

### Infographics
- `GET /api/infographics` - List infographics
- `GET /api/infographics/:id` - Get image file
- `GET /api/infographics/:id/metadata` - Get metadata
- `POST /api/infographics` - Upload infographic (admin)
- `DELETE /api/infographics/:id` - Delete infographic (admin)

### Config
- `GET /api/config` - Get app config (adminMode status)

## License

MIT
