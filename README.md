# Smart Client Onboarding System

Automate client onboarding by uploading PDFs, Word documents, and voice notes. The system extracts text, analyzes businesses with AI (Google Gemini), and generates a structured dashboard.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, React Dropzone
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **AI:** Google Gemini API
- **File Processing:** pdf-parse (PDF), mammoth.js (DOCX), Gemini (audio transcription)

## Project Structure

```
├── backend/
│   ├── controllers/    # Request handlers
│   ├── database/       # Schema and connection
│   ├── routes/         # API routes
│   ├── services/       # Business logic, extraction, Gemini
│   └── server.js
├── frontend/
│   └── src/
│       ├── app/        # Next.js App Router pages
│       ├── components/
│       └── lib/        # API client
└── README.md
```

## Prerequisites

- Node.js 18+
- PostgreSQL
- [Google Gemini API key](https://ai.google.dev/)

## Setup

### 1. Clone and install dependencies

```bash
cd "clickfield AI"
npm install --prefix backend
npm install --prefix frontend
```

### 2. PostgreSQL database

**Option A: Render (recommended for cloud)**  
1. Go to [render.com](https://render.com) → Dashboard → New → PostgreSQL  
2. Name it (e.g. `smart-onboarding-db`), choose a region, click Create  
3. Wait for it to provision, then open the instance  
4. Copy the **Internal Database URL** (for backend on Render) or **External Database URL** (for local dev)  
5. Add `?sslmode=require` to the end if not already present

**Option B: Local PostgreSQL**  
```bash
createdb smart_onboarding
```

### 3. Environment variables

**Backend** – copy `backend/.env.example` to `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
DATABASE_SSL=true
PORT=3001
```

For Render: paste the URL from the Render dashboard. Set `DATABASE_SSL=true`.

**Frontend** (optional) – create `frontend/.env.local` if the API runs elsewhere:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Initialize database schema

```bash
cd backend
npm run db:init
```

### 5. Run the application

**Terminal 1 – Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 – Frontend:**

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Endpoints

| Method | Endpoint           | Description                    |
|--------|--------------------|--------------------------------|
| POST   | `/api/upload`      | Upload files, extract text     |
| POST   | `/api/analyze/:clientId` | Run AI analysis on client |
| GET    | `/api/clients`     | List all clients               |
| GET    | `/api/client/:id`  | Get client with analysis       |

## File Types Supported

- **PDF** – `pdf-parse`
- **DOCX** – `mammoth.js`
- **Audio** (MP3, WAV, etc.) – Gemini API transcription

## Usage

1. **Upload:** Go to Upload page, drag & drop files (or use file picker), optionally enter client name, click "Upload and analyze".
2. **Processing:** The app extracts text, transcribes audio, and runs AI analysis.
3. **Dashboard:** View clients and their structured insights (Business Model, Industry, Goals, Problems, Opportunities).

## Render PostgreSQL setup

1. **Create a PostgreSQL instance**  
   - [render.com](https://render.com) → Dashboard → New → PostgreSQL  
   - Name: `smart-onboarding-db` (or any name)  
   - Region: pick closest to you  
   - Plan: Free  
   - Create PostgreSQL  

2. **Get the connection URL**  
   - Open the new PostgreSQL instance  
   - Copy **External Database URL** (for local dev or backend on another host)  
   - Or **Internal Database URL** (only if backend is also on Render)  
   - Ensure it ends with `?sslmode=require` (add it if missing)

3. **Update `backend/.env`**
   ```env
   DATABASE_URL=postgresql://user:password@dpg-xxxxx.region.render.com/dbname?sslmode=require
   DATABASE_SSL=true
   GEMINI_API_KEY=your_key
   ```

4. **Initialize schema**
   ```bash
   cd backend
   npm run db:init
   ```

5. **Verify** – `GET http://localhost:3001/api/health/db` should return `{ "database": "connected" }`

## Troubleshooting

**"Database connection refused"** (local PostgreSQL)  
- Install and start PostgreSQL locally, or use Render (see above).

**Render connection fails**
- Use **External** URL when running backend locally; **Internal** only when backend is on Render.  
- Add `?sslmode=require` to the URL.  
- Ensure `DATABASE_SSL=true` in `.env`.

**Backend not responding**  
- Start backend: `cd backend && npm run dev`  
- Backend: port 3001, frontend: port 3000.
