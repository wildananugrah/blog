# Blog App - Project Context

## Project Overview
A simple blog application with JSON-based storage (no database), PDF reader, and Editor.js integration.

## Tech Stack
- **Frontend**: Vite + React + TypeScript (running on Bun)
- **Backend**: Hono (running on Bun)
- **Editor**: Editor.js (with image upload support)
- **Styling**: Tailwind CSS
- **Storage**: JSON files (one per article) + PDF files in `data/` folder

## Key Decisions
- One JSON file per article (easier git diffs)
- PDF upload via UI (admin mode only)
- Tags/Categories for organizing content
- Server-side search (title + excerpt) with pagination
- No authentication - access control via `ADMIN_MODE` env variable
- `ADMIN_MODE=true` → can add/edit/delete (local dev)
- `ADMIN_MODE=false` → read-only (staging/production)

## Project Structure
```
blog-app/
├── frontend/          # Vite React app (port 5173)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route pages
│   │   ├── hooks/        # Custom React hooks
│   │   ├── api/          # API client
│   │   └── types/        # TypeScript types
│   ├── .env              # Frontend config (VITE_API_URL, VITE_ALLOWED_HOSTS)
│   └── vite.config.ts    # Vite config with proxy
├── backend/           # Hono server (port 3001)
│   ├── src/
│   │   ├── routes/       # API route handlers
│   │   ├── services/     # Business logic
│   │   └── middleware/   # Admin guard, etc.
│   └── .env              # Backend config (ADMIN_MODE, PORT, CORS_ORIGINS)
├── data/
│   ├── articles/      # JSON files (one per article)
│   ├── pdfs/          # PDF files + index.json
│   └── uploads/       # Uploaded images from Editor.js
├── .env.example
└── package.json       # Root scripts
```

## Environment Variables

### Backend (`backend/.env`)
```env
ADMIN_MODE=true                    # Enable admin mode
PORT=3001                          # Server port
CORS_ORIGINS=http://localhost:5173 # Allowed CORS origins (comma-separated)
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3001  # Backend API URL
VITE_ALLOWED_HOSTS=localhost        # Allowed hosts (comma-separated)
```

## Commands
```bash
# Install all dependencies
cd frontend && bun install
cd backend && bun install

# Development (run in separate terminals)
cd backend && bun run dev    # Backend on http://localhost:3001
cd frontend && bun run dev   # Frontend on http://localhost:5173

# Build frontend for production
cd frontend && bun run build
```

## API Endpoints

### Articles
- `GET /api/articles` - List articles (with search & pagination)
  - Query params: `?search=text&tag=tagname&page=1&limit=10`
  - Returns: `{ articles, total, page, limit, totalPages }`
- `GET /api/articles/:slug` - Get single article
- `POST /api/articles` - Create article (admin)
- `PUT /api/articles/:slug` - Update article (admin)
- `DELETE /api/articles/:slug` - Delete article (admin)

### PDFs
- `GET /api/pdfs` - List PDFs
- `GET /api/pdfs/:id` - Get PDF file
- `GET /api/pdfs/:id/metadata` - Get PDF metadata
- `POST /api/pdfs` - Upload PDF (admin)
- `DELETE /api/pdfs/:id` - Delete PDF (admin)

### Uploads
- `POST /api/uploads/image` - Upload image for Editor.js (admin)
- `GET /api/uploads/:filename` - Serve uploaded image

### Config
- `GET /api/config` - Get admin mode status

## Implementation Status
- [x] Project setup (Bun, Vite, Hono)
- [x] Backend API with CORS config
- [x] Frontend core components
- [x] Article list/view with search & pagination
- [x] Editor.js integration with image upload
- [x] PDF reader with upload
- [x] Styling (Tailwind - black/white/gray theme)
- [x] Environment configuration (.env files)

## Notes for Claude
- Articles are stored as individual JSON files in `data/articles/`
- PDF metadata is in `data/pdfs/index.json`, actual files in `data/pdfs/`
- Uploaded images stored in `data/uploads/`
- Admin guard middleware blocks write operations when `ADMIN_MODE=false`
- Editor.js content is stored as JSON in the article's `content` field
- Frontend proxies `/api` requests to backend in dev mode (see vite.config.ts)
- Search is server-side, searches title + excerpt fields

## Key Files
- `backend/src/index.ts` - Main server entry with CORS config
- `backend/src/middleware/adminGuard.ts` - Admin mode check
- `backend/src/services/articleService.ts` - Article CRUD with search/pagination
- `backend/src/routes/uploads.ts` - Image upload for Editor.js
- `frontend/src/App.tsx` - Main React app with routes
- `frontend/src/pages/Home.tsx` - Article list with search & pagination
- `frontend/src/hooks/useAdmin.ts` - Admin context provider
- `frontend/src/components/ArticleEditor.tsx` - Editor.js wrapper with image tool
- `frontend/vite.config.ts` - Vite config with env-based proxy and allowed hosts
